import {
  Alert,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Text,
  useToast,
} from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// import { registerTelementry } from "../api/Apicall";
import { FrontEndTypo, Loading, post } from "@shiksha/common-lib";
import { dataConfig } from "onest/card";

const Details = () => {
  const location = useLocation();
  const state = location?.state;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { jobId, type } = useParams();
  const baseUrl = dataConfig[type].apiLink_API_BASE_URL;
  const db_cache = dataConfig[type].apiLink_DB_CACHE;
  const envConfig = dataConfig[type];

  const [product, setProduct] = useState(state?.product);
  const [details, setDetails] = useState({});
  const fieldsToSkip = ["lastupdatedon", "createdon"];

  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(uuidv4());
  // const messageId = uuidv4();
  const [siteUrl, setSiteUrl] = useState(window.location.href);
  // const [info, setInfo] = useState(state?.product);
  const dataShow = ["title", "name"];
  const toast = useToast();

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

  const fetchSelectedCourseData = async () => {
    try {
      setLoading(t("FETCHING_THE_DETAILS"));
      let productInfo;

      if (!product) {
        productInfo = JSON.parse(localStorage.getItem("searchProduct"));
      } else {
        productInfo = product;
      }

      let bodyData = {
        context: {
          domain: envConfig?.apiLink_DOMAIN,
          action: "select",
          version: "1.1.0",
          bap_id: envConfig?.apiLink_BAP_ID,
          bap_uri: envConfig?.apiLink_BAP_URI,
          bpp_id: productInfo?.bpp_id,
          bpp_uri: productInfo?.bpp_uri,
          transaction_id: transactionId,
          message_id: uuidv4(),
          // message_id: "06974a96-e996-4e22-9265-230f69f22f57",
          timestamp: new Date().toISOString(),
        },
        message: {
          order: {
            provider: {
              id: productInfo?.provider_id,
            },
            items: [
              {
                id: productInfo?.item_id,
              },
            ],
          },
        },
      };

      const result = await post(`${baseUrl}/select`, bodyData);
      let response = result?.data;
      localStorage.setItem("details", JSON.stringify(response));
      if (response.responses?.[0]?.message?.order?.items?.[0]) {
        setDetails(response.responses?.[0].message?.order?.items?.[0] || {});
      } else {
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      }
      // console.log("resp", response);
      if (response && response.responses && response.responses.length > 0) {
        // console.log("Entered 1");
        let arrayOfObjects = [];
        let uniqueItemIds = new Set();

        for (const responses of response.responses) {
          const provider = responses.message.order;
          for (const item of provider.items) {
            if (!uniqueItemIds.has(item.id)) {
              let obj = {
                item_id: item.id,
                title: productInfo.title,
                description: productInfo.description
                  ? productInfo.description
                  : "",
                long_desc: item.descriptor.long_desc,
                provider_id: productInfo.provider_id,
                provider_name: productInfo.provider_name,
                bpp_id: productInfo.bpp_id,
                bpp_uri: productInfo.bpp_uri,
                icon: productInfo.icon ? productInfo.icon : "",
                descriptionshort: productInfo.shortDescription
                  ? productInfo.shortDescription
                  : "",
              };
              arrayOfObjects.push(obj);
              uniqueItemIds.add(item.id);
            }
          }
        }
        setStory(arrayOfObjects[0]);
        // console.log("arrayOfObjects", arrayOfObjects);
      } else {
        errorMessage(
          t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
        );
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      errorMessage(
        t("Delay_in_fetching_the_details") + "(" + transactionId + ")"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      // registerTelementry(siteUrl, transactionId);
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
          setProduct(result?.data[db_cache]?.[0]);
          localStorage.setItem(
            "searchProduct",
            JSON.stringify(result?.data[db_cache]?.[0])
          );

          const userDataString = localStorage.getItem("userData");
          const userData = JSON.parse(userDataString);
          let trackData;
          if (envConfig?.getTrackData) {
            trackData = await envConfig.getTrackData({
              type,
              itemId: jobId,
              transactionId,
              user_id: userData?.user_id,
            });
          }

          if (trackData?.params?.type) {
            handleSubscribe(result?.data[db_cache]?.[0]);
          } else if (transactionId !== undefined) {
            fetchSelectedCourseData(result?.data[db_cache]?.[0]);
          }
        });
    };
    fetchData();
    // .catch((error) => console.log("error", error));
  }, [transactionId]); // Runs only once when the component mounts

  const handleSubscribe = (productData) => {
    navigate(
      `/${envConfig?.listLink}/confirm/${productData?.item_id}/${transactionId}`,
      {
        state: {
          product: productData,
          transactionId: transactionId,
        },
      }
    );
    // navigate(`/form`, { // Navigate to UserDetailsForm.jsx
    //   state: {
    //     product: story, // Pass selected data as state
    //     transactionId: transactionId
    //   },
    // });
  };
  const handleBack = () => {
    navigate("/");
  };

  function convertNameToLearningOutcomes(name) {
    let transformedName = name.replace(/([A-Z])/g, " $1");
    transformedName =
      transformedName.charAt(0).toUpperCase() + transformedName.slice(1);
    return transformedName;
  }

  // transaction id
  if (loading) {
    return <Loading message={loading} />;
  }

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Box textAlign="center"></Box>
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
            <Button
              mt={4}
              colorScheme="#3182ce"
              variant="solid"
              background="#3182ce"
              color="white"
              onClick={handleBack}
            >
              {t("GO_BACK")}
            </Button>
          </Box>
        </div>
      ) : (
        <Box p={4} pt={30}>
          <Box padding={4} borderRadius={15} backgroundColor={"white"} mb={5}>
            <Flex justify="space-between" alignItems="center">
              <Box>
                {/* {product.image_url && (
                  <Box width={80} height={"auto"}>
                    <img src={product.image_url} alt="Product" />
                  </Box>
                )} */}
              </Box>
            </Flex>

            <Heading mt={5} as="h2">
              {product?.title}
            </Heading>
            <Text fontSize={16} my={3}>
              Published By: {product?.provider_name}
            </Text>

            <FrontEndTypo.Primarybutton
              mt={3}
              className="custom-button"
              onPress={(e) => handleSubscribe(product)}
              mb={7}
              marginTop={2}
              marginRight={[0, 5]}
              width={["100%", 200]}
              colorScheme="blue"
              variant="solid"
              backgroundColor="blue.500"
              color="white"
            >
              {t("SUBSCRIBE")}
            </FrontEndTypo.Primarybutton>
          </Box>
          {details !== undefined && (
            <Box padding={4} borderRadius={15} backgroundColor={"white"}>
              {details?.tags?.[0]?.list?.map((item, itemIndex) => (
                <>
                  {!fieldsToSkip.includes(item.descriptor.name) && (
                    <>
                      <Box key={itemIndex} ml={5}>
                        <ul style={{ listStyleType: "disc" }}>
                          <li>
                            {!item?.descriptor?.name &&
                              item?.descriptor?.code &&
                              item?.value !== "" && (
                                <Text fontSize={16} fontWeight={900} mt={3}>
                                  {convertNameToLearningOutcomes(
                                    item?.descriptor?.code
                                  )}
                                </Text>
                              )}

                            {item?.descriptor?.name &&
                            item?.value &&
                            item?.value !== "null" &&
                            item?.value !== null &&
                            !fieldsToSkip.includes(item.descriptor.name) ? (
                              <Box display="flex" mt={3}>
                                {item?.descriptor?.name && (
                                  <Text
                                    fontSize={16}
                                    fontWeight={900}
                                    marginRight={2}
                                  >
                                    {convertNameToLearningOutcomes(
                                      item?.descriptor?.name
                                    )}
                                    :
                                  </Text>
                                )}
                                {item?.value && (
                                  <Text fontSize={16} color="gray.700">
                                    {item?.value}
                                  </Text>
                                )}
                              </Box>
                            ) : (
                              ""
                            )}
                          </li>
                        </ul>
                      </Box>
                    </>
                  )}
                </>
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default Details;
