import { FrontEndTypo, Layout, Loading, post } from "@shiksha/common-lib";
import axios from "axios";
import { Alert, Box, HStack, Link, Text, VStack, useToast } from "native-base";
import { dataConfig } from "onest/card";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AudioPlayer from "../components/AudioPlayer";
import ExternalLink from "../components/ExternalLink";
import Loader from "../components/Loader";
import PDFViewer from "../components/PDFViewer";
import VideoPlayer from "../components/VideoPlayer";
import YouTubeEmbed from "../components/YouTubeEmbed";

const MediaPage = () => {
  const location = useLocation();
  const state = location?.state;
  const formData = state?.formData;
  const { type, itemId, transactionId } = useParams();
  const baseUrl = dataConfig[type].apiLink_API_BASE_URL;
  const db_cache = dataConfig[type].apiLink_DB_CACHE;
  const envConfig = dataConfig[type];
  const response_cache = dataConfig[type].apiLink_RESPONSE_DB;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [story, setStory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const [product, setProduct] = useState();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isAutoForm, setIsAutoForm] = useState(true);
  const toast = useToast();
  const [urlType, setUrlType] = useState("");
  const [orderId, setOrderId] = useState("");

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
        setStory([obj]);
        setUrlType(trackData?.params?.type);
      } else if (state && userData) {
        fetchInitDetails();
        let productData = JSON.parse(localStorage.getItem("searchProduct"));
        setProduct(productData);
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
            // setJobInfo(result?.data[db_cache][0]);
            localStorage.setItem(
              "unique_id",
              result?.data[db_cache][0]?.unique_id
            );
            setProduct(result?.data[db_cache][0]);
            localStorage.setItem(
              "searchProduct",
              JSON.stringify(result?.data[db_cache][0])
            );
            localStorage.setItem(
              "image_url",
              result?.data[db_cache][0].image_url
            );

            let data = JSON.parse(localStorage.getItem("details"));
            if (data && data?.responses.length) {
              fetchInitDetails();
            } else {
              getSelectDetails(result?.data[db_cache][0]);
            }
          })
          .catch((error) => console.error("error", error));
      }
    };
    fetchData();
  }, []);

  const getSelectDetails = async (info) => {
    try {
      //setIsLoading(true);
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
        setIsLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      } else {
        data.responses[0]["context"]["message_id"] = uuidv4();
        /*if (data.responses[0].message.order.items[0].xinput.form.url) {
          searchForm(data.responses[0].message.order.items[0].xinput.form.url)
        }
        setIsLoading(false);*/
        // setjobDetails(data?.responses[0]);
        fetchInitDetails();
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitJson = async () => {
    try {
      // setIsLoading(true);

      const body = {
        transaction_id: transactionId,
        action: "on_init",
      };

      // Perform API call with formData
      const response = await fetch(`${baseUrl}/responseSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      const formDetails = data?.data[response_cache];
      //  const index = current + 1;

      if (formDetails.length) {
        let foundObject;

        for (let i = 0; i < formDetails.length; i++) {
          const item = formDetails[i];
          if (
            item?.response?.message?.order?.items[0]?.xinput?.head?.index
              ?.cur === current
          ) {
            foundObject = item;
            let fulfillmentsData;
            currentXinput =
              foundObject?.response?.message?.order?.items[0]?.xinput;

            if (
              foundObject?.response?.message?.order.hasOwnProperty(
                "fulfillments"
              )
            ) {
              fulfillmentsData =
                foundObject?.response?.message?.order?.fulfillments[0];
            } else {
              fulfillmentsData =
                foundObject?.response?.message?.order?.items[0]
                  ?.fulfillments[0];
            }

            if (
              currentXinput?.head?.index?.cur === currentXinput?.head?.index.max
            ) {
              let arr1 = submitFormData?.customer?.person?.tags;
              let arr2 = fulfillmentsData?.customer?.person?.tags;
              let arr3 = arr1?.concat(arr2);
              submitFormData["customer"]["person"]["tags"] = arr3;
              // confirmDetails(submitFormData);
              fetchConfirmMedia(fulfillmentsData?.customer);
            } else {
              current = current + 1;
              if (submitFormData) {
                let arr1 = submitFormData?.customer?.person?.tags;
                let arr2 = fulfillmentsData?.customer?.person?.tags;
                let arr3 = arr1?.concat(arr2);
                submitFormData["customer"]["person"]["tags"] = arr3;
              } else {
                submitFormData = fulfillmentsData;
              }
              setIsLoading(false);
              searchForm(currentXinput.form.url);
            }
            break; // Exit the loop once the desired object is found
          }
        }
      } else {
        setIsLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      }
      // Handle the response as needed
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 30000);
    }
  };

  const fetchConfirmMedia = async (customInfo) => {
    try {
      setIsLoading(true);
      let details = JSON.parse(localStorage.getItem("details"))?.responses[0];

      let bodyData = {
        context: {
          domain: envConfig?.apiLink_DOMAIN,
          action: "confirm",
          version: "1.1.0",
          bap_id: envConfig?.apiLink_BAP_ID,
          bap_uri: envConfig?.apiLink_BAP_URI,
          bpp_id: details?.context?.bpp_id,
          bpp_uri: details?.context?.bpp_uri,
          transaction_id: transactionId,
          message_id: uuidv4(),
          timestamp: new Date().toISOString(),
        },
        message: customInfo?.message,
      };

      (bodyData.message.order["fulfillments"] = [
        {
          customer: {
            person: {
              name: "", // Name from form data
              age: "", // Age from form data
            },
            contact: {
              phone: "", // Phone from form data
              email: "", // Email from form data
            },
          },
        },
      ]),
        delete bodyData.message.order.items[0]["add-ons"];

      bodyData.message.order.items[0].xinput.form["submission_id"] =
        localStorage.getItem("submissionId");

      const result = await post(`${baseUrl}/confirm`, bodyData);
      let response = result?.data;

      if (envConfig?.onOrderIdGenerate) {
        const userDataString = localStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        envConfig?.onOrderIdGenerate({
          response,
          userData,
          itemId,
          type,
        });
      }

      if (response && response?.responses && response?.responses?.length > 0) {
        let arrayOfObjects = [];
        let uniqueItemIds = new Set();

        response?.responses?.forEach((responseItem) => {
          try {
            if (responseItem?.message && responseItem?.message?.order) {
              const order = responseItem?.message.order;
              let appId = responseItem.message.order.id;

              order.items[0].tags.forEach((tag) => {
                tag.descriptor.list.forEach((item) => {
                  if (item.descriptor.code === "urlType") {
                    let urlTypeValue = item.value;
                    setUrlType(urlTypeValue);
                  }
                });
              });

              setOrderId(appId);
              window?.parent?.postMessage({ orderId: appId }, "*");
              if (order.items) {
                const items = order.items;
                items.forEach((item) => {
                  if (!uniqueItemIds.has(item.id)) {
                    let mediaUrl = "";
                    if (
                      item["add-ons"] &&
                      item["add-ons"][0]?.descriptor?.media &&
                      item["add-ons"][0]?.descriptor?.media.length > 0
                    ) {
                      mediaUrl = item["add-ons"][0]?.descriptor.media[0].url;
                    }

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
        setIsLoading(true);

        setStory(arrayOfObjects);

        setTimeout(() => {
          setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const fetchInitDetails = async () => {
    setIsLoading(true);
    try {
      let details = JSON.parse(localStorage.getItem("details"))?.responses[0];
      // localStorage.setItem('details', JSON.stringify(details));

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
              },
            ],
            fulfillments: [
              {
                customer: {
                  person: {
                    name: "", // Name from form data
                    age: "", // Age from form data
                  },
                  contact: {
                    phone: "", // Phone from form data
                    email: "", // Email from form data
                  },
                },
              },
            ],
          },
        },
      };
      // initReqBody.message.order.provider["id"] = jobDetails?.message?.order?.provider?.id;
      let tempTags = [
        {
          code: "distributor-details",
          list: [
            {
              descriptor: {
                code: "distributor-name",
                name: "Distributor Name",
              },
              value:
                localStorage.getItem("distributor-name") !== null
                  ? localStorage.getItem("distributor-name")
                  : "",
            },
            {
              descriptor: {
                code: "agent-id",
                name: "Agent Id",
              },
              value:
                localStorage.getItem("agent-id") !== null
                  ? localStorage.getItem("agent-id")
                  : "",
            },
          ],
        },
      ];

      bodyData.message.order.fulfillments[0]["customer"]["person"]["tags"] =
        tempTags;

      const result = await post(`${baseUrl}/init`, bodyData);
      const data = result?.data;
      localStorage.setItem("initRes", JSON.stringify(data?.responses[0]));
      if (!data || !data?.responses.length) {
        setIsLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      } else {
        if (
          data?.responses[0]?.message?.order?.items[0].hasOwnProperty("xinput")
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
            setIsLoading(true);
            searchForm(formUrl);
            // fetchConfirmMedia();
          }
          setIsLoading(false);
        } else {
          fetchConfirmMedia(formData);
        }
      }
    } catch (error) {
      errorMessage(
        t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
      );
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 20000);
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
              addSubmitButton();
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
    }
  };

  const submitFormDetail = async (action, urlencoded) => {
    setIsLoading(true);
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
      setIsLoading(false);
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
    navigate(`/${envConfig?.listLink}/${itemId}`);
  };
  // transaction id
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Layout>
      <Box p={4}>
        {!story.length && (
          <Box margin={4}>
            <div id="formContainer"></div>
          </Box>
        )}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <Box textAlign="center">
              <Loader />
            </Box>
          </div>
        ) : error ? (
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
              <FrontEndTypo.Secondarysmallbutton mt={4} onPress={handleBack}>
                Go Back
              </FrontEndTypo.Secondarysmallbutton>
            </Box>
          </div>
        ) : (
          <>
            {story.map((item, index) => {
              const mediaUrl = item.media_url;
              if (urlType == "Embed") {
                if (
                  mediaUrl.includes("youtube.com") ||
                  mediaUrl.includes("youtu.be")
                ) {
                  return (
                    <VStack pt={2} pb={20} mb={120}>
                      <Text fontSize={22} p={15} fontWeight={500}>
                        Thanks for Subscribing ! Your Subscription Id for this
                        resources is{" "}
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
                      <Text fontSize={22} p={15} fontWeight={500}>
                        Thanks for Subscribing ! Your Subscription Id for this
                        resources is{" "}
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
                      <Text fontSize={22} p={15} fontWeight={500}>
                        Thanks for Subscribing ! Your Subscription Id for this
                        resources is{" "}
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
                      <Text fontSize={22} p={15} fontWeight={500}>
                        Thanks for Subscribing ! Your Subscription Id for this
                        resources is
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
                      <Text fontSize={22} p={15} fontWeight={500}>
                        Thanks for Subscribing ! Your Subscription Id for this
                        resources is
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
                  <VStack pt={2} pb={20} mt={20} mb={150}>
                    <Box maxW={"300px"} maxH={"300px"}>
                      <img
                        width={"auto"}
                        height={"auto"}
                        maxW={"300px"}
                        maxH={"300px"}
                        src={product?.image_url}
                        alt="Product"
                      />
                    </Box>
                    <Text fontSize={22} py={15} fontWeight={500}>
                      Thanks for Subscribing ! Your Subscription Id for this
                      course is
                      <span>
                        <b>{orderId}</b>
                      </span>
                    </Text>
                    <Text fontSize={22} p={15} fontWeight={500}>
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
