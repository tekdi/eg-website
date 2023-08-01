import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../parts/schema.js";
import { Alert, Box, Center, HStack, Image, Modal, VStack } from "native-base";
import Steper from "../../component/Steper";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
  Camera,
  Layout,
  H1,
  login,
  H3,
  IconByName,
  BodySmall,
  H2,
  getBase64,
  BodyMedium,
  sendAndVerifyOtp,
  FrontEndTypo,
  getOptions,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Clipboard from "component/Clipboard.js";
import { widgets, templates } from "../../component/BaseInput";
import { useScreenshot } from "use-screenshot-hook";
import { useTranslation } from "react-i18next";

// App
export default function App({ facilitator, ip, onClick }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [cameraFile, setCameraFile] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const uplodInputRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [verifyOtpData, setverifyOtpData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [otpButton, setOtpButton] = React.useState(false);
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  const { t } = useTranslation();
  if (form_step_number && parseInt(form_step_number) >= 10) {
    navigate("/dashboard");
  }

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };
  const ref = React.createRef(null);
  const { image, takeScreenshot } = useScreenshot();
  const getImage = () => takeScreenshot({ ref });
  const downloadImage = () => {
    var FileSaver = require("file-saver");
    FileSaver.saveAs(`${image}`, "image.png");
  };

  React.useEffect(() => {
    getImage();
  }, [page, credentials]);

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
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
        await formSubmitUpdate({ ...formData, form_step_number: "10" });
        setPage("upload");
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

  React.useEffect(async () => {
    if (schema?.properties?.qualification) {
      setLoading(true);
      const qData = await facilitatorRegistryService.getQualificationAll();
      let newSchema = schema;
      if (schema["properties"]["qualification"]) {
        newSchema = getOptions(newSchema, {
          key: "qualification",
          arr: qData,
          title: "name",
          value: "id",
          filters: { type: "qualification" },
        });
        if (newSchema?.properties?.qualification) {
          let valueIndex = "";
          newSchema?.properties?.qualification?.enumNames?.forEach(
            (e, index) => {
              if (e.match("12")) {
                valueIndex = newSchema?.properties?.qualification?.enum[index];
              }
            }
          );
          if (valueIndex !== "" && formData.qualification == valueIndex) {
            setAlert(t("YOU_NOT_ELIGIBLE"));
          } else {
            setAlert();
          }
        }
      }
      if (schema["properties"]["degree"]) {
        newSchema = getOptions(newSchema, {
          key: "degree",
          arr: qData,
          title: "name",
          value: "id",
          filters: { type: "teaching" },
        });
      }
      setSchema(newSchema);
      setLoading(false);
    }

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
  }, [page]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const arr = ["1", "2"];
      const { id, form_step_number } = facilitator;
      let newPage = [];
      if (id) {
        newPage = newSteps.filter((e) => !arr.includes(e));
        //  const pageSet = form_step_number ? form_step_number : 3;
        const pageSet = "3";
        setPage(pageSet);
        setSchema(properties[pageSet]);
      } else {
        newPage = newSteps.filter((e) => arr.includes(e));
        setPage(newPage[0]);
        setSchema(properties[newPage[0]]);
      }
      setPages(newPage);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
    if (facilitator?.id) {
      setFormData(facilitator);
    }
  }, []);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (formData) => {
    const { id } = facilitator;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.stepUpdate({
        ...formData,
        parent_ip: ip?.id,
        id: id,
      });
      setLoading(false);
      return result;
    }
  };

  const uploadProfile = async () => {
    const { id } = facilitator;
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

  const formSubmitCreate = async (formData) => {
    setLoading(true);
    const result = await facilitatorRegistryService.register({
      ...formData,
      mobile: `${formData.mobile}`,
      parent_ip: ip?.id,
    });
    setLoading(false);
    return result;
  };

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = schema1["properties"][e]["properties"][key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const validate = (data, key) => {
    let error = {};
    switch (key) {
      case "mobile":
        if (data?.mobile?.toString()?.length !== 10) {
          error = { mobile: t("MINIMUM_LENGTH_IS_10") };
        }
        if (!(data?.mobile > 6000000000 && data?.mobile < 9999999999)) {
          error = { mobile: t("PLEASE_ENTER_VALID_NUMBER") };
        }
        break;
      case "aadhar_no":
        if (
          data?.aadhar_no &&
          !`${data?.aadhar_no}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
        ) {
          error = { aadhar_no: t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER") };
        }
        break;
      case "dob":
        const years = moment().diff(data?.dob, "years");
        if (years < 18) {
          error = { dob: t("MINIMUM_AGE_18_YEAR_OLD") };
        }
        break;
      case "grampanchayat":
      case "first_name":
      case "last_name":
      case "middle_name":
        // do some thing
        break;
      case "vo_experience":
      case "experience":
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
                    `${t("MAX_LENGHT_200")} ${t(
                      schema?.properties?.[key]?.title
                    )}`
                  );
                }
              }
            });
          });
        });
        break;
      default:
        break;
    }
    return error;
  };

  const customValidate = (data, err) => {
    const arr = Object.keys(err);
    arr.forEach((key) => {
      const isValid = validate(data, key);
      if (isValid?.[key]) {
        if (!errors?.[key]?.__errors.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    });

    return err;
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
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_mobile") {
      let { mobile, ...otherError } = errors ? errors : {};
      setErrors(otherError);
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
      if (schema?.properties?.otp) {
        const { otp, ...properties } = schema?.properties;
        const required = schema?.required.filter((item) => item !== "otp");
        setSchema({ ...schema, properties, required });
        setFormData((e) => {
          const { otp, ...fData } = e;
          return fData;
        });
        setOtpButton(false);
      }
    }
    if (id === "root_aadhar_no") {
      let { aadhar_no, ...otherError } = errors ? errors : {};
      setErrors(otherError);
      if (data?.aadhar_no?.toString()?.length === 12) {
        const result = await userExist({
          aadhar_no: data?.aadhar_no,
        });
        if (result.isUserExist) {
          const newErrors = {
            aadhar_no: {
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

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
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

    const newData = {
      ...formData,
      ...newFormData,
      ["form_step_number"]: parseInt(page) + 1,
    };
    setFormData(newData);
    if (_.isEmpty(errors)) {
      const { id } = facilitator;
      let success = false;
      if (id) {
        // const data = await formSubmitUpdate(newData);
        // if (!_.isEmpty(data)) {
        success = true;
        // }
      } else if (page === "2") {
        const { status, otpData, newSchema } = await sendAndVerifyOtp(schema, {
          ...newFormData,
          hash: localStorage.getItem("hash"),
        });
        setverifyOtpData(otpData);
        if (status === true) {
          const data = await formSubmitCreate(newFormData);
          if (data?.error) {
            const newErrors = {
              mobile: {
                __errors:
                  data?.error?.constructor?.name === "String"
                    ? [data?.error]
                    : data?.error?.constructor?.name === "Array"
                    ? data?.error
                    : [t("MOBILE_NUMBER_ALREADY_EXISTS")],
              },
            };
            setErrors(newErrors);
          } else {
            if (data?.username && data?.password) {
              setCredentials(data);
            }
          }
        } else if (status === false) {
          const newErrors = {
            otp: {
              __errors: [t("USER_ENTER_VALID_OTP")],
            },
          };
          setErrors(newErrors);
        } else {
          setSchema(newSchema);
          setOtpButton(true);
        }
      } else if (page <= 1) {
        success = true;
      }
      if (success) {
        setStep();
      }
    } else {
      const key = Object.keys(errors);
      if (key[0]) {
        goErrorPage(key[0]);
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
          <Box p="10">
            <Steper
              type={"circle"}
              steps={[
                { value: "6", label: t("BASIC_DETAILS") },
                { value: "3", label: t("WORK_DETAILS") },
                { value: "1", label: t("OTHER_DETAILS") },
              ]}
              progress={page === "upload" ? 10 : page}
            />
          </Box>
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
        _appBar={{ onPressBackButton: (e) => setPage("10"), lang, setLang }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
          <Box p="10">
            <Steper
              type={"circle"}
              steps={[
                { value: "6", label: t("BASIC_DETAILS") },
                { value: "3", label: t("WORK_DETAILS") },
                { value: "1", label: t("OTHER_DETAILS") },
              ]}
              progress={page === "upload" ? 10 : page}
            />
          </Box>
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
              await formSubmitUpdate({ ...formData, form_step_number: "10" });
              if (onClick) onClick("success");
            }}
          >
            {t("SKIP_SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      </Layout>
    );
  }

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        exceptIconsShow:
          `${page}` === "1" ? ["menuBtn"] : ["menuBtn", "notificationBtn"],
        name: `${ip?.name}`.trim(),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        <Box px="2" pb="10">
          <Steper
            type={"circle"}
            steps={[
              { value: "6", label: t("BASIC_DETAILS") },
              { value: "3", label: t("WORK_DETAILS") },
              { value: "1", label: t("OTHER_DETAILS") },
            ]}
            progress={page - 1}
          />
        </Box>
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
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              widgets,
              templates,
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
            {page === "2" ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={(e) => {
                  formRef?.current?.submit();
                }}
              >
                {otpButton ? t("VERIFY_OTP") : t("SEND_OTP")}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                isLoading={loading}
                type="submit"
                p="4"
                mt="10"
                onPress={(e) => {
                  formRef?.current?.submit();
                }}
              >
                {pages[pages?.length - 1] === page ? t("SUBMIT") : submitBtn}
              </FrontEndTypo.Primarybutton>
            )}
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
      <Modal
        isOpen={credentials}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <H1 textAlign="center">{t("STORE_YOUR_CREDENTIALS")}</H1>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <VStack
                space="2"
                bg="gray.100"
                p="1"
                rounded="lg"
                borderWidth={1}
                borderColor="gray.300"
                w="100%"
              >
                <HStack alignItems="center" space="1" flex="1">
                  <H3 flex="0.3">{t("USERNAME")}</H3>
                  <BodySmall
                    py="1"
                    px="2"
                    flex="0.7"
                    wordWrap="break-word"
                    whiteSpace="break-spaces"
                    overflow="hidden"
                    bg="success.100"
                    borderWidth="1"
                    borderColor="success.500"
                  >
                    {credentials?.username}
                  </BodySmall>
                </HStack>
                <HStack alignItems="center" space="1" flex="1">
                  <H3 flex="0.3">{t("PASSWORD")}</H3>
                  <BodySmall
                    py="1"
                    px="2"
                    flex="0.7"
                    wordWrap="break-word"
                    whiteSpace="break-spaces"
                    overflow="hidden"
                    bg="success.100"
                    borderWidth="1"
                    borderColor="success.500"
                  >
                    {credentials?.password}
                  </BodySmall>
                </HStack>
              </VStack>
              <VStack alignItems="center">
                <Clipboard
                  text={`username: ${credentials?.username}, password: ${credentials?.password}`}
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
                <FrontEndTypo.Primarybutton
                  flex={1}
                  isDisabled={!credentials?.copy}
                  onPress={async (e) => {
                    const { copy, ...cData } = credentials;
                    const loginData = await login(cData);
                    navigate("/");
                    navigate(0);
                  }}
                >
                  {t("LOGIN")}
                </FrontEndTypo.Primarybutton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
