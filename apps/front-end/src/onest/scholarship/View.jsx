import { FrontEndTypo, Loading, OnestService } from "@shiksha/common-lib";
import { Alert, Box, Divider, HStack, Text, useToast } from "native-base";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// import { registerTelementry } from "../api/Apicall";
import { dataConfig } from "../card";
import OrderSuccessModal from "./OrderSuccessModal";
import "./Shared.css";
import axios from "axios";

function ScholarshipView() {
  const { type, jobId } = useParams();
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
  const [listData, setListData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [status, setStatus] = useState("Applied");
  const [siteUrl] = useState(window.location.href);
  const [transactionId] = useState(uuidv4());
  const toast = useToast();

  const closeModal = () => {
    setOpenModal(false);
    navigate(-1);
  };

  const getApplicationStatus = async (order_id, id) => {
    const apiUrl = `${baseUrl}/content/searchOrder/${order_id}`;

    try {
      setLoading(true);
      await axios
        .get(apiUrl)
        .then(async (response) => {
          try {
            const payload = {
              context: {
                domain: envConfig.apiLink_DOMAIN,
                action: "status",
                version: "1.1.0",
                bap_id: envConfig.apiLink_BAP_ID,
                bap_uri: envConfig.apiLink_BAP_URI,
                bpp_id: response?.data?.bpp_id,
                bpp_uri: response?.data?.bpp_uri,
                transaction_id: transactionId,
                message_id: uuidv4(),
                timestamp: new Date().toISOString(),
              },
              message: {
                order_id: order_id,
              },
            };
            const statusTrack = await OnestService.statusTrack(payload);
            if (
              statusTrack?.responses[0]?.message?.order?.fulfillments?.[0]
                ?.state?.descriptor?.name
            ) {
              setStatus(
                statusTrack?.responses[0]?.message?.order?.fulfillments[0]
                  ?.state?.descriptor?.name
              );
              const newPayload = {
                status:
                  statusTrack?.responses[0]?.message?.order?.fulfillments[0]
                    ?.state?.descriptor?.name || status,
                id,
              };
              await OnestService.updateApplicationStatus(newPayload);
            }
          } catch (e) {
            console.error(
              "Error constructing payload or handling response:",
              e
            );
          }
        })
        .catch((error) => {
          console.error("Axios GET request error:", error);
        });
    } catch (error) {
      console.log("error ::", error);
    } finally {
      setLoading(false);
      setOpenModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userDataDetails = localStorage.getItem("userData");
      const userData = JSON.parse(userDataDetails);
      const data = {
        context: type,
        context_item_id: jobId,
        user_id: userData.user_id,
      };
      let result = await OnestService.getList({ filters: data });
      if (result?.data.length) {
        setListData(result?.data);
        getApplicationStatus(result?.data[0].order_id, result?.data[0]?.id);
      }
    };
    fetchData();
  }, []);

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
      setLoading(t("FETCHING_THE_DETAILS"));
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
      if (!data?.responses.length) {
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      } else {
        setJobsData(data?.responses[0]?.message?.order?.items[0]);
        localStorage.setItem("selectRes", JSON.stringify(data));
      }
      data["context"]["message_id"] = transactionId;
      setJobDetails(data);
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

    // registerTelementry(siteUrl, transactionId);

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

  if (loading) {
    return <Loading message={loading} />;
  }

  return (
    <div>
      <Box
        fontFamily={"Alice"}
        marginTop={50}
        padding={4}
        borderRadius={15}
        backgroundColor={"#246DDC1A"}
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
          {listData.length ? (
            <OrderSuccessModal
              isOpen={openModal}
              onClose={closeModal}
              orderId={status}
              applied={true}
            />
          ) : (
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
          )}
        </Box>
      </Box>

      <Box
        fontFamily={"Alice"}
        marginLeft={4}
        marginRight={4}
        padding={4}
        marginTop={5}
        borderRadius={15}
        backgroundColor={"#246DDC1A"}
      >
        <Text fontSize={16} fontWeight={700}>
          {t("Scholarship_Description")}
        </Text>

        {jobInfo?.description ? (
          <Text marginTop={2} fontSize={["xs", "sm"]} color={"gray.700"}>
            {jobInfo?.description}{" "}
          </Text>
        ) : (
          <Text marginTop={2} fontSize={["xs", "sm"]} color={"gray.700"}>
            {t("Scholarship_description_is_not_available")}{" "}
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
    </div>
  );
}

export default ScholarshipView;
