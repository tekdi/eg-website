import { Box, Button, Divider, HStack, Icon, Text } from "native-base";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { MdLocationPin } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { registerTelementry } from "../api/Apicall";
import Loader from "./Loader";
import "./Shared.css";
import { dataConfig } from "../card";
import { FrontEndTypo } from "@shiksha/common-lib";

function ScholarshipView() {
  const { type } = useParams();
  const baseUrl = dataConfig[type].apiLink_API_BASE_URL;
  const db_cache = dataConfig[type].apiLink_DB_CACHE;
  const envConfig = dataConfig[type];

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const state = location?.state;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jobInfo, setJobInfo] = useState(state?.product);
  const [jobsData, setJobsData] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const { jobId } = useParams();
  const [siteUrl] = useState(window.location.href);
  const [transactionId] = useState(uuidv4());

  // const uniqueId = uuidv4();

  //   useEffect(() => {
  //     if (transactionId === undefined) {
  //       const uniqueId = uuidv4();
  //       settransactionId(uniqueId); // Update state only when necessary
  //     }else{
  //       registerTelementry(siteUrl, transactionId);
  //     }
  // }, [transactionId]);

  //const jobsData  = selectJson?.responses[0]?.message?.order?.items[0]
  //console.log(jobsData);
  function errorMessage(message) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
      pauseOnHover: true,
      toastClassName: "full-width-toast",
    });
  }

  const trackReactGA = () => {
    console.log("User clicked the Apply button");
    ReactGA.event({
      category: "Button Click",
      action: "apply_Button",
      label: "Apply Button",
      value: 2,
    });
  };

  const fetchJobDetails = async (jobInfo) => {
    try {
      setLoading(true);
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
            transaction_id: transactionId, // (transactionId === undefined) ? localStorage.getItem('transactionId') : transactionId,
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
      data["context"]["message_id"] = transactionId;
      setJobDetails(data);
      setJobsData(data?.responses[0]?.message?.order?.items[0]);
      localStorage.setItem("selectRes", JSON.stringify(data));
      if (!data?.responses.length) {
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(window.location.href);
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
      console.log("Parsed JSON data:", jsonData);
      localStorage.setItem("userData", jsonData);
    }
  }, []);

  function encodeJsonToQueryParam(jsonData) {
    return encodeURIComponent(JSON.stringify(jsonData));
  }

  useEffect(() => {
    /* if (transactionId === undefined) {
      const uniqueId = uuidv4();
      settransactionId(uniqueId); // Update state only when necessary

    }else{
      registerTelementry(siteUrl, transactionId);
    }*/

    registerTelementry(siteUrl, transactionId);

    // ReactGA.pageview(window.location.pathname + window.location.search);
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item_id: jobId }),
    };

    fetch(`${baseUrl}/content/search`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setJobInfo(result?.data[db_cache][0]);
        if (transactionId !== undefined) {
          console.log(transactionId);
          fetchJobDetails(result?.data[db_cache][0]);
        }
      })
      .catch((error) => console.log("error", error));
  }, [transactionId]); // Runs only once when the component mounts

  return (
    <div>
      <Box
        fontFamily={"Alice"}
        marginTop={100}
        padding={4}
        borderRadius={15}
        backgroundColor={"white"}
        marginLeft={4}
        marginRight={4}
      >
        <Box>
          <Text marginLeft={1} fontSize={["xl", "2xl", "3xl"]}>
            {jobInfo?.title}
          </Text>
          {jobInfo?.provider_name && (
            <Text
              color="gray.700"
              marginTop={"3"}
              fontWeight={600}
              marginLeft={1}
              fontSize={["sm", "md"]}
            >
              {jobInfo?.provider_name}
            </Text>
          )}
          {jobInfo?.company && (
            <Text
              color="gray.700"
              marginTop={"2"}
              marginLeft={1}
              fontSize={["sm", "md"]}
            >
              {jobInfo?.company}
            </Text>
          )}
          <HStack marginTop={"1"} marginLeft={1}>
            {(jobInfo?.city || jobInfo?.state) && (
              <div style={{ display: "flex" }}>
                <Icon
                  as={MdLocationPin}
                  boxSize={4}
                  marginTop={1}
                  marginRight={1}
                />{" "}
                <Text fontSize={["xs", "sm"]}>{jobInfo?.city}</Text>
                {jobInfo?.city && jobInfo?.state ? (
                  <Text fontSize={["xs", "sm"]}>, {jobInfo?.state}</Text>
                ) : (
                  <Text fontSize={["xs", "sm"]}>{jobInfo?.state}</Text>
                )}
              </div>
            )}
          </HStack>
          <HStack marginTop={"1"} marginLeft={1}>
            <div style={{ display: "flex" }}>
              {/* <Icon as={FaBriefcase} boxSize={4} marginRight={1} marginTop={1} /> */}

              <Text
                color="gray.700"
                fontSize={["xs", "sm"]}
                marginLeft={0.5}
                textOverflow="ellipsis"
              >
                {jobInfo?.item?.descriptor?.long_desc}
              </Text>
            </div>
          </HStack>
          <HStack
            marginLeft={1}
            marginRight={1}
            marginTop={"1"}
            color={"blue"}
            style={{ display: "flex" }}
          >
            {/* <Icon as={FaRupeeSign} boxSize={4} marginTop={1} /> */}

            <Text fontSize={["xs", "sm"]}>
              <b>Scholarship Amount :</b> {jobInfo?.item?.price?.value}
            </Text>
          </HStack>
        </Box>
        <Box
          marginTop={[2, 4]}
          display="flex"
          justifyContent={["center", "flex-start"]}
        >
          <FrontEndTypo.Primarybutton
            marginTop={2}
            marginRight={[0, 5]}
            width={["100%", 200]}
            colorScheme="blue"
            variant="solid"
            backgroundColor="blue.500"
            color="white"
            onPress={() => {
              navigate(
                `/${envConfig?.listLink}/automatedForm/${jobId}/${transactionId}`,
                {
                  state: {
                    jobDetails: jobDetails,
                  },
                }
              );
              trackReactGA();
            }}
          >
            {t("Apply")}
          </FrontEndTypo.Primarybutton>
        </Box>
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <Box
          fontFamily={"Alice"}
          marginLeft={4}
          marginRight={4}
          padding={4}
          marginTop={5}
          borderRadius={15}
          backgroundColor={"white"}
        >
          <Text fontSize={16} fontWeight={700}>
            {t("Job_Description")}
          </Text>

          {jobInfo?.description ? (
            <Text marginTop={2} fontSize={["xs", "sm"]} color={"gray.700"}>
              {jobInfo?.description}{" "}
            </Text>
          ) : (
            <Text marginTop={2} fontSize={["xs", "sm"]} color={"gray.700"}>
              {t("Job_description_is_not_available")}{" "}
            </Text>
          )}
          <Box marginTop={4}>
            {jobsData?.tags?.map((tag, index) => (
              <Box key={index} marginBottom={3}>
                <Text fontSize={["sm"]} color={"black"} fontWeight={700}>
                  {tag.descriptor.name}
                </Text>
                {tag.list.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <ul style={{ marginLeft: "3rem", listStyleType: "disc" }}>
                      <li>
                        {!item?.descriptor?.name &&
                          item?.descriptor?.code &&
                          item?.value !== "" && (
                            <Text fontSize={["xs", "sm"]} color="gray.700">
                              {item?.descriptor?.code}
                            </Text>
                          )}

                        {item?.descriptor?.name &&
                        item?.value &&
                        item?.value !== "null" &&
                        item?.value !== null ? (
                          <Box display="flex">
                            {item?.descriptor?.name && (
                              <Text
                                fontSize={["xs", "sm"]}
                                color="gray.900"
                                marginRight={2}
                              >
                                {item?.descriptor?.name}:
                              </Text>
                            )}
                            {item?.value && (
                              <Text fontSize={["xs", "sm"]} color="gray.700">
                                {item?.value}
                              </Text>
                            )}
                          </Box>
                        ) : (
                          <div>
                            <Text fontSize={["xs", "sm"]} color="gray.700">
                              {t("Not_Provided")}
                            </Text>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                ))}
                <Divider my={2} borderWidth="0.5px" />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </div>
  );
}

export default ScholarshipView;
