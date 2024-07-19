import { FrontEndTypo, Loading, post } from "@shiksha/common-lib";
import axios from "axios";
import { Alert, Box, HStack, Link, Text, VStack, useToast } from "native-base";
import { dataConfig } from "onest/card";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AudioPlayer from "../components/AudioPlayer";
import ExternalLink from "../components/ExternalLink";
import PDFViewer from "../components/PDFViewer";
import VideoPlayer from "../components/VideoPlayer";
import YouTubeEmbed from "../components/YouTubeEmbed";
import Layout from "../Layout";
import FormComponent from "./FormComponent";

const MediaPage = () => {
  const location = useLocation();
  const state = location?.state;
  const formData = state?.formData;
  const { type, itemId, transactionId } = useParams();
  const baseUrl = dataConfig[type].apiLink_API_BASE_URL;
  const db_cache = dataConfig[type].apiLink_DB_CACHE;
  const envConfig = dataConfig[type];

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [story, setStory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [product, setProduct] = useState();
  const [jobInfo, setJobInfo] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isAutoForm, setIsAutoForm] = useState(true);
  const toast = useToast();
  const [urlType, setUrlType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [userFormData, setUserFormData] = useState({});
  const [subscribed, setSuscribed] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    const getUrlParams = (url) => {
      const params = {};
      const parser = document.createElement("a");
      parser.href = url;
      const query = parser.search.substring(1);
      const vars = query.split("&");
      for (const pair of vars) {
        const [key, value] = pair.split("=");
        params[key] = decodeURIComponent(value);
      }
      return params;
    };

    const params = getUrlParams(url);

    if (params["agent-id"]) {
      localStorage.setItem("agent-id", params["agent-id"]);
    }

    if (params["distributor-name"]) {
      localStorage.setItem("distributor-name", params["distributor-name"]);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const jsonDataParam = urlParams.get("jsonData");

    if (jsonDataParam) {
      let jsonData = atob(jsonDataParam);
      localStorage.setItem("userData", jsonData);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(t("FETCHING_THE_DETAILS"));
      const userDataString = localStorage.getItem("userData");
      const userData = JSON.parse(userDataString);
      let trackData;
      if (envConfig?.getTrackData) {
        trackData = await envConfig.getTrackData({
          type,
          itemId,
          transactionId,
          user_id: userData?.user_id,
        });
      }
      if (trackData?.params?.type) {
        let product = JSON.parse(localStorage.getItem("searchProduct"));
        let obj = {
          item_id: itemId,
          title: product.title || "",
          description: product.description || "",
          provider_id: product.provider_id || "",
          provider_name: product.provider_name || "",
          bpp_id: product.bpp_id || "",
          bpp_uri: product.bpp_uri || "",
          icon: product.icon || "",
          descriptionshort: product.shortDescription || "",
          media_url: trackData?.params?.url,
        };
        setSuscribed(true);
        setOrderId(trackData?.order_id);
        setStory([obj]);
        setShowForm(false);
        setUrlType(trackData?.params?.type);
        setLoading(false);
      } else {
        var requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item_id: itemId }),
        };

        fetch(`${baseUrl}/content/search`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            result = JSON.parse(result);
            setJobInfo(result?.data[db_cache][0]);
            localStorage.setItem(
              "unique_id",
              result?.data[db_cache][0]?.unique_id
            );
            setProduct(result?.data[db_cache][0]);
            setLoading(false);
            localStorage.setItem(
              "searchProduct",
              JSON.stringify(result?.data[db_cache][0])
            );
            localStorage.setItem(
              "image_url",
              result?.data[db_cache][0].image_url
            );
          })
          .catch((error) => console.error("error", error));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (jobInfo) {
        let data = JSON.parse(localStorage.getItem("selectRes"));
        if (data && data?.responses.length) {
          await fetchInitDetails(data?.responses[0]);

          // let usrtemp = localStorage.getItem("userData");
          /* if(usrtemp){
       fetchInitDetails(data?.responses[0]);
       }else{
         setIsAutoForm(false);
         setLoading(false);
       }*/
        } else if (jobInfo) {
          getSelectDetails(jobInfo);
        }
      }
    };
    fetchData();
  }, [jobInfo, showForm]);

  const submitUserForm = (val) => {
    setUserFormData(val);
    setShowForm(false);
  };

  const getSelectDetails = async (info) => {
    setLoading(true);
    try {
      //setLoading(true);
      const response = await fetch(`${baseUrl}/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: {
            domain: envConfig?.apiLink_DOMAIN,
            action: "select",
            version: "1.1.0",
            bap_id: envConfig?.apiLink_BAP_ID,
            bap_uri: envConfig?.apiLink_BAP_URI,
            bpp_id: info?.bpp_id,
            bpp_uri: info?.bpp_uri,
            transaction_id: transactionId,
            message_id: uuidv4(),
            timestamp: new Date().toISOString(),
          },
          message: {
            order: {
              provider: {
                id: info?.provider_id,
              },
              items: [
                {
                  id: itemId,
                },
              ],
            },
          },
        }),
      });

      const data = await response.json();
      localStorage.setItem("details", JSON.stringify(data));
      if (!data?.responses?.length) {
        setLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      } else {
        data.responses[0]["context"]["message_id"] = uuidv4();
        fetchInitDetails();
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfirmMedia = async (customPram) => {
    const customInfo = customPram?.message?.order;
    setLoading(true);
    try {
      let details = JSON.parse(localStorage.getItem("details"))?.responses[0];

      let bodyData = {
        context: {
          domain: envConfig?.apiLink_DOMAIN,
          bap_id: envConfig?.apiLink_BAP_ID,
          bap_uri: envConfig?.apiLink_BAP_URI,
          transaction_id: transactionId,
          action: "confirm",
          version: "1.1.0",
          bpp_id: details?.context?.bpp_id,
          bpp_uri: details?.context?.bpp_uri,
          transaction_id: transactionId,
          message_id: uuidv4(),
          timestamp: new Date().toISOString(),
        },
        message: {
          order: {
            provider: {
              id: customInfo?.provider?.id,
            },
            items: [
              {
                id: customInfo?.items?.[0]?.id,
                fulfillment_ids: customInfo?.items[0]?.fulfillment_ids,
              },
            ],
            fulfillments: [
              {
                customer: {
                  person: {
                    name: customInfo?.fulfillments[0]?.customer?.person?.name, // Name from form data
                  },
                  contact: {
                    phone:
                      customInfo?.fulfillments[0]?.customer?.contact?.phone, // Phone from form data
                    email:
                      customInfo?.fulfillments[0]?.customer?.contact?.email, // Email from form data
                  },
                },
              },
            ],
          },
        },
      };

      // delete bodyData.message.order.items[0]["add-ons"];

      if (localStorage.getItem("tempTags")) {
        bodyData.message.order.fulfillments[0]["customer"]["person"]["tags"] =
          JSON.parse(localStorage.getItem("tempTags"));
      }
      if (localStorage.getItem("submissionId")) {
        bodyData.message.order.items[0]["xinput"] = {
          form: {
            submission_id: localStorage.getItem("submissionId")
              ? localStorage.getItem("submissionId")
              : "",
          },
        };
        // bodyData.message.order.items[0].xinput.form['submission_id'] = localStorage.getItem('submissionId')? localStorage.getItem('submissionId'): '';
      }
      setLoading(true);
      const result = await post(`${baseUrl}/confirm`, bodyData);
      let response = result?.data;

      if (response && response?.responses && response?.responses?.length > 0) {
        let arrayOfObjects = [];
        let uniqueItemIds = new Set();
        if (envConfig?.onOrderIdGenerate) {
          const userDataString = localStorage.getItem("userData");
          const userData = JSON.parse(userDataString);
          envConfig?.onOrderIdGenerate({
            response,
            userData,
            itemId,
            type,
            item: jobInfo,
          });
        }

        response?.responses?.forEach((responseItem) => {
          try {
            if (responseItem?.message && responseItem?.message?.order) {
              const order = responseItem?.message.order;
              let appId = responseItem.message.order.id;
              // order?.items?.[0].tags.forEach((tag) => {
              //   tag?.list.forEach((item) => {
              //     if (item.descriptor.code === "urlType") {
              //       let urlTypeValue = item.value;
              //       setUrlType(urlTypeValue);
              //     }
              //   });
              // });

              setOrderId(appId);
              window?.parent?.postMessage({ orderId: appId }, "*");
              if (order.items) {
                const items = order.items;
                order.fulfillments[0].stops.forEach((item) => {
                  if (!uniqueItemIds.has(item.id)) {
                    let mediaUrl = "";
                    mediaUrl = item.instructions.media[0].url;
                    let product = JSON.parse(
                      localStorage.getItem("searchProduct")
                    );
                    let obj = {
                      item_id: item.id,
                      title: product.title || "",
                      description: product.description || "",
                      provider_id: product.provider_id || "",
                      provider_name: product.provider_name || "",
                      bpp_id: product.bpp_id || "",
                      bpp_uri: product.bpp_uri || "",
                      icon: product.icon || "",
                      descriptionshort: product.shortDescription || "",
                      media_url: mediaUrl,
                    };
                    arrayOfObjects.push(obj);
                    uniqueItemIds.add(item.id);
                  }
                });
              } else {
                console.error("No items found in order");
              }
            }
          } catch (error) {
            console.error("Error processing response item:", error);
          }
        });

        setStory(arrayOfObjects);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
        console.error("No valid responses found.");
      }
    } catch (error) {
      errorMessage(
        t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
      );
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitDetails = async () => {
    if (!showForm) {
      setLoading(true);
      try {
        let details = JSON.parse(localStorage.getItem("details"))?.responses[0];
        let bodyData = {
          context: {
            domain: envConfig?.apiLink_DOMAIN,
            bap_id: envConfig?.apiLink_BAP_ID,
            bap_uri: envConfig?.apiLink_BAP_URI,
            transaction_id: transactionId,
            action: "init",
            version: "1.1.0",
            bpp_id: details?.context?.bpp_id,
            bpp_uri: details?.context?.bpp_uri,
            transaction_id: transactionId,
            message_id: uuidv4(),
            timestamp: new Date().toISOString(),
          },
          message: {
            order: {
              provider: {
                id: details?.message?.order?.provider?.id,
              },
              items: [
                {
                  id: details?.message?.order?.items[0]?.id,
                  fulfillment_ids:
                    details?.message?.order?.items[0]?.fulfillment_ids,
                },
              ],
              fulfillments: [
                {
                  customer: {
                    person: {
                      name: userFormData?.name, // Name from form data
                      // gender: userFormData?.gender,
                    },
                    contact: {
                      phone: `${userFormData?.phone}`, // Phone from form data
                      email: userFormData?.email, // Email from form data
                    },
                  },
                },
              ],
            },
          },
        };

        const result = await post(`${baseUrl}/init`, bodyData);
        const data = result?.data;
        localStorage.setItem("initRes", JSON.stringify(data?.responses?.[0]));

        if (!data || !data?.responses.length) {
          setLoading(false);
          errorMessage(
            t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
          );
        } else {
          if (
            data?.responses[0]?.message?.order?.items[0].hasOwnProperty(
              "xinput"
            ) &&
            data?.responses[0]?.message?.order?.items[0]?.xinput?.form?.url
          ) {
            const curr =
              data?.responses[0]?.message?.order?.items[0]?.xinput?.head?.index
                ?.cur;
            var max =
              data?.responses[0]?.message?.order?.items[0]?.xinput?.head?.index
                ?.max;
            var formUrl =
              data?.responses[0]?.message?.order?.items[0]?.xinput?.form?.url;
            if (curr < max) {
              searchForm(formUrl);
            } else if (curr == max) {
              setLoading(true);
              searchForm(formUrl);
              // fetchConfirmMedia();
            }
          } else {
            fetchConfirmMedia(JSON.parse(localStorage.getItem("initRes")));
          }
        }
      } catch (error) {
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  function hasSubmitButton() {
    return (
      document.querySelector('input[type="submit"]') !== null ||
      document.querySelector('button[type="submit"]') !== null
    );
  }

  function errorMessage(message) {
    toast.show({
      duration: 5000,
      pauseOnHover: true,
      variant: "solid",
      render: () => {
        return (
          <Alert w="100%" status={"error"}>
            <HStack space={2} alignItems={"center"}>
              <Alert.Icon color={type} />
              <FrontEndTypo.H3 color={type}>{message}</FrontEndTypo.H3>
            </HStack>
          </Alert>
        );
      },
    });
  }

  const searchForm = async (url) => {
    try {
      setLoading(t("FETCHING_THE_DETAILS"));
      await fetch(url, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((htmlContent) => {
          const container = document.getElementById("formContainer");
          if (container) {
            container.innerHTML = htmlContent;

            if (!hasSubmitButton()) {
              // addSubmitButton();
            }

            setIsAutoForm(true);
            const form = document.getElementsByTagName("form")[0];
            const inputFields = form.querySelectorAll("input");
            const btnField = form.querySelector("button");

            // if (btnField) {
            btnField.classList.add("autosubmit");
            // }

            // Add a CSS class to each input field
            inputFields.forEach((input) => {
              input.classList.add("autoInputField");
              //input.style.border = "1px solid #000"; // Replace 'your-css-class' with the desired class name
            });

            const selectFields = form.querySelectorAll("select");
            selectFields.forEach((select) => {
              select.classList.add("selectField");
            });

            const userDataString = localStorage.getItem("userData");
            const userData = JSON.parse(userDataString);

            if (userData !== null) {
              // Get all input elements in the HTML content
              const inputElements = form.querySelectorAll("input");

              // Loop through each input element
              inputElements.forEach((input) => {
                // Get the name attribute of the input element
                const inputName = input.getAttribute("name");

                // Check if the input name exists in the userData
                if (
                  userData &&
                  userData[inputName] !== undefined &&
                  input.type !== "file" &&
                  input.type !== "radio"
                ) {
                  // Set the value of the input element to the corresponding value from the userData
                  input.value = userData[inputName];
                }

                if (input.type === "checkbox" && userData[inputName] === true) {
                  input.checked = true;
                }

                if (
                  input.type === "radio" &&
                  userData[inputName] === input.value
                ) {
                  input.checked = true;
                }
              });

              const selectElements = form.querySelectorAll("select");

              // Loop through each select element
              selectElements.forEach((select) => {
                // Get the name attribute of the select element
                const selectName = select.getAttribute("name");

                // Check if the select name exists in the userData
                if (userData && userData[selectName] !== undefined) {
                  // Find the option with the corresponding value
                  const optionToSelect = select.querySelector(
                    `option[value="${userData[selectName]}"]`
                  );

                  // If the option is found, set its selected attribute to true
                  if (optionToSelect) {
                    optionToSelect.selected = true;
                  }
                }
              });
            }

            form.addEventListener("submit", (e) => {
              e.preventDefault();
              const formDataTmp = new FormData(form);
              var urlencoded = new URLSearchParams();

              let formDataObject = {};

              formDataTmp.forEach(function (value, key) {
                formDataObject[key] = value;
                urlencoded.append(key, value.toString());
              });

              localStorage.setItem(
                "autoFormData",
                JSON.stringify(formDataObject)
              );
              // setFormData({...formData['person'] , ...localStorage.getItem('autoFormData')})

              submitFormDetail(form.action, formDataTmp);
            });
          }
        });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const submitFormDetail = async (action, urlencoded) => {
    setLoading(t("SUBMITTING"));
    // trackReactGA();
    try {
      const axiosResponse = await axios.create().post(action, urlencoded, {
        headers: {
          "Content-Type": `application/x-www-form-urlencoded`,
        },
      });

      if (axiosResponse.data) {
        localStorage.setItem("submissionId", axiosResponse.data);
        setTimeout(() => {
          let initRes = JSON.parse(localStorage.getItem("initRes"));
          fetchConfirmMedia(initRes);
          // fetchInitDetails();
          // getInitJson();
        }, 7000);
      }
    } catch (error) {
      setLoading(false);
      if (
        error.hasOwnProperty("response") &&
        error.response.hasOwnProperty("data")
      ) {
        errorMessage(error?.response?.data);
      }
      console.error("Error submitting form:", error);
    }
  };

  const handleBack = () => {
    if (urlType) {
      navigate(`/${envConfig?.listLink}`);
    } else {
      navigate(`/${envConfig?.listLink}/${itemId}`);
    }
  };

  // transaction id
  if (loading) {
    return <Loading message={loading} />;
  }

  return (
    <Layout
      checkUserAccess
      _appBar={{
        onPressBackButton: handleBack,
      }}
    >
      {showForm && <FormComponent submitUserForm={submitUserForm} />}
      <Box p={4}>
        {!story.length && (
          <Box margin={4}>
            <div id="formContainer"></div>
          </Box>
        )}
        {error ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <Box textAlign="center">
              <Text fontSize="xl">{error}</Text>
              <button mt={4} onClick={handleBack}>
                Go Back
              </button>
            </Box>
          </div>
        ) : (
          <>
            {story.map((item, index) => {
              const mediaUrl = item.media_url;

              if (item.type == "BPP-EMBEDDABLE-PLAYER") {
                if (
                  mediaUrl.includes("youtube.com") ||
                  mediaUrl.includes("youtu.be")
                ) {
                  return (
                    <VStack pt={2} pb={20} mb={120}>
                      <Text
                        fontSize={22}
                        p={15}
                        fontWeight={500}
                        textAlign={"center"}
                      >
                        {subscribed
                          ? "You have already subscribed for this course ! "
                          : "Thanks for Subscribing ! "}
                        Your Subscription Id for this resources is:
                        <span>
                          <b>{orderId}</b>
                        </span>
                      </Text>
                      <YouTubeEmbed key={index} url={mediaUrl} />
                    </VStack>
                  );
                } else if (mediaUrl.endsWith(".mp3")) {
                  // MP3 audio
                  return (
                    <VStack pt={2} pb={20} mb={120}>
                      <Text
                        fontSize={22}
                        p={15}
                        fontWeight={500}
                        textAlign={"center"}
                      >
                        {subscribed
                          ? "You have already subscribed for this course ! "
                          : "Thanks for Subscribing ! "}
                        Your Subscription Id for this resources is:
                        <span>
                          <b>{orderId}</b>
                        </span>
                      </Text>
                      <AudioPlayer key={index} mediaUrl={mediaUrl} />
                    </VStack>
                  );
                } else if (mediaUrl.endsWith(".pdf")) {
                  // PDF document
                  return (
                    <VStack pt={2} pb={20} mb={120}>
                      <Text
                        fontSize={22}
                        p={15}
                        fontWeight={500}
                        textAlign={"center"}
                      >
                        {subscribed
                          ? "You have already subscribed for this course ! "
                          : "Thanks for Subscribing ! "}
                        Your Subscription Id for this resources is:
                        <span>
                          <b>{orderId}</b>
                        </span>
                      </Text>
                      <PDFViewer key={index} src={mediaUrl} />
                    </VStack>
                  );
                } else if (mediaUrl.endsWith(".mp4")) {
                  // MP4 video
                  return (
                    <VStack pt={2} pb={20}>
                      <Text
                        fontSize={22}
                        p={15}
                        fontWeight={500}
                        textAlign={"center"}
                      >
                        {subscribed
                          ? "You have already subscribed for this course ! "
                          : "Thanks for Subscribing ! "}
                        Your Subscription Id for this resources is:
                        <span>
                          <b>{orderId}</b>
                        </span>
                      </Text>
                      <VideoPlayer key={index} url={mediaUrl} />
                    </VStack>
                  );
                } else {
                  return (
                    <VStack pt={2} pb={20} mb={120}>
                      <Text
                        fontSize={22}
                        p={15}
                        fontWeight={500}
                        textAlign={"center"}
                      >
                        {subscribed
                          ? "You have already subscribed for this course ! "
                          : "Thanks for Subscribing ! "}
                        Your Subscription Id for this resources is:
                        <span>
                          <b>{orderId}</b>
                        </span>
                      </Text>
                      <ExternalLink key={index} url={mediaUrl} />
                    </VStack>
                  );
                }
              } else {
                return (
                  // <ExternalLink key={index} url={mediaUrl} />
                  <VStack
                    p={20}
                    mb={150}
                    background={"white"}
                    w={"80%"}
                    ml={"10%"}
                    border={"1"}
                  >
                    <Box maxW={"200px"} maxH={"200px"}>
                      {/* {localStorage.getItem('image_url') && <img width={'auto'} height={'auto'} maxW={'300px'} maxH={'300px'} src={localStorage.getItem('image_url')} alt="" />}
              {!localStorage.getItem('image_url') && <img width={'100px'} height={'100px'} src={image_url} alt="" />} */}
                    </Box>
                    <Text
                      fontSize={20}
                      py={15}
                      color={"#197219"}
                      fontWeight={700}
                      textAlign={"center"}
                    >
                      {subscribed
                        ? "You have already subscribed for this course ! "
                        : "Thanks for Subscribing ! "}
                      Your Subscription Id for this resources is:
                      <span>
                        <b>{orderId}</b>
                      </span>{" "}
                    </Text>
                    <Text fontSize={16} p={10} fontWeight={500}>
                      Please use the below link to access the learning
                      materials.
                    </Text>
                    <Link
                      isExternal // Open link in new tab
                      rel="noopener noreferrer"
                      _text={{
                        color: "blue.400",
                        fontSize: "20px",
                      }}
                      href={mediaUrl}
                    >
                      {mediaUrl}
                    </Link>
                  </VStack>
                );
              }
            })}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default MediaPage;
