// AutomatedForm.js
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useNavigate, useParams } from "react-router-dom";
import initReqBodyJson from "../assets/bodyJson/userDetailsBody.json";
import OrderSuccessModal from "./OrderSuccessModal";
import "./Shared.css";
import Layout from "../Layout";
import { FrontEndTypo, Loading } from "@shiksha/common-lib";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  Select,
  VStack,
  useToast,
} from "native-base";
import { dataConfig } from "onest/card";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
// import { registerTelementry } from "../api/Apicall";
import moment from "moment";

const AutomatedForm = () => {
  const { jobId, transactionId, type } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("Application ID");

  const baseUrl = dataConfig[type].apiLink_API_BASE_URL;
  const db_cache = dataConfig[type].apiLink_DB_CACHE;
  const envConfig = dataConfig[type];

  const [jobInfo, setJobInfo] = useState(null);
  const [isAutoForm, setIsAutoForm] = useState(true);

  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  // const [siteUrl, setSiteUrl] = useState(window.location.href);
  const toast = useToast();

  // useEffect(() => {
  //   registerTelementry(siteUrl, transactionId);
  // }, []);

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

  const [formData, setFormData] = useState({
    person: {
      name: userData && userData["name"] ? userData["name"] : "",
      gender: userData && userData["gender"] ? userData["gender"] : "",
      languages: [],
      age: "",
      skills: [],
      tags: [],
    },
    contact: {
      phone: userData && userData["phone"] ? userData["phone"] : "",
      email: userData && userData["email"] ? userData["email"] : "",
    },
  });

  const [formErrors, setFormErrors] = useState({
    person: {
      name: "",
      gender: "",
    },
    contact: {
      phone: "",
      email: "",
    },
  });

  let customerBody;
  let submitFormData = {
    customer: {
      person: {
        tags: [],
      },
    },
  };
  let current = 1;
  let currentXinput;

  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));

    // Reset the error when the user starts typing
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [section]: {
        ...prevErrors[section],
        [field]: "",
      },
    }));
  };

  const validateForm = (data) => {
    // Implement your validation logic here
    const errors = {
      person: {
        name: "",
        gender: "",
      },
      contact: {
        phone: "",
        email: "",
      },
    };

    // Example: Check if required fields are empty
    if (!data.person.name) {
      errors.person.name = t("Name_is_required");
    }

    if (!data.person.gender) {
      errors.person.gender = t("Gender_is_required");
    }

    if (!data.contact.phone) {
      errors.contact.phone = t("Phone_number_is_required");
    } else if (!/^\d{10}$/.test(data.contact.phone)) {
      errors.contact.phone = t("Phone_number_should_be_10_digits");
    }

    if (!data.contact.email) {
      errors.contact.email = t("Email_is_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
      errors.contact.email = t("Invalid_email_address");
    }

    return errors;
  };

  const hasErrors = (errors) => {
    // Check if there are any validation errors
    return Object.values(errors).some((sectionErrors) =>
      Object.values(sectionErrors).some((error) => Boolean(error))
    );
  };

  function storedOrderId(appId) {
    const postData = {
      content_id: localStorage.getItem("unique_id"),
      order_id: appId,
      name: formData["person"]["name"],
      gender: formData["person"]["gender"],
      phone: `${formData["contact"]["phone"]}`,
      email: formData["contact"]["email"],
    };

    axios
      .post(`${baseUrl}/content/createOrder`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (envConfig?.onOrderIdGenerate) {
          envConfig?.onOrderIdGenerate({
            response,
            userData,
            jobId,
            type,
            item: jobInfo,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const confirmDetails = async (customerBody1) => {
    customerBody = customerBody1;
    try {
      //setLoading(true);
      let jobDetails = JSON.parse(localStorage.getItem("jobDetails"));

      initReqBodyJson.init[1]["context"]["action"] = "confirm";
      initReqBodyJson.init[1]["context"]["domain"] = envConfig.apiLink_DOMAIN;
      initReqBodyJson.init[1]["context"]["bap_id"] = envConfig.apiLink_BAP_ID;
      initReqBodyJson.init[1]["context"]["bap_uri"] = envConfig.apiLink_BAP_URI;
      initReqBodyJson.init[1]["context"]["bpp_id"] =
        jobDetails?.context?.bpp_id;
      initReqBodyJson.init[1]["context"]["bpp_uri"] =
        jobDetails?.context?.bpp_uri;
      initReqBodyJson.init[1]["context"]["transaction_id"] = transactionId;
      initReqBodyJson.init[1]["context"]["message_id"] = uuidv4();
      initReqBodyJson.init[1]["context"]["timestamp"] =
        new Date().toISOString();
      initReqBodyJson.init[1].message = customerBody?.responses[0]?.message;
      initReqBodyJson.init[1].message.order.items[0].xinput.form[
        "submission_id"
      ] = localStorage.getItem("submissionId");

      // initReqBodyJson.init[1].message.order.provider["id"] =
      //   jobDetails?.message?.order?.provider?.id;
      // initReqBodyJson.init[1].message.order.items[0]["id"] =
      //   jobDetails?.message?.order?.items[0]?.id;
      // initReqBodyJson.init[1].message.order.fulfillments[0]["id"] =
      //   jobDetails?.message?.order?.items[0]?.fulfillment_ids[0];
      // initReqBodyJson.init[1].message.order.fulfillments[0]["customer"] =
      //   customerBody.hasOwnProperty('customer') ? customerBody['customer'] : customerBody;
      const paramBody = initReqBodyJson.init[1];

      // Perform API call with formData
      const response = await fetch(`${baseUrl}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paramBody),
      });
      const data = await response.json();
      // Set state and open the modal
      if (data.responses.length) {
        for (let i = 0; i < data.responses.length; i++) {
          if (data.responses[i].hasOwnProperty("message")) {
            setLoading(false);
            let appId = data.responses[i].message.order.id;
            window?.parent?.postMessage({ orderId: appId }, "*");
            setOrderId(appId);
            setMessage(message);
            setModalOpen(true);
            setLoading(false);
            storedOrderId(appId);
          }
        }
      } else {
        setLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  const getSelectDetails = async (jobInfo) => {
    try {
      //setLoading(true);
      const response = await fetch(`${baseUrl}/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: {
            domain: envConfig.apiLink_DOMAIN,
            action: "select",
            version: "1.1.0",
            bap_id: envConfig.apiLink_BAP_ID,
            bap_uri: envConfig.apiLink_BAP_URI,
            bpp_id: jobInfo?.bpp_id,
            bpp_uri: jobInfo?.bpp_uri,
            transaction_id: transactionId,
            message_id: uuidv4(),
            timestamp: new Date().toISOString(),
          },
          message: {
            order: {
              provider: {
                id: jobInfo?.provider_id,
              },
              items: [
                {
                  id: jobId,
                },
              ],
            },
          },
        }),
      });

      const data = await response.json();
      localStorage.setItem("selectRes", JSON.stringify(data));
      if (!data?.responses?.length) {
        setLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      } else {
        data.responses[0]["context"]["message_id"] = uuidv4();
        /*if (data.responses[0].message.order.items[0].xinput.form.url) {
          searchForm(data.responses[0].message.order.items[0].xinput.form.url)
        }
        setLoading(false);*/
        // setjobDetails(data?.responses[0]);
        fetchInitDetails(data?.responses[0]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching job details:", error);
    } finally {
      // setLoading(false);
    }
  };

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

  const fetchInitDetails = async () => {
    // const errors = validateForm(formData);
    // if (hasErrors(errors)) {
    //   setFormErrors(errors);
    //   return;
    // }
    localStorage.setItem("initRes", "");

    try {
      setLoading(t("APPLING"));
      let jobDetails = JSON.parse(localStorage.getItem("selectRes"))
        ?.responses[0];
      localStorage.setItem("jobDetails", JSON.stringify(jobDetails));

      let initReqBody = initReqBodyJson.init[1];
      initReqBody["context"]["action"] = "init";
      initReqBody["context"]["domain"] = envConfig.apiLink_DOMAIN;
      initReqBody["context"]["bap_id"] = envConfig.apiLink_BAP_ID;
      initReqBody["context"]["bap_uri"] = envConfig.apiLink_BAP_URI;
      initReqBody["context"]["bpp_id"] = jobDetails?.context?.bpp_id;
      initReqBody["context"]["bpp_uri"] = jobDetails?.context?.bpp_uri;
      initReqBody["context"]["transaction_id"] = transactionId;
      initReqBody["context"]["timestamp"] = new Date().toISOString();
      initReqBody["context"]["message_id"] = uuidv4();
      // initReqBody.message.order.provider["id"] = jobDetails?.message?.order?.provider?.id;
      // initReqBody.message.order.items[0]["id"] = jobDetails?.message?.order?.items[0]?.id;
      // initReqBody.message.order.fulfillments[0]["id"] = jobDetails?.message?.order?.items[0]?.fulfillment_ids[0];

      // // initReqBody.message.order.fulfillments[0]["customer"]['person'] = formData['person'];
      // initReqBody.message.order.fulfillments[0]["customer"]['contact'] = formData['contact'];
      // initReqBody.message.order.fulfillments[0]["customer"]['person'] = {...formData['person'] , ...JSON.parse(localStorage.getItem('autoFormData'))}

      initReqBody.message = jobDetails?.message;

      /* if(localStorage.getItem('submissionId'))
       {
 
       
       initReqBody.message.order.items[0].xinput.form['submission_id'] = localStorage.getItem('submissionId');
 
       let tempString = initReqBody.message.order.items[0].xinput.form.url;
       console.log('tempString -- ', tempString);
       console.log('Transactionid -- ', transactionId);
 
       if (!tempString.match(transactionId)) {
         errorMessage('Transaction Id and XInput form id does not match. Please try again.');
         setLoading(false);
         return;
       }
     }*/

      const paramBody = initReqBody;
      // Perform API call with formData
      const response = await fetch(`${baseUrl}/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paramBody),
      });
      const data = await response.json();
      if (!data || !data?.responses.length) {
        setLoading(false);
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      } else {
        localStorage.setItem("initRes", JSON.stringify(data));
        if (localStorage.getItem("submissionId")) {
          confirmDetails(data);
        } else {
          if (
            data?.responses[0]?.message?.order?.items[0].hasOwnProperty(
              "xinput"
            )
          ) {
            //   const curr = data?.responses[0]?.message?.order?.items[0]?.xinput?.head?.index?.cur;
            //   var max = data?.responses[0]?.message?.order?.items[0]?.xinput?.head?.index?.max;
            var formUrl =
              data?.responses[0]?.message?.order?.items[0]?.xinput?.form?.url;
            //   if (curr < max) {
            searchForm(formUrl);
            //   } else if (curr == max) {
            //     setLoading(true);
            //     confirmDetails();
            //   }
            setLoading(false);

            // } else {
            //   confirmDetails(formData);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      errorMessage(
        t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
      );
      console.error("Error submitting form:", error);
    } finally {
      // setTimeout(() => {
      //   setLoading(false);
      // }, 20000);
    }
  };
  useEffect(() => {
    const getData = () => {
      setLoading(t("FETCHING_THE_DETAILS"));
      localStorage.setItem("submissionId", "");
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: jobId }),
      };

      fetch(`${baseUrl}/content/search`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          result = JSON.parse(result);
          setJobInfo(result?.data[db_cache][0]);
          localStorage.setItem(
            "unique_id",
            result?.data[db_cache][0]?.unique_id
          );
        })
        .catch((error) => console.log("error", error));
    };
    getData();
  }, []);

  useEffect(
    (e) => {
      const fetchData = async () => {
        let data = JSON.parse(localStorage.getItem("selectRes"));
        if (data && data?.responses.length && jobInfo) {
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
      };
      fetchData();
    },
    [jobInfo]
  );
  const trackReactGA = () => {
    ReactGA.event({
      category: "Button Click",
      action: "submit_form",
      label: "Submit Form",
      value: 3,
    });
  };

  const submitFormDetail = async (action, urlencoded) => {
    setLoading(t("SUBMITTING"));
    trackReactGA();

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
          confirmDetails(initRes);
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

  const closeModal = () => {
    // Close the modal and reset state
    setModalOpen(false);
    setOrderId("");
    setMessage("");
    navigate("/");
  };

  function hasSubmitButton() {
    return (
      document.querySelector('input[type="submit"]') !== null ||
      document.querySelector('button[type="submit"]') !== null
    );
  }

  // Function to add submit button dynamically
  function addSubmitButton() {
    var form = document.querySelector("form");

    // Create submit button
    var submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    submitBtn.id = "submitBtn";
    submitBtn.classList.add("autosubmit");

    // Append submit button to the form
    form.appendChild(submitBtn);
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

            if (btnField) {
              btnField.classList.add("autosubmit");
            }

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
            const createdDateTime = moment(
              userData.createdAt,
              "YYYY-MM-DD HH:mm"
            );
            const currentDateTime = moment();
            const timeDiff = moment.duration(
              currentDateTime.diff(createdDateTime)
            );
            if (timeDiff.asSeconds() > envConfig.expiryLimit) {
              setOpenModal(true);
            } else {
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

                  if (
                    input.type === "checkbox" &&
                    userData[inputName] === true
                  ) {
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
          }
        });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return <Loading message={loading} />;
  }

  if (openModal) {
    return (
      <Layout checkUserAccess>
        <Modal isOpen={openModal} size="lg">
          <Modal.Content>
            <Modal.Header>
              <FrontEndTypo.H1 alignItems={"center"}>
                {t("EXPIRY_CONTENT.HEADING")}
              </FrontEndTypo.H1>
            </Modal.Header>
            <Modal.Body p="5">
              <VStack space="4">
                <VStack>
                  <HStack space="4" alignItems={"center"}>
                    <FrontEndTypo.H2 bold color="textGreyColor.550">
                      {t("EXPIRY_CONTENT.MESSAGE")}
                    </FrontEndTypo.H2>
                  </HStack>
                </VStack>
              </VStack>
            </Modal.Body>
            <Modal.Footer justifyContent={"center"}>
              <FrontEndTypo.Primarybutton onPress={(e) => navigate(`/`)}>
                {t("HOME_PAGE")}
              </FrontEndTypo.Primarybutton>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Layout>
    );
  }

  return (
    <Layout loading={loading} checkUserAccess>
      <Box margin={4}>
        <div id="formContainer"></div>
      </Box>
      {!isAutoForm && (
        <Box margin={4}>
          <FormControl mt="4" isInvalid={Boolean(formErrors.person.name)}>
            <FormLabel>{t("Name")}</FormLabel>
            <Input
              type="text"
              value={formData.person.name}
              onChange={(e) =>
                handleInputChange("person", "name", e.target.value)
              }
            />
            <FormErrorMessage>{formErrors.person.name}</FormErrorMessage>
          </FormControl>

          <FormControl mt="4" isInvalid={Boolean(formErrors.person.gender)}>
            <FormLabel>{t("Gender")}</FormLabel>
            <Select
              value={formData.person.gender}
              onChange={(e) =>
                handleInputChange("person", "gender", e.target.value)
              }
            >
              <option value="">{t("Select_Gender")}</option>
              <option value="male">{t("Male")}</option>
              <option value="female">{t("Female")}</option>
              {/* Add more options as needed */}
            </Select>
            <FormErrorMessage>{formErrors.person.gender}</FormErrorMessage>
          </FormControl>

          <FormControl mt="4" isInvalid={Boolean(formErrors.contact.phone)}>
            <FormLabel>{t("Phone")}</FormLabel>
            <Input
              type="number"
              value={formData.contact.phone}
              onChange={(e) =>
                handleInputChange("contact", "phone", e.target.value)
              }
            />
            <FormErrorMessage>{formErrors.contact.phone}</FormErrorMessage>
          </FormControl>

          <FormControl mt="4" isInvalid={Boolean(formErrors.contact.email)}>
            <FormLabel>{t("Email")}</FormLabel>
            <Input
              type="email"
              value={formData.contact.email}
              onChange={(e) =>
                handleInputChange("contact", "email", e.target.value)
              }
            />
            <FormErrorMessage>{formErrors.contact.email}</FormErrorMessage>
          </FormControl>
          <Button mt="6" colorScheme="blue" onClick={fetchInitDetails}>
            {t("Submit")}
          </Button>
        </Box>
      )}
      <OrderSuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={orderId}
        message={message}
      />
    </Layout>
  );
};

export default AutomatedForm;
