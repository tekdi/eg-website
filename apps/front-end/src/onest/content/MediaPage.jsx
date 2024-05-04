import { Box, Button, Flex, Heading, Text } from "native-base";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import YouTubeEmbed from "../components/YouTubeEmbed";
import PDFViewer from "../components/PDFViewer";
import AudioPlayer from "../components/AudioPlayer";
import VideoPlayer from "../components/VideoPlayer";
import ExternalLink from "../components/ExternalLink";
import { getconfirmdata } from "../services/Apicall";
import { v4 as uuidv4 } from "uuid";
import { MdKeyboardBackspace } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";

const env = import.meta.env;

const MediaPage = () => {
  const location = useLocation();
  const state = location?.state;
  const transactionId = state?.transactionId;
  const formData = state?.formData;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [story, setStory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageId = uuidv4();

  useEffect(() => {
    fetchConfirmMedia();
  }, []);

  const fetchConfirmMedia = async () => {
    try {
      setIsLoading(true);

      let bodyData = {
        context: {
          domain: env?.VITE_DOMAIN,
          action: "confirm",
          version: "1.1.0",
          bap_id: env?.VITE_BAP_ID,
          bap_uri: env?.VITE_BAP_URI,
          bpp_id: state?.product1?.bpp_id,
          bpp_uri: state?.product1?.bpp_uri,
          transaction_id: transactionId,
          message_id: "63c7e762-787e-4808-a4d6-5260c0d6272d",
          timestamp: new Date().toISOString(),
        },
        message: {
          order: {
            items: [
              {
                id: state?.product1?.item_id,
              },
            ],
            fulfillments: [
              {
                customer: {
                  person: {
                    name: formData.name, // Name from form data
                    age: formData.age, // Age from form data
                  },
                  contact: {
                    phone: formData.phone, // Phone from form data
                    email: formData.email, // Email from form data
                  },
                },
              },
            ],
          },
        },
      };

      let response = await getconfirmdata(bodyData);

      console.log("API Response:", response);

      if (response && response?.responses && response?.responses?.length > 0) {
        console.log("res length", response?.responses?.length);
        console.log("Yes we get the data");
        let arrayOfObjects = [];
        let uniqueItemIds = new Set();

        response?.responses?.forEach((responseItem) => {
          try {
            if (responseItem?.message && responseItem?.message?.order) {
              console.log("Enter 1");

              const order = responseItem?.message.order;
              if (order.items) {
                console.log("Enter 2");

                const items = order.items;
                items.forEach((item) => {
                  if (!uniqueItemIds.has(item.id)) {
                    console.log("Enter 3");

                    let mediaUrl = "";
                    if (
                      item?.descriptor &&
                      item?.descriptor?.media &&
                      item.descriptor.media.length > 0
                    ) {
                      mediaUrl = item.descriptor.media[0].url || "";
                    }
                    let obj = {
                      item_id: item.id,
                      title: state.product1.title || "",
                      description: state.product1.description || "",
                      provider_id: state.product1.provider_id || "",
                      provider_name: state.product1.provider_name || "",
                      bpp_id: state.product1.bpp_id || "",
                      bpp_uri: state.product1.bpp_uri || "",
                      icon: state.product1.icon || "",
                      descriptionshort: state.product1.shortDescription || "",
                      media_url: mediaUrl,
                    };
                    arrayOfObjects.push(obj);
                    uniqueItemIds.add(item.id);
                  }
                });
              } else {
                console.log("No items found in order");
              }
            }
          } catch (error) {
            console.error("Error processing response item:", error);
          }
        });

        setStory(arrayOfObjects);
        console.log("Updated Story Array:", arrayOfObjects);
      } else {
        console.log("No valid responses found.");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  // transaction id
  console.log(
    `${state.product?.title} transaction id Confirm ${transactionId}`
  );
  console.log(`${state.product?.title} messageId Confirm ${messageId}`);
  return (
    <Box p={4}>
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
            <Button mt={4} className="custom-button" onClick={handleBack}>
              Go Back
            </Button>
          </Box>
        </div>
      ) : (
        <>
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
                Back
              </Button>
            </Box>
          </Flex>
          {story.map((item, index) => {
            const mediaUrl = item.media_url;
            console.log(mediaUrl);
            if (mediaUrl.endsWith(".mp3")) {
              // MP3 audio
              return (
                <Box pt={2} pb={20}>
                  <AudioPlayer key={index} mediaUrl={mediaUrl} />
                </Box>
              );
            } else if (mediaUrl.endsWith(".pdf")) {
              // PDF document
              return (
                <Box pt={2} pb={20}>
                  <PDFViewer key={index} src={mediaUrl} />
                </Box>
              );
            } else if (
              mediaUrl.includes("youtube.com") ||
              mediaUrl.includes("youtu.be")
            ) {
              // YouTube video
              return (
                <Box pt={2} pb={20}>
                  <YouTubeEmbed key={index} url={mediaUrl} />
                </Box>
              );
            } else if (mediaUrl.endsWith(".mp4")) {
              // MP4 video
              return (
                <Box pt={2} pb={20}>
                  <VideoPlayer key={index} url={mediaUrl} />
                </Box>
              );
            } else {
              // External website content
              return (
                <Box pt={2} pb={20}>
                  <ExternalLink key={index} url={mediaUrl} />
                </Box>
              );
            }
          })}
        </>
      )}
    </Box>
  );
};

export default MediaPage;
