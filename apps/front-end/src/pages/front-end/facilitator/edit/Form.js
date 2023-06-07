import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, Center, HStack, Image, Modal, VStack } from "native-base";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
  Camera,
  Layout,
  H1,
  IconByName,
  H2,
  getBase64,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  CustomR,
  RadioBtn,
  Aadhaar,
  BaseInputTemplate,
  ArrayFieldTemplate,
  CustomOTPBox,
  select,
  FileUpload,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";

// App
export default function App({ userTokenInfo }) {
  const { step } = useParams();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [cameraFile, setCameraFile] = React.useState();
  const formRef = React.useRef();
  const uplodInputRef = React.useRef();
  const [formData, setFormData] = React.useState(userTokenInfo?.authUser);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
      },
    },
    qualification_ids: {
      "ui:widget": "checkboxes",
    },
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
      if (nextIndex !== undefined) {
        navigate(`/profile/edit/${nextIndex}`);
      } else if (pageStape.toLowerCase() === "n") {
        navigate(`/profile/edit/upload`);
      } else {
        return true;
      }
    }
  };

  React.useEffect(async () => {
    if (schema?.properties?.qualification_master_id) {
      setLoading(true);
      const qData = await facilitatorRegistryService.getQualificationAll();
      let newSchema = schema;
      if (schema["properties"]["qualification_master_id"]) {
        newSchema = getOptions(newSchema, {
          key: "qualification_master_id",
          arr: qData,
          title: "name",
          value: "id",
          filters: { type: "qualification" },
        });
        if (newSchema?.properties?.qualification_master_id) {
          let valueIndex = "";
          newSchema?.properties?.qualification_master_id?.enumNames?.forEach(
            (e, index) => {
              if (e.match("12")) {
                valueIndex =
                  newSchema?.properties?.qualification_master_id?.enum[index];
              }
            }
          );
          if (
            valueIndex !== "" &&
            formData.qualification_master_id == valueIndex
          ) {
            setAlert(t("YOU_NOT_ELIGIBLE"));
          } else {
            setAlert();
          }
        }
      }
      if (schema["properties"]["qualification_ids"]) {
        newSchema = getOptions(newSchema, {
          key: "qualification_ids",
          arr: qData,
          title: "name",
          value: "id",
          filters: { type: "teaching" },
        });
        console.log(newSchema);
      }
      setSchema(newSchema);
      setLoading(false);
    }
    console.log(schema);
    if (schema?.properties?.state) {
      setLoading(true);
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
      setLoading(false);
    }

    if (schema?.properties?.device_ownership) {
      if (formData?.device_ownership == "no") {
        setAlert(t("YOU_NOT_ELIGIBLE"));
      } else {
        setAlert();
      }
    }
    const ListOfEnum = await enumRegistryService.listOfEnum();
    let newSchema = schema;
    if (schema["properties"]?.["marital_status"]) {
      newSchema = getOptions(newSchema, {
        key: "social_category",
        arr: ListOfEnum?.data?.BENEFICIARY_SOCIAL_STATUS,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "marital_status",
        arr: ListOfEnum?.data?.BENEFICIARY_MARITAL_STATUS,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }
  }, [page]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step ? step : newSteps[0];
      setPage(newStep);
      setSchema(properties[newStep]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
    }
  }, [step]);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (data, overide) => {
    const { id } = formData;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.profileStapeUpdate({
        ...data,
        page_type: step,
        ...(overide ? overide : {}),
        id: id,
      });
      setLoading(false);
      return result;
    }
  };

  const uploadProfile = async () => {
    const { id } = formData;
    if (id) {
      setLoading(true);
      const form_data = new FormData();
      const item = {
        file: cameraFile,
        document_type: "profile",
        user_id: id,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }
      const result = await uploadRegistryService.uploadFile(form_data);
      setLoading(false);
      return result;
    }
  };

  const customValidate = (data, errors, c) => {
    if (data?.mobile) {
      if (data?.mobile?.toString()?.length !== 10) {
        errors.mobile.addError(t("MINIMUM_LENGTH_IS_10"));
      }
      if (!(data?.mobile > 6666666666 && data?.mobile < 9999999999)) {
        errors.mobile.addError(t("PLEASE_ENTER_VALID_NUMBER"));
      }
    }
    if (data?.aadhar_token) {
      if (
        data?.aadhar_token &&
        !`${data?.aadhar_token}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
      ) {
        errors?.aadhar_token?.addError(
          `${t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")}`
        );
      }
    }
    if (data?.dob) {
      const years = moment().diff(data?.dob, "years");
      if (years < 18) {
        errors?.dob?.addError(t("MINIMUM_AGE_18_YEAR_OLD"));
      }
    }
    ["grampanchayat", "first_name", "last_name"].forEach((key) => {
      if (
        key === "first_name" &&
        data?.first_name?.replaceAll(" ", "") === ""
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
    ["vo_experience", "experience"].forEach((keyex) => {
      data?.[keyex]?.map((item, index) => {
        ["role_title", "organization", "description"].forEach((key) => {
          if (item?.[key]) {
            if (
              !item?.[key]?.match(/^[a-zA-Z ]*$/g) ||
              item?.[key]?.replaceAll(" ", "") === ""
            ) {
              errors[keyex][index]?.[key]?.addError(
                `${t("REQUIRED_MESSAGE")} ${t(
                  schema?.properties?.[key]?.title
                )}`
              );
            } else if (key === "description" && item?.[key].length > 200) {
              errors[keyex][index]?.[key]?.addError(
                `${t("MAX_LENGHT_200")} ${t(schema?.properties?.[key]?.title)}`
              );
            }
          }
        });
      });
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

  const setDistric = async ({ state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema["properties"]["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema["properties"]["block"]) {
        newSchema = await setBlock({ district, block, schemaData: newSchema });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setBlock = async ({ district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
      });
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }
      if (schema["properties"]["village"]) {
        newSchema = await setVilage({ block, schemaData: newSchema });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setVilage = async ({ block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
      });
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, {
          key: "village",
          arr: qData?.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        });
      }
      setSchema(newSchema);
    } else {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
      setSchema(newSchema);
    }
    setLoading(false);
    return newSchema;
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
    if (id === "root_aadhar_token") {
      if (data?.aadhar_token?.toString()?.length === 12) {
        const result = await userExist({
          aadhar_token: data?.aadhar_token,
        });
        if (result.isUserExist) {
          const newErrors = {
            aadhar_token: {
              __errors: [t("AADHAAR_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }

    if (id === "root_qualification") {
      if (schema?.properties?.qualification) {
        let valueIndex = "";
        schema?.properties?.qualification?.enumNames?.forEach((e, index) => {
          if (e.match("12")) {
            valueIndex = schema?.properties?.qualification?.enum[index];
          }
        });
        if (valueIndex !== "" && data.qualification == valueIndex) {
          setAlert(t("YOU_NOT_ELIGIBLE"));
        } else {
          setAlert();
        }
      }
    }

    if (id === "root_device_ownership") {
      if (schema?.properties?.device_ownership) {
        if (data?.device_ownership == "no") {
          setAlert(t("YOU_NOT_ELIGIBLE"));
        } else {
          setAlert();
        }
      }
    }

    if (id === "root_state") {
      await setDistric({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({ block: data?.block, schemaData: schema });
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (schema?.properties?.first_name) {
      newFormData = {
        ...newFormData,
        ["first_name"]: newFormData?.first_name.replaceAll(" ", ""),
      };
    }

    if (schema?.properties?.last_name && newFormData?.last_name) {
      newFormData = {
        ...newFormData,
        ["last_name"]: newFormData?.last_name.replaceAll(" ", ""),
      };
    }
    if (_.isEmpty(errors)) {
      if (step === "reference_details") {
        console.log(newFormData);
      } else if (
        ["work_experience_details", "vo_experience_details"].includes(step)
      ) {
        const result = await Promise.all(
          newFormData.vo_experience.map((item) => {
            const newdata = filterObject(
              item,
              Object.keys(schema?.properties?.vo_experience?.items?.properties)
            );
            return formSubmitUpdate(newdata, {
              page_type: "work_experience_details",
              type:
                step === "vo_experience_details"
                  ? "vo_experience"
                  : "experience",
            });
          })
        );
        console.log(result);
      } else {
        const newdata = filterObject(
          newFormData,
          Object.keys(schema?.properties)
        );
        const data = await formSubmitUpdate(newdata);
      }
      if (localStorage.getItem("backToProfile") === "false") {
        nextPreviewStep();
      } else {
        navigate("/profile");
      }
    }
  };

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 25) {
      const data = await getBase64(file);
      setCameraUrl(data);
      setCameraFile(file);
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
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
          <H1 color="red.1000">{t("ADD_PROFILE_PHOTO")}</H1>
          <h5 color="red.1000" fontSize="3">
            {t("CLEAR_PROFILE_MESSAGE")}
          </h5>
          <Center>
            <Image
              source={{
                uri: cameraUrl,
              }}
              alt=""
              size="324px"
            />
          </Center>
          <FrontEndTypo.Primarybutton
            isLoading={loading}
            onPress={async (e) => {
              await uploadProfile();
              if (onClick) onClick("success");
            }}
          >
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton
            isLoading={loading}
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
          setCameraUrl: async (url, blob) => {
            setCameraUrl(url);
            setCameraFile(blob);
          },
        }}
      />
    );
  }

  if (page === "upload") {
    return (
      <Layout
        _appBar={{
          onPressBackButton: (e) =>
            navigate(`/profile/edit/${pages[pages.length - 1]}`),
          lang,
          setLang,
        }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
          <H1 color="red.1000">{t("JUST_ONE_STEP")}</H1>
          <H2 color="red.1000">{t("ADD_PROFILE_PHOTO")} -</H2>
          <FrontEndTypo.Primarybutton
            isLoading={loading}
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
          </FrontEndTypo.Primarybutton>
          <VStack space={2}>
            <Box>
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                ref={uplodInputRef}
                onChange={handleFileInputChange}
              />
              <FrontEndTypo.Secondarybutton
                isLoading={loading}
                leftIcon={<IconByName name="Download2LineIcon" isDisabled />}
                onPress={(e) => {
                  uplodInputRef?.current?.click();
                }}
              >
                {t("UPLOAD_PHOTO")}
              </FrontEndTypo.Secondarybutton>
            </Box>
            {errors?.fileSize ? (
              <H2 color="red.400">{errors?.fileSize}</H2>
            ) : (
              <React.Fragment />
            )}
          </VStack>
          <FrontEndTypo.Primarybutton
            isLoading={loading}
            onPress={async (e) => {
              if (onClick) onClick("success");
            }}
          >
            {t("SKIP_SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      </Layout>
    );
  }

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn"],
        leftIcon: <FrontEndTypo.H2>{t(schema?.step_name)}</FrontEndTypo.H2>,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
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
            key={lang}
            ref={formRef}
            widgets={{
              RadioBtn,
              CustomR,
              Aadhaar,
              select,
              CustomOTPBox,
              FileUpload,
            }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              DescriptionFieldTemplate,
              BaseInputTemplate,
              ArrayFieldTemplate,
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
              onSubmit,
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              isLoading={loading}
              p="4"
              mt="4"
              onPress={() => onClickSubmit(false)}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>

            <FrontEndTypo.Secondarybutton
              isLoading={loading}
              p="4"
              mt="4"
              onPress={() => onClickSubmit(true)}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
