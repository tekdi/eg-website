import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Actionsheet,
  Pressable,
} from "native-base";
import {
  Camera,
  getBase64,
  t,
  FrontEndTypo,
  IconByName,
  Layout,
  authRegistryService,
  uploadRegistryService,
} from "@shiksha/common-lib";

export default function ManualUpload({
  setLoading,
  setPage,
  setOtpFailedPopup,
  footerLinks,
  setAadhaarCompare,
}) {
  const { id } = useParams();
  const [image, setImage] = React.useState();
  const [error, setError] = React.useState();

  const [isFront, setIsFront] = React.useState(true);
  const [modal, setModal] = React.useState(false);

  const [cameraUrl, setCameraUrl] = React.useState();
  const [cameraModal, setCameraModal] = React.useState(false);

  const [submitted, setSubmitted] = React.useState(false);
  const uplodInputRef = React.useRef();

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 25) {
      const data = await getBase64(file);
      if (isFront) {
        setImage((prev) => ({ ...prev, front: data, front_file: file }));
      } else {
        setImage((prev) => ({ ...prev, back: data, back_file: file }));
      }
    } else {
      setError({ top: t("FILE_SIZE") });
    }
    setModal(false);
  };

  const uploadProfile = async () => {
    if (id) {
      setLoading(true);
      const form_data = new FormData();
      const item = {
        file: image?.front_file,
        document_type: "identification",
        document_sub_type: "aadhaar_front",
        user_id: id,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }
      const form_data_back = new FormData();
      const item_back = {
        file: image?.back_file,
        document_type: "identification",
        document_sub_type: "aadhaar_back",
        user_id: id,
      };
      for (let key in item_back) {
        form_data_back.append(key, item_back[key]);
      }

      // try {
      const result = await Promise.all([
        uploadRegistryService.uploadFile(form_data),
        uploadRegistryService.uploadFile(form_data_back),
      ]);
      if (result?.[0]?.error || result?.[1]?.error) {
        setError({
          top: result?.[0]?.error ? result?.[0]?.error : result?.[1]?.error,
        });
      } else {
        const resultUser = await authRegistryService.aadhaarKyc({
          id,
          aadhar_verified: "yes",
          aadhaar_verification_mode: "upload",
        });
        if (resultUser?.error) {
          setPage("aadhaarSuccess");
        } else {
          setAadhaarCompare({ isVerified: true });
          setPage("aadhaarSuccess");
        }
      }
      setLoading(false);
      return result;
    }
  };

  const handleSubmit = () => {
    if (image?.front && image?.back) {
      setSubmitted(true);
    } else if (image?.front) {
      setIsFront(false);
    }
  };

  if (cameraModal) {
    const handleSetCameraUrl = async (url, file) => {
      setCameraUrl(url);
      if (isFront) {
        setImage((prev) => ({ ...prev, front: url, front_file: file }));
      } else {
        setImage((prev) => ({ ...prev, back: url, back_file: file }));
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
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <Box px="4">
        {error?.top && (
          <FrontEndTypo.Prompts m="5" status="danger" flex="1">
            {error?.top}
          </FrontEndTypo.Prompts>
        )}
        {!submitted ? (
          <VStack space="10">
            <VStack>
              <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
                {t("AADHAR_CARD")}
              </FrontEndTypo.H1>
              <FrontEndTypo.H3 color="textGreyColor.800">
                {t("UPLOAD_A_PHOTO_OR_SCAN_OF_YOUR_CARD")}
              </FrontEndTypo.H3>
            </VStack>
            <Pressable
              variant="outline"
              borderWidth="3px"
              borderColor="textGreyColor.100"
              rounded="lg"
              borderStyle="dashed"
              alignItems="center"
              gap="4"
              p="4"
              onPress={() => {
                setModal(true);
              }}
            >
              {(isFront && image?.front) || (!isFront && image?.back) ? (
                <img
                  src={(isFront && image?.front) || (!isFront && image?.back)}
                  alt="front image"
                  style={{ widt: "auto", maxWidth: "480px", height: "196px" }}
                />
              ) : (
                <VStack alignItems="center" space="4">
                  <IconByName
                    isDisabled
                    name="Upload2FillIcon"
                    textAlign="center"
                    color="textGreyColor.100"
                  />
                  <FrontEndTypo.H2 color="textGreyColor.100" textAlign="center">
                    {isFront && image?.back
                      ? t("UPLOAD_THE_BACK_SIDE_OF_YOUR_AADHAAR_CARD")
                      : t("UPLOAD_THE_FRONT_SIDE_OF_YOUR_AADHAAR_CARD")}
                  </FrontEndTypo.H2>
                </VStack>
              )}
              <Image
                source={{
                  uri: "/aadhar.svg",
                }}
                alt="Aadhar"
                w="200px"
                h="113"
                resizeMode="contain"
              />
            </Pressable>
            <HStack
              display="flex"
              flexDirection="row"
              gap="3"
              alignItems="center"
              justifyContent="center"
            >
              <IconByName
                name={
                  !isFront
                    ? "CheckboxBlankCircleLineIcon"
                    : "CheckboxCircleLineIcon"
                }
                onPress={() => setIsFront(true)}
              />

              <IconByName
                name={
                  isFront
                    ? "CheckboxBlankCircleLineIcon"
                    : "CheckboxCircleLineIcon"
                }
                onPress={() => {
                  image?.front ? setIsFront(false) : "";
                }}
              />
            </HStack>
            {isFront ? (
              image?.front ? (
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
            ) : image?.back ? (
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
            <VStack space={"4"}>
              <FrontEndTypo.Primarybutton
                bg={!image?.front || !image?.back ? "gray.300" : "gray.500"}
                onPress={handleSubmit}
              >
                {t("CONTINUE")}
              </FrontEndTypo.Primarybutton>
              <FrontEndTypo.Secondarybutton
                onPress={(e) => setOtpFailedPopup(true)}
              >
                {t("TRY_OTHER")}
              </FrontEndTypo.Secondarybutton>
            </VStack>{" "}
          </VStack>
        ) : (
          <VStack space={"5"} py="5">
            <FrontEndTypo.H1 bold color="textMaroonColor.400">
              {t("AADHAAR_CARD_UPLOADED")}
            </FrontEndTypo.H1>
            <VStack alignItems="center" space={"3"}>
              <FrontEndTypo.H2 color="worksheetBoxText.400">
                {t("FRONT_VIEW")}
              </FrontEndTypo.H2>

              <img
                src={image?.front}
                alt="front image"
                style={{ width: "auto", maxWidth: "280px", height: "180px" }}
              />
            </VStack>
            <VStack alignItems="center" space={"3"}>
              <FrontEndTypo.H2 color="worksheetBoxText.400">
                {t("BACK_VIEW")}
              </FrontEndTypo.H2>

              <img
                src={image?.back}
                alt="back image"
                style={{ width: "auto", maxWidth: "280px", height: "180px" }}
              />
            </VStack>
            <FrontEndTypo.Primarybutton
              flex="1"
              onPress={(e) => uploadProfile()}
            >
              {t("CONTINUE")}
            </FrontEndTypo.Primarybutton>

            <FrontEndTypo.Secondarybutton
              flex="1"
              onPress={(e) => {
                setImage();
                setSubmitted(false);
                setIsFront(true);
                setError();
              }}
            >
              {t("AADHAR_UPLOAD_CLEAR")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        )}
      </Box>

      {modal && (
        <Actionsheet isOpen={modal} onClose={(e) => setModal(false)}>
          <Actionsheet.Content alignItems={"left"}>
            <HStack justifyContent={"space-between"} alignItems="strat">
              <FrontEndTypo.H1 color="textGreyColor.800" p="2">
                {t("AADHAR_KYC_VERIFICATION_FAILED")}
              </FrontEndTypo.H1>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setModal(false)}
              />
            </HStack>
          </Actionsheet.Content>
          <VStack bg="white" width={"100%"} space="5" p="5">
            <FrontEndTypo.Secondarybutton
              onPress={() => {
                setCameraUrl();
                setCameraModal(true);
              }}
            >
              {t("TAKE_A_PHOTO")}
            </FrontEndTypo.Secondarybutton>
            <Box>
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                ref={uplodInputRef}
                onChange={handleFileInputChange}
              />
              <FrontEndTypo.Secondarybutton
                leftIcon={<IconByName name="Download2LineIcon" isDisabled />}
                onPress={(e) => {
                  uplodInputRef?.current?.click();
                }}
              >
                {t("UPLOAD_FROM_GALLERY")}
              </FrontEndTypo.Secondarybutton>
            </Box>
          </VStack>
        </Actionsheet>
      )}
    </Layout>
  );
}
