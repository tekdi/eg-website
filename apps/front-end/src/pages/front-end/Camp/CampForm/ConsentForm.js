import React from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import {
  Actionsheet,
  Alert,
  Box,
  Center,
  Checkbox,
  HStack,
  Pressable,
  Progress,
  Text,
  TextArea,
  VStack,
} from "native-base";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  Layout,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
  validation,
  sendAndVerifyOtp,
  AdminTypo,
  ImageView,
  IconByName,
  Camera,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";

// App
export default function ConsentForm({ userTokenInfo, footerLinks }) {
  const { step } = useParams();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraFile, setCameraFile] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState();
  const [facilitator, setFacilitator] = React.useState();
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [qualifications, setQualifications] = React.useState([]);
  const [enumObj, setEnumObj] = React.useState();
  const [verifyOtpData, setverifyOtpData] = React.useState();
  const [otpButton, setOtpButton] = React.useState(false);
  const [mobileConditon, setMobileConditon] = React.useState(false);

  const [modal, setModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [cameraModal, setCameraModal] = React.useState(false);
  const [image, setImage] = React.useState();

  const uplodInputRef = React.useRef();

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    setLoading(true);
    const form_data = new FormData();
    const item = {
      file: file,
      document_type: "profile_photo",
      document_sub_type,
      user_id: id,
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const result = await uploadRegistryService.uploadFile(form_data);
    setLoading(false);
    setModal(false);
  };

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (pageStape === "p") {
        navigate("/camp/campRegistration");
      }
    }
  };

  const handleCheckbox = (e) => {
    console.log("e", e);
    const checked = e;
    if (checked) {
      console.log("checked");
    } else {
      console.log("unchecked");
    }
  };

  // update schema

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      let schemaData = properties[newStep];
      setPage(newStep);
      setSchema(schemaData);
      setPages(newSteps);

      if (step === "kit") {
        const { kit_received } = schemaData.properties;
        const required = schemaData?.required.filter((item) =>
          ["kit_received"].includes(item)
        );
        const newSchema = {
          ...schemaData,
          properties: { kit_received },
          required: required,
        };
        setSchema(newSchema);
      }
    }
  }, [step]);

  const onClickSubmit = (backToProfile) => {
    localStorage.setItem("backToProfile", backToProfile);
  };

  if (cameraModal) {
    const handleSetCameraUrl = async (url, file) => {
      setCameraUrl(url);

      setImage((prev) => ({ ...prev, back: url, back_file: file }));

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
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("CONSENT_FORM"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <Box py={6} px={4} mb={5}>
        <AdminTypo.H3 color={"textMaroonColor.400"}>
          {t("LEARNER_CONSENT_FORM")}
        </AdminTypo.H3>
        <Center w="100%" my={5}>
          <Box w="100%" maxW="700">
            <Progress value={45} size="xs" colorScheme="info" />
          </Box>
        </Center>
        <HStack
          bg="white"
          p="2"
          my={2}
          shadow="FooterShadow"
          rounded="sm"
          space="1"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack justifyContent="space-between">
            <HStack alignItems="Center" flex="5">
              {/* <ImageView
                    source={{
                      document_id: 11,
                    }}
                    alt="Alternate Text"
                    width={"45px"}
                    height={"45px"}
                  /> */}

              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="gray.300"
                _icon={{ size: "45px" }}
              />

              <VStack
                pl="2"
                flex="1"
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                <FrontEndTypo.H3
                  bold
                  color="textGreyColor.800"
                ></FrontEndTypo.H3>
              </VStack>
            </HStack>
          </HStack>

          <ImageView
            source={{
              document_id: 1304,
            }}
            text={
              <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                {t("VIEW")}
                <IconByName
                  isDisabled
                  name="FileTextLineIcon"
                  color="blueText.450"
                  _icon={{ size: "25px" }}
                ></IconByName>
              </HStack>
            }
          />
          <Pressable
            onPress={() => {
              setModal(true);
            }}
          >
            <HStack alignItems={"center"} justifyContent={"space-evenly"}>
              {t("UPLOAD")}
              <IconByName
                isDisabled
                name="Upload2FillIcon"
                color="blueText.450"
                _icon={{ size: "25px" }}
              ></IconByName>
            </HStack>
          </Pressable>
        </HStack>
        <HStack space={4} alignItems={"center"}>
          <Checkbox
            checked={false}
            color="blueText.450"
            onChange={(e) => handleCheckbox(e)}
          />
          <AdminTypo.H5>{t("CONSENT_DISCLAIMER")}</AdminTypo.H5>
        </HStack>
        <FrontEndTypo.Primarybutton
          isLoading={loading}
          p="4"
          mt="4"
          onPress={() => onClickSubmit(false)}
        >
          {t("SAVE_AND_NEXT")}
        </FrontEndTypo.Primarybutton>
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
