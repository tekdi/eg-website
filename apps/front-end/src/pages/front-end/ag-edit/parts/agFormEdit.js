import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import {
  Alert,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Modal,
  Radio,
  Stack,
  VStack,
} from "native-base";
import CustomRadio from "../../../../component/CustomRadio.js";
import Steper from "../../../../component/Steper.js";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  Camera,
  Layout,
  H1,
  t,
  login,
  H3,
  IconByName,
  BodySmall,
  filtersByObject,
  H2,
  getBase64,
  BodyMedium,
  changeLanguage,
  enumRegistryService,
  benificiaryRegistoryService,
  AgRegistryService,
  uploadRegistryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { useScreenshot } from "use-screenshot-hook";

import Clipboard from "component/Clipboard.js";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
} from "../../../../component/BaseInput.js";

// App
export default function agFormEdit({ ip, id }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [cameraData, setCameraData] = React.useState([]);
  const [schema, setSchema] = React.useState({});
  const [cameraSelection, setCameraSelection] = React.useState(0);
  const [cameraModal, setCameraModal] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const [addBtn, setAddBtn] = React.useState(t("YES"));
  const formRef = React.useRef();
  const uplodInputRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState(id);
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/basicdetails`);
  };
  const ref = React.createRef(null);
  const { image, takeScreenshot } = useScreenshot();
  const getImage = () => takeScreenshot({ ref });
  const downloadImage = () => {
    var FileSaver = require("file-saver");
    FileSaver.saveAs(`${image}`, "image.png");
  };

  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(id);
    setFormData(qData.result);
  }, []);

  React.useEffect(async () => {
    const updateDetails = await AgRegistryService.updateAg(formData, userId);

    if (page === "2") {
      setFormData({
        ...formData,
        edit_page_type: "edit_contact",
        device_ownership: device_ownership,
        device_type: device_type,
        mark_as_whatsapp_number: mark_as_whatsapp_number,
        alternative_device_ownership: alternative_device_ownership,
        alternative_device_type: alternative_device_type,
        //father_first_name: father_first_name,
        // father_middle_name: father_middle_name,
        // mother_first_name: mother_first_name,
        // mother_middle_name: mother_middle_name,
        // mother_last_name: mother_last_name,
      });
    } else if (page === "3") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "edit_address" });
    } else if (page === "4") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({
        ...formData,
        edit_page_type: "personal",
        marital_status: marital_status,
        social_category: social_category,
      });
    } else if (page === "5") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({
        ...formData,
        edit_page_type: "edit_family",
      });
    } else if (page === "6") {
      setFormData({
        ...formData,
        fatherdetails: {
          father_first_name: father_first_name,
          father_last_name: father_last_name,
          father_middle_name: father_middle_name,
        },
        motherdetails: {
          mother_first_name: mother_first_name,
          mother_middle_name: mother_middle_name,
          mother_last_name: mother_last_name,
        },
      });
    } else if (page === "7") {
      const updateDetails = await AgRegistryService.updateAg(
        formData?.fatherdetails,
        userId
      );
    }
  }, [page]);

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
      },
    },
    qualification: {
      "ui:widget": CustomR,
    },
    degree: {
      "ui:widget": CustomR,
    },
    gender: {
      "ui:widget": CustomR,
    },
    sourcing_channel: {
      "ui:widget": CustomR,
    },
    availability: {
      "ui:widget": RadioBtn,
    },

    experience: {
      related_to_teaching: {
        "ui:widget": RadioBtn,
      },
    },

    vo_experience: {
      items: {
        experience_in_years: { "ui:widget": CustomR },
        related_to_teaching: {
          "ui:widget": RadioBtn,
        },
      },
    },
    experience: {
      items: {
        experience_in_years: { "ui:widget": CustomR },
        related_to_teaching: {
          "ui:widget": RadioBtn,
        },
      },
    },
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    const properties = schema1.properties;
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        setPage(nextIndex);
        setSchema(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        await formSubmitUpdate({ ...formData, form_step_number: "6" });
        setPage("SAVE");
      } else {
        return true;
      }
    }
  };
  const setStep = async (pageNumber = "") => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      if (pageNumber !== "") {
        if (page !== pageNumber) {
          setPage(pageNumber);
          setSchema(properties[pageNumber]);
        }
      } else {
        nextPreviewStep();
      }
    }
  };

  const getOptions = (schema, { key, arr, title, value, filters } = {}) => {
    let enumObj = {};
    let arrData = arr;
    if (!_.isEmpty(filters)) {
      arrData = filtersByObject(arr, filters);
    }
    enumObj = {
      ...enumObj,
      ["enumNames"]: arrData.map((e) => `${e?.[title]}`),
    };
    enumObj = { ...enumObj, ["enum"]: arrData.map((e) => `${e?.[value]}`) };
    const newProperties = schema["properties"][key];
    let properties = {};
    if (newProperties) {
      if (newProperties.enum) delete newProperties.enum;
      let { enumNames, ...remainData } = newProperties;
      properties = remainData;
    }
    return {
      ...schema,
      ["properties"]: {
        ...schema["properties"],
        [key]: {
          ...properties,
          ...(_.isEmpty(arr) ? {} : enumObj),
        },
      },
    };
  };

  React.useEffect(async () => {
    if (schema?.properties?.state) {
      const qData = await geolocationRegistryService.getStates();
      let newSchema = schema;
      if (schema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: qData?.states,
          title: "state_name",
          value: "state_name",
        });
      }
      newSchema = await setDistric({
        schemaData: newSchema,
        state: formData?.state,
        district: formData?.district,
        block: formData?.block,
      });
      setSchema(newSchema);
    }
  }, [page]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 30);
      let maxYear = moment().subtract("years", 14);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  const updateBtnText = () => {
    if (schema?.properties?.vo_experience) {
      if (formData.vo_experience?.length > 0) {
        setSubmitBtn(t("NEXT"));
        setAddBtn(t("ADD_EXPERIENCE"));
      } else {
        setSubmitBtn(t("NO"));
        setAddBtn(t("YES"));
      }
    } else if (schema?.properties?.mobile) {
      setSubmitBtn(t("SAVE"));
      setAddBtn(t("ADD_EXPERIENCE"));
    } else {
      setSubmitBtn(t("SAVE"));
    }
  };

  React.useEffect(() => {
    updateBtnText();
  }, [formData, page, lang]);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (formData) => {
    if (id) {
      const data = await enumRegistryService.editProfileById({
        ...formData,
        id: id,
      });
    }
  };

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        console.log(e);
        const data = schema1["properties"]?.[e]["properties"]?.[key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const customValidate = (data, errors, c) => {
    if (data?.dob) {
      const years = moment().diff(data?.dob, "years");
      if (years < 18) {
        errors?.dob?.addError(t("MINIMUM_AGE_18_YEAR_OLD"));
      }
    }
    ["first_name", "last_name", "middle_name"].forEach((key) => {
      if (
        key === "first_name" &&
        data?.first_name?.replaceAll(" ", "") === ""
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      // if (key === "last_name" && data?.last_name?.replaceAll(" ", "") === "") {
      //   errors?.[key]?.addError(
      //     `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
      //   );
      // }
      if (
        key === "middle_name" &&
        data?.middle_name?.includes(" ") &&
        data?.middle_name?.trim() === ""
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }
    });

    return errors;
  };

  const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      } else if (error.name === "enum") {
        error.message = `${t("SELECT_MESSAGE")}`;
      }
      return error;
    });
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length === 10) {
        const result = await userExist({ mobile: data?.mobile });
        if (result.isUserExist) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }
  };

  const onError = (data) => {
    console.log(data);
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    const updateDetails = await AgRegistryService.updateAg(formData, userId);
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  const [cameraFile, setcameraFile] = useState();

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 2) {
      const data = await getBase64(file);
      setCameraUrl(data);
      setcameraFile(file);
      setFormData({ ...formData, ["profile_url"]: data });
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };

  const uploadProfile = async () => {
    // const { id } = authUser;
    if (userId) {
      const form_data = new FormData();
      const item = {
        file: cameraFile,
        document_type: "profile",
        user_id: userId,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }

      const uploadDoc = await uploadRegistryService.uploadFile(form_data);
    }
  };

  if (cameraUrl) {
    return (
      <Layout
        _appBar={{
          lang,
          setLang,
          onPressBackButton: (e) => {
            setCameraUrl();
            setCameraModal(false);
          },
        }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          {/* add the profile image */}
          <H1 color="red.1000">{t("ADD_ID_PHOTOS")}</H1>
          <h5 color="red.1000" fontSize="3">
            {t("CLEAR_PROFILE_MESSAGE")}
          </h5>

          <Center>
            <Image
              source={{
                uri: cameraUrl,
                //show the image
              }}
              alt=""
              size="324px"
            />
          </Center>
          <h5 color="red.1000" fontSize="2">
            {t("FRONT_VIEW")}
          </h5>
          <FrontEndTypo.Primarybutton
            onPress={async (e) => {
              if (cameraSelection >= 2) {
                nextPreviewStep();
                setCameraUrl();
                setCameraModal(false);
                pages[pages?.length - 1] === page;
              } else {
                console.log("reached else ==>");
                uploadProfile();
                setCameraUrl();
                setCameraModal(true);
                setCameraSelection(cameraSelection + 1);
              }
              /*  await formSubmitUpdate({ ...formData, form_step_number: "5" });
              console.log(...formData);
              if (onClick) onClick(cameraUrl); */
            }}
          >
            {cameraSelection > 2 ? setSubmitBtn(t("SAVE")) : t("SAVE")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton
            leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_ANOTHER_PHOTO")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </Layout>
    );
  }
  if (cameraModal) {
    return (
      <Camera
        {...{
          cameraModal,
          setCameraModal,
          cameraUrl,
          setcameraFile,
          setCameraUrl: async (url) => {
            setCameraUrl(url);
            setCameraData([...cameraData, url]);
            setFormData({ ...formData, ["profile_url"]: cameraData });
          },
        }}
      />
    );
  }

  if (page === "5") {
    return (
      <Layout
        _appBar={{
          onPressBackButton: (e) => setPage("4"),
          lang,
          setLang,
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <H1 color="red.1000">{t("ADD_ID_PHOTOS")}</H1>
          <h5 color="red.1000" fontSize="3">
            {t("CLEAR_PROFILE_MESSAGE")}
          </h5>
          <Button
            variant={"primary"}
            leftIcon={
              <IconByName
                name="CameraLineIcon"
                color="white"
                size={2}
                isDisabled
              />
            }
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_PHOTO")}
          </Button>
          <VStack space={2}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            {errors?.fileSize ? (
              <H2 color="red.400">{errors?.fileSize}</H2>
            ) : (
              <React.Fragment />
            )}
          </VStack>
        </VStack>
      </Layout>
    );
  }

  const AddButton = ({ icon, iconType, ...btnProps }) => {
    return (
      <Button
        variant={"outlinePrimary"}
        colorScheme="green"
        {...btnProps}
        onPress={(e) => {
          updateBtnText();
          if (formRef?.current.validateForm()) {
            btnProps?.onClick();
          }
        }}
      >
        <HStack>
          {icon} {addBtn}
        </HStack>
      </Button>
    );
  };

  const RemoveButton = ({ icon, iconType, ...btnProps }) => {
    return (
      <Button
        variant={"outlinePrimary"}
        colorScheme="red"
        mb="2"
        {...btnProps}
        onPress={(e) => {
          updateBtnText();
          btnProps?.onClick();
        }}
      >
        <HStack>
          {icon} {t("REMOVE_EXPERIENCE")}
        </HStack>
      </Button>
    );
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("BASIC_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Box py={6} px={4} mb={5}>
        {/* Box */}
        {alert ? (
          <Alert status="warning" alignItems={"start"} mb="3">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{alert}</BodyMedium>
            </HStack>
          </Alert>
        ) : (
          <React.Fragment />
        )}
        {page && page !== "" ? (
          <Form
            key={lang + addBtn}
            ref={formRef}
            widgets={{ RadioBtn, CustomR }}
            templates={{
              ButtonTemplates: { AddButton, RemoveButton },
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              DescriptionFieldTemplate,
              BaseInputTemplate,
            }}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              schema: schema ? schema : {},
              uiSchema,
              formData,
              customValidate,
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              onPress={() => formRef?.current?.submit()}
            >
              {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
      <Modal
        isOpen={credentials}
        onClose={() => setCredentials(false)}
        safeAreaTop={true}
        size="xl"
      >
        <Modal.Content>
          {/* <Modal.CloseButton /> */}
          <Modal.Header p="5" borderBottomWidth="0">
            <H1 textAlign="center">{t("STORE_YOUR_CREDENTIALS")}</H1>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <VStack alignItems="center">
                <Box
                  bg="gray.100"
                  p="1"
                  rounded="lg"
                  borderWidth={1}
                  borderColor="gray.300"
                >
                  <HStack alignItems="center" space="5">
                    <H3>{t("USERNAME")}</H3>
                    <BodySmall
                      wordWrap="break-word"
                      width="130px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {credentials?.username}
                    </BodySmall>
                  </HStack>
                  <HStack alignItems="center" space="5">
                    <H3>{t("PASSWORD")}</H3>
                    <BodySmall
                      wordWrap="break-word"
                      width="130px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {credentials?.password}
                    </BodySmall>
                  </HStack>
                </Box>
              </VStack>
              <VStack alignItems="center">
                <Clipboard
                  text={`username:${credentials?.username}, password:${credentials?.password}`}
                  onPress={(e) => {
                    setCredentials({ ...credentials, copy: true });
                    downloadImage();
                  }}
                >
                  <HStack space="3">
                    <IconByName
                      name="FileCopyLineIcon"
                      isDisabled
                      rounded="full"
                      color="blue.300"
                    />
                    <H3 color="blue.300">
                      {t("CLICK_HERE_TO_COPY_AND_LOGIN")}
                    </H3>
                  </HStack>
                </Clipboard>
              </VStack>
              <HStack space="5" pt="5">
                <Button
                  flex={1}
                  variant="primary"
                  isDisabled={!credentials?.copy}
                  onPress={async (e) => {
                    const { copy, ...cData } = credentials;
                    const loginData = await login(cData);
                    navigate("/");
                    navigate(0);
                  }}
                >
                  {t("LOGIN")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
