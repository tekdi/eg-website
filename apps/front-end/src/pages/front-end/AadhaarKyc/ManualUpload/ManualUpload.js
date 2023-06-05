import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Text, Image, VStack } from "native-base";
import {
  Camera,
  getBase64,
  t,
  FrontEndTypo,
  IconByName,
  Layout,
} from "@shiksha/common-lib";

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
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
    >
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
            <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
              {t("AADHAR_CARD")}
            </FrontEndTypo.H1>
            <FrontEndTypo.H3 color="textGreyColor.800">
              {t("UPLOAD_A_PHOTO_OR_SCAN_OF_YOUR_CARD")}
            </FrontEndTypo.H3>

            <Button
              variant="outline"
              maxW={480}
              background="transparent"
              borderWidth="3px"
              borderColor="textGreyColor.100"
              rounded="md"
              borderStyle="dashed"
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
                    <IconByName
                      name="Upload2FillIcon"
                      textAlign="center"
                      color="textGreyColor.100"
                    />
                    <FrontEndTypo.H2 color="textGreyColor.100">
                      {t("UPLOAD_THE_FRONT_SIDE_OF_YOUR_AADHAAR_CARD")}
                    </FrontEndTypo.H2>
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
                  <IconByName
                    name="Upload2FillIcon"
                    textAlign="center"
                    color="textGreyColor.100"
                  />
                  <FrontEndTypo.H2 color="textGreyColor.100">
                    {t("UPLOAD_THE_BACK_SIDE_OF_YOUR_AADHAAR_CARD")}
                  </FrontEndTypo.H2>
                </>
              )}
              <Image
                source={{
                  uri: "/aadhar.svg",
                }}
                alt="Aadhar"
                size={"200px"}
                resizeMode="contain"
              />
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
                  variant="link"
                  onPress={() => {
                    setImage((prev) => ({ ...prev, front: "" }));
                    setModal(true);
                  }}
                >
                  <FrontEndTypo.H3 color="blueText.450" underline>
                    {t("UPLOAD_AGAIN")}
                  </FrontEndTypo.H3>
                </Button>
              ) : null
            ) : image.back ? (
              <Button
                variant="link"
                onPress={() => {
                  setImage((prev) => ({ ...prev, back: "" }));
                  setModal(true);
                }}
              >
                <FrontEndTypo.H3 color="blueText.450" underline>
                  {t("UPLOAD_AGAIN")}
                </FrontEndTypo.H3>
              </Button>
            ) : null}

            <FrontEndTypo.Primarybutton
              bg={!image.front || !image.back ? "gray.300" : "gray.500"}
              mt="10"
              disabled={!image.front || !image.back}
              onPress={handleSubmit}
            >
              {t("CONTINUE")}
            </FrontEndTypo.Primarybutton>
          </>
        ) : (
          <>
            <VStack alignItems="center">
              <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
                {t("AADHAAR_CARD_UPLOADED")}
              </FrontEndTypo.H1>
              <FrontEndTypo.H2 color="worksheetBoxText.400" my="4">
                {t("FRONT_VIEW")}
              </FrontEndTypo.H2>

              <img
                src={image.front}
                alt="front image"
                style={{ width: "auto", maxWidth: "280px", height: "180px" }}
              />

              <FrontEndTypo.H2 color="worksheetBoxText.400" my="4">
                {t("BACK_VIEW")}
              </FrontEndTypo.H2>

              <img
                src={image.back}
                alt="back image"
                style={{ width: "auto", maxWidth: "280px", height: "180px" }}
              />

              <FrontEndTypo.Primarybutton mt="10">
                {t("CONTINUE")}
              </FrontEndTypo.Primarybutton>
            </VStack>
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
              <FrontEndTypo.Secondarybutton
                onPress={() => {
                  setCameraUrl();
                  setCameraModal(true);
                }}
              >
                {t("TAKE_A_PHOTO")}
              </FrontEndTypo.Secondarybutton>

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
    </Layout>
  );
}
