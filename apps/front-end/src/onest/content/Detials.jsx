import { Box, Button, Flex, Heading, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdKeyboardBackspace } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loader from "../components/Loader";
import { getseletedData } from "../services/Apicall";
const env = import.meta.env;

const Details = () => {
  const uniqueId = uuidv4();
  const location = useLocation();
  const state = location?.state;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [story, setStory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(
    state?.transactionId || uuidv4()
  );
  const messageId = uuidv4();
  const { itemId } = useParams();

  useEffect(() => {
    if (state && state.product) {
      fetchSelectedCourseData();
    }
  }, [state]);

  const fetchSelectedCourseData = async () => {
    try {
      setIsLoading(true);

      let bodyData = {
        context: {
          domain: env?.VITE_DOMAIN,
          action: "select",
          version: "1.1.0",
          bap_id: env?.VITE_BAP_ID,
          bap_uri: env?.VITE_BAP_URI,
          bpp_id: state?.product?.bpp_id,
          bpp_uri: state?.product?.bpp_uri,
          transaction_id: transactionId,
          // "message_id":messageId,
          message_id: "06974a96-e996-4e22-9265-230f69f22f57",
          timestamp: new Date().toISOString(),
        },
        message: {
          order: {
            provider: {
              id: state?.product?.provider_id,
            },
            items: [
              {
                id: state?.product?.item_id,
              },
            ],
          },
        },
      };

      let response = await getseletedData(bodyData);

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
                title: state.product.title,
                description: state.product.description
                  ? state.product.description
                  : "",
                long_desc: item.descriptor.long_desc,
                provider_id: state.product.provider_id,
                provider_name: state.product.provider_name,
                bpp_id: state.product.bpp_id,
                bpp_uri: state.product.bpp_uri,
                icon: state.product.icon ? state.product.icon : "",
                descriptionshort: state.product.shortDescription
                  ? state.product.shortDescription
                  : "",
              };
              arrayOfObjects.push(obj);
              uniqueItemIds.add(item.id);
            }
          }
        }

        setStory(arrayOfObjects[0]);
        // console.log("arrayOfObjects", arrayOfObjects);

        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError("No data found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setIsLoading(false);
      setError("Error fetching details. Please try again.");
    }
  };
  console.log("itemId:", state.product?.item_id);

  const handleSubscribe = () => {
    navigate(`/form`, {
      // Navigate to UserDetailsForm.jsx
      state: {
        product: story, // Pass selected data as state
        transactionId: transactionId,
      },
    });
  };
  const handleBack = () => {
    navigate("/");
  };
  // console.log("story", story);

  // transaction id
  console.log(`${state.product?.title} transaction id ${transactionId}`);
  console.log(`${state.product?.title} messageId  ${messageId}`);
  return (
    <>
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
            <Button
              mt={4}
              colorScheme="green"
              variant="solid"
              backgroundColor="rgb(62, 97, 57)"
              color="white"
              onClick={handleBack}
            >
              {t("GO_BACK")}
            </Button>
          </Box>
        </div>
      ) : (
        <Box p={4} pt={30}>
          <Flex justify="space-between" alignItems="center" mb={4}>
            <Box flex="1"></Box>
            <Box>
              <Button
                leftIcon={
                  <MdKeyboardBackspace style={{ marginTop: "-0.1rem" }} />
                }
                _hover={{ background: "#4f6f4a", color: "#fff" }}
                _active={{ background: "#4f6f4a", color: "#fff" }}
                color="#4f6f4a"
                variant="outline"
                borderColor="#4f6f4a"
                onClick={() => navigate(-1)}
              >
                {t("BACK")}
              </Button>
            </Box>
          </Flex>
          <Heading as="h2">{state.product?.provider_name}</Heading>
          {state.product?.title && (
            <Text mt={2}>
              <strong>{state.product?.title}</strong>
            </Text>
          )}
          {story && story.descriptor && story.descriptor.long_desc ? (
            <Text marginTop={2} fontSize={["xs", "sm"]} color={"gray.700"}>
              {story.descriptor.long_desc}
            </Text>
          ) : (
            <Text>{state.product?.description}</Text>
          )}
          {/* <Button mt={3} className='custom-button' onClick={() => {
            navigate(`/confirm/${state?.product?.item_id}`, {
              state: {
                product: story,
                product1: state.product,
                transactionId: transactionId
              },
            });
          }}>{t('SUBSCRIBE')}</Button> */}
          <Button mt={3} className="custom-button" onClick={handleSubscribe}>
            {t("SUBSCRIBE")}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Details;
