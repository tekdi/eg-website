import React from "react";
import WestIcon from "@mui/icons-material/West";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Text } from "native-base";
import { Camera, getBase64, t } from "@shiksha/common-lib";

export default function ManualUpload() {
  const navigate = useNavigate();

  const [image, setImage] = React.useState({
    front: "",
    back: "",
  });

  const [isFront, setIsFront] = React.useState(true);
  const [modal, setModal] = React.useState(false);

  const [cameraUrl, setCameraUrl] = React.useState();
  const [cameraModal, setCameraModal] = React.useState(false);

  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    console.log("images -> ", image);
  }, [image]);

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 2) {
      const data = await getBase64(file);
      setCameraUrl(data);
      // setImage(data);
      if (isFront) {
        setImage((prev) => ({ ...prev, front: data }));
      } else {
        setImage((prev) => ({ ...prev, back: data }));
      }
      setModal(false);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (cameraModal) {
    const handleSetCameraUrl = async (url) => {
      setCameraUrl(url);

      if (isFront) {
        setImage((prev) => ({ ...prev, front: url }));
      } else {
        setImage((prev) => ({ ...prev, back: url }));
      }

      setCameraModal(false);
      setModal(false);
    };

    return (
      <Camera
        cameraModal={cameraModal}
        setCameraModal={setCameraModal}
        cameraUrl={cameraUrl}
        setCameraUrl={handleSetCameraUrl}
      />
    );
  }
  return (
    <Box position="relative">
      <Box borderBottomWidth="2" borderColor="gray.400">
        <Button
          variant="ghost"
          display="flex"
          justifyContent="flex-start"
          onPress={() => navigate(-1)}
        >
          <WestIcon />
        </Button>
      </Box>

      <Box px="4">
        {!submitted ? (
          <>
            <Text fontSize="2xl" fontWeight="600" mt="4">
              {" "}
              {t("AADHAR_CARD")}
            </Text>
            <Text>{t("UPLOAD_A_PHOTO_OR_SCAN_OF_YOUR_CARD")}</Text>

            <Button
              variant="outline"
              w="full"
              maxW={480}
              h={200}
              background="transparent"
              borderWidth="2"
              borderColor="gray.500"
              rounded="md"
              display="flex"
              flexDirection="column"
              alignItems={"center"}
              justifyContent={"center"}
              mt="16"
              onPress={() => {
                setModal(true);
              }}
            >
              {isFront ? (
                image.front ? (
                  <img
                    src={image.front}
                    alt="front image"
                    style={{ widt: "auto", maxWidth: "480px", height: "196px" }}
                  />
                ) : (
                  <>
                    <Text textAlign={"center"}>
                      <UploadIcon />
                    </Text>
                    <Text>
                      {t("UPLOAD_THE_FRONT_SIDE_OF_YOUR_AADHAAR_CARD")}
                    </Text>
                  </>
                )
              ) : image.back ? (
                <img
                  src={image.back}
                  alt="back image"
                  style={{ widt: "auto", maxWidth: "480px", height: "196px" }}
                />
              ) : (
                <>
                  <Text textAlign={"center"}>
                    <UploadIcon />
                  </Text>
                  <Text>{t("UPLOAD_THE_BACK_SIDE_OF_YOUR_AADHAAR_CARD")}</Text>
                </>
              )}
            </Button>

            <Box
              display="flex"
              flexDirection="row"
              gap="3"
              alignItems="center"
              justifyContent="center"
              mt="6"
            >
              <button
                onClick={() => setIsFront(!isFront)}
                className={`btn-indicator ${isFront ? "active" : ""}`}
              ></button>

              <button
                onClick={() => setIsFront(!isFront)}
                className={`btn-indicator ${!isFront ? "active" : ""}`}
              ></button>
            </Box>

            {isFront ? (
              image.front ? (
                <Button
                  variant="secondary"
                  bg="gray.400"
                  py="12px"
                  px="20px"
                  mt="10"
                  onPress={() => {
                    setImage((prev) => ({ ...prev, front: "" }));
                    setModal(true);
                  }}
                >
                  <Text color="white">{t("UPLOAD_AGAIN")}</Text>
                </Button>
              ) : null
            ) : image.back ? (
              <Button
                variant="secondary"
                bg="gray.400"
                py="12px"
                px="20px"
                mt="10"
                onPress={() => {
                  setImage((prev) => ({ ...prev, back: "" }));
                  setModal(true);
                }}
              >
                <Text color="white">{t("UPLOAD_AGAIN")}</Text>
              </Button>
            ) : null}

            <Button
              variant="secondary"
              bg={!image.front || !image.back ? "gray.300" : "gray.500"}
              py="12px"
              px="20px"
              mt="10"
              disabled={!image.front || !image.back}
              onPress={handleSubmit}
            >
              <Text color="white">Continue</Text>
            </Button>
          </>
        ) : (
          <>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="1.5"
              mt="6"
              p="2"
            >
              <CheckIcon fontSize="medium" />
              <Text color="gray.500" fontSize={16} fontWeight="semibold">
                {t("AADHAAR_CARD_UPLOADED")}
              </Text>
            </Box>

            <div className="front__image">
              <h4>{t("FRONT_VIEW")}</h4>

              <img
                src={image.front}
                alt="front image"
                style={{ width: "auto", maxWidth: "480px", height: "180px" }}
              />
            </div>

            <div className="back__image">
              <h4>{t("BACK_VIEW")}</h4>

              <img
                src={image.back}
                alt="back image"
                style={{ width: "auto", maxWidth: "480px", height: "180px" }}
              />
            </div>

            <Button
              variant="secondary"
              bg={"gray.500"}
              py="12px"
              px="20px"
              mt="10"
            >
              <Text color="white">{t("CONTINUE")}</Text>
            </Button>
          </>
        )}
      </Box>

      {modal && (
        <Box
          position="absolute"
          width="full"
          height="100vh"
          bg="black:alpha.20"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Box
            bg="gray.100"
            display="flex"
            flexDirection="column"
            gap="5"
            p="6"
          >
            <Box
              bg="white:alpha.80"
              display="flex"
              flexDirection="column"
              alignItems="center"
              rounded="md"
              borderWidth="1"
              borderColor="gray.400"
              overflow="hidden"
            >
              <Button
                width="full"
                variant="ghost"
                px="15px"
                py="10px"
                borderBottomWidth="1"
                borderColor="gray.600"
                rounded="none"
                onPress={() => {
                  setCameraUrl();
                  setCameraModal(true);
                }}
              >
                <Text fontSize={14} fontWeight="500" textAlign="center">
                  {t("TAKE_A_PHOTO")}
                </Text>
              </Button>

              <FormControl.Label
                htmlFor="galleryUpload"
                p="0"
                m="0"
                w="full"
                borderBottomWidth="1"
                borderColor="gray.600"
                rounded="none"
              >
                <Text
                  w="full"
                  px="15px"
                  py="10px"
                  m="0"
                  fontSize={14}
                  fontWeight="500"
                  textAlign="center"
                >
                  {t("UPLOAD_FROM_GALLERY")}
                </Text>
              </FormControl.Label>
              <input
                type="file"
                id="galleryUpload"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />

              <FormControl.Label
                htmlFor="fileUpload"
                p="0"
                m="0"
                w="full"
                rounded="none"
              >
                <Text
                  w="full"
                  px="15px"
                  py="10px"
                  m="0"
                  fontSize={14}
                  fontWeight="500"
                  textAlign="center"
                >
                  {t("Upload a file")}
                </Text>
              </FormControl.Label>
              <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
            </Box>

            <Button
              bg="white:alpha.80"
              variant="outline"
              px="15px"
              py="10px"
              rounded="md"
              className="btn-cancel"
              onPress={() => {
                setModal(false);
              }}
            >
              {t("CANCEL")}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
