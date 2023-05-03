import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../parts/schema.js";
import {
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
import CustomRadio from "../../component/CustomRadio";
import Steper from "../../component/Steper";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  Camera,
  Layout,
  H1,
  Caption,
  t,
  login,
  H3,
  IconByName,
  BodySmall,
  filtersByObject,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Clipboard from "component/Clipboard.js";

const CustomR = ({ options, value, onChange, required }) => {
  return (
    <CustomRadio
      items={options?.enumOptions}
      value={value}
      required={required}
      onChange={(value) => onChange(value)}
    />
  );
};

const RadioBtn = ({ options, value, onChange, required }) => {
  const items = options?.enumOptions;
  return (
    <Radio.Group
      name="exampleGroup"
      defaultValue="1"
      accessibilityLabel="pick a size"
      value={value}
      onChange={(value) => onChange(value)}
    >
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        alignItems={{
          base: "flex-start",
          md: "center",
        }}
        space={4}
        w="75%"
        maxW="300px"
      >
        {items.map((item) => (
          <Radio key={item?.value} value={item?.value} size="lg">
            {item?.label}
          </Radio>
        ))}
      </Stack>
    </Radio.Group>
  );
};

export default function App({ facilitator, ip, onClick }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const [addBtn, setAddBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  if (form_step_number && parseInt(form_step_number) >= 13) {
    navigate("/dashboard");
  }
  const onPressBackButton = () => {
    const data = nextPreviewStep("p");
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

    qualification: {
      "ui:widget": CustomR,
    },
    degree: {
      "ui:widget": CustomR,
    },
    gender: {
      "ui:widget": CustomR,
    },
    type_mobile: {
      "ui:widget": CustomR,
    },
    sourcing_channel: {
      "ui:widget": CustomR,
    },
    availability: {
      "ui:widget": RadioBtn,
    },
    device_ownership: {
      "ui:widget": RadioBtn,
    },
    device_type: {
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

  const nextPreviewStep = (pageStape = "n") => {
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
        setCameraModal(true);
      } else {
        return true;
      }
    }
  };
  const setStep = async (pageNumber = "") => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      if (pageNumber !== "") {
        setPage(pageNumber);
        setSchema(properties[pageNumber]);
      } else {
        nextPreviewStep();
      }
    }
  };

  const getOptions = (schema, { key, arr, title, value, filters } = {}) => {
    let enumNames = [];
    let enumArr = [];
    let arrData = arr;
    if (!_.isEmpty(filters)) {
      arrData = filtersByObject(arr, filters);
    }
    enumNames = arrData.map((e) => `${e?.[title]}`);
    enumArr = arrData.map((e) => `${e?.[value]}`);
    return {
      ...schema,
      ["properties"]: {
        ...schema["properties"],
        [key]: {
          ...schema["properties"][key],
          ...(_.isEmpty(arr)
            ? {}
            : { ["enumNames"]: enumNames, ["enum"]: enumArr }),
        },
      },
    };
  };

  React.useEffect(async () => {
    if (schema?.properties?.qualification) {
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
    }

    if (schema?.properties?.state) {
      const qData = await geolocationRegistryService.getStates();
      let newSchema = schema;
      if (schema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: qData,
          title: "state_name",
          value: "state_name",
        });
      }
      setSchema(newSchema);
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
  }, []);

  const updateBtnText = () => {
    if (schema?.properties?.vo_experience) {
      if (formData.vo_experience?.length > 0) {
        setSubmitBtn(t("NEXT"));
        setAddBtn(t("ADD_MORE"));
      } else {
        setSubmitBtn(t("NO"));
        setAddBtn(t("YES"));
      }
    } else if (schema?.properties?.experience) {
      if (formData.experience?.length > 0) {
        setSubmitBtn(t("NEXT"));
        setAddBtn(t("ADD_MORE"));
      } else {
        setSubmitBtn(t("NO"));
        setAddBtn(t("YES"));
      }
    } else {
      setSubmitBtn(t("NEXT"));
    }
  };

  React.useEffect(() => {
    updateBtnText();
  }, [formData, page]);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (formData) => {
    const { id } = facilitator;
    if (id) {
      return await facilitatorRegistryService.stepUpdate({
        ...formData,
        parent_ip: ip?.id,
        id: id,
      });
    }
  };

  const formSubmitCreate = async (formData) => {
    return await facilitatorRegistryService.create({
      ...formData,
      parent_ip: ip?.id,
    });
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

  const customValidate = (data, errors, c) => {
    if (data?.mobile) {
      if (data?.mobile?.toString()?.length !== 10) {
        errors.mobile.addError("minimum lenght is 10");
      }
      if (!(data?.mobile > 6666666666 && data?.mobile < 9999999999)) {
        errors.mobile.addError("please enter valid number");
      }
    }
    if (data?.aadhar_token) {
      if (data?.aadhar_token?.toString()?.length !== 12) {
        errors.aadhar_token.addError(
          "Aadhaar numbers should be 12 digit in length"
        );
      }
    }
    if (data?.dob) {
      const years = moment().diff(data?.dob, "years");
      if (years < 18) {
        errors?.dob?.addError("Minimum age 18 year old");
      }
    }
    return errors;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    setFormData({ ...formData, ...data });
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length === 10) {
        const result = await userExist({ mobile: data?.mobile });
        if (result.isUserExist) {
          const newErrors = {
            mobile: {
              __errors: ["mobile number already exists"],
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
              __errors: ["aadhar number already exists"],
            },
          };
          setErrors(newErrors);
        }
      }
    }

    if (id === "root_state") {
      if (schema?.properties?.district) {
        const qData = await geolocationRegistryService.getDistricts({
          name: data?.state,
        });
        let newSchema = schema;
        if (schema["properties"]["district"]) {
          newSchema = getOptions(newSchema, {
            key: "district",
            arr: qData,
            title: "district_name",
            value: "district_name",
          });
        }
        if (schema["properties"]["block"]) {
          newSchema = getOptions(newSchema, { key: "block", arr: [] });
        }
        if (schema["properties"]["village"]) {
          newSchema = getOptions(newSchema, { key: "village", arr: [] });
        }
        setSchema(newSchema);
      }
    }

    if (id === "root_district") {
      if (schema?.properties?.block) {
        const qData = await geolocationRegistryService.getBlocks({
          name: data?.district,
        });
        let newSchema = schema;
        if (schema["properties"]["block"]) {
          newSchema = getOptions(newSchema, {
            key: "block",
            arr: qData,
            title: "block_name",
            value: "block_name",
          });
        }
        if (schema["properties"]["village"]) {
          newSchema = getOptions(newSchema, { key: "village", arr: [] });
        }
        setSchema(newSchema);
      }
    }

    if (id === "root_block") {
      if (schema?.properties?.village) {
        const qData = await geolocationRegistryService.getVillages({
          name: data?.block,
        });
        let newSchema = schema;
        if (schema["properties"]["village"]) {
          newSchema = getOptions(newSchema, {
            key: "village",
            arr: qData,
            title: "village_ward_name",
            value: "village_ward_name",
          });
        }
        setSchema(newSchema);
      }
    }
  };

  const onError = (data) => {
    console.log("on error", data);
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    const newFormData = data.formData;
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
        const data = await formSubmitCreate(newFormData);
        if (data?.error) {
          const newErrors = {
            mobile: {
              __errors: ["mobile number already exists"],
            },
          };
          setErrors(newErrors);
        } else {
          if (data?.username && data?.password) {
            setCredentials(data);
          }
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

  if (cameraUrl) {
    return (
      <Layout
        // _appBar={{ onPressBackButton }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <Box p="10">
            <Steper
              steps={[
                { value: "6", label: "Basic Details" },
                { value: "3", label: "Work Details" },
                { value: "4", label: "Other Details" },
              ]}
              progress={page}
            />
          </Box>
          <H1>{t("ADD_PROFILE_PHOTO")}</H1>
          <Center>
            <Image
              source={{
                uri: cameraUrl,
              }}
              alt=""
              size="324px"
            />
          </Center>
          <Caption>{t("CLEAR_PROFILE_MESSAGE")}</Caption>
          <Button
            variant={"primary"}
            onPress={async (e) => {
              await formSubmitUpdate({ ...formData, form_step_number: "13" });
              if (onClick) onClick("success");
            }}
          >
            {t("SUBMIT")}
          </Button>
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
          setCameraUrl: async (url) => {
            setCameraUrl(url);
            setFormData({ ...formData, ["profile_url"]: url });
          },
        }}
      />
    );
  }

  const AddButton = ({ icon, iconType, ...btnProps }) => {
    return (
      <Button
        variant={"outlinePrimary"}
        colorScheme="green"
        {...btnProps}
        onPress={(e) => {
          if (schema?.properties?.vo_experience) {
            if (formData.vo_experience?.length === 0) {
              setAddBtn(t("ADD_MORE"));
            }
          }
          if (schema?.properties?.experience) {
            if (formData.experience?.length === 0) {
              setAddBtn(t("ADD_MORE"));
            }
          }
          btnProps?.onClick();
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
          if (schema?.properties?.vo_experience) {
            if (formData.vo_experience?.length === 0) {
              setAddBtn(t("YES"));
            }
          }
          if (schema?.properties?.experience) {
            if (formData.experience?.length === 0) {
              setAddBtn(t("YES"));
            }
          }
          btnProps?.onClick();
        }}
      >
        <HStack>
          {icon} {t("REMOVE")}
        </HStack>
      </Button>
    );
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: `${ip?.name}`.trim(),
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Box py={6} px={4} mb={5}>
        <Box px="2" py="10">
          <Steper
            steps={[
              { value: "6", label: "Basic Details" },
              { value: "3", label: "Work Details" },
              { value: "4", label: "Other Details" },
            ]}
            progress={page - 1}
          />
        </Box>
        {page && page !== "" ? (
          <Form
            ref={formRef}
            templates={{
              ButtonTemplates: { AddButton: AddButton, RemoveButton },
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
            }}
          >
            <Button
              variant={"primary"}
              type="submit"
              onPress={() => formRef?.current?.submit()}
            >
              {pages[pages?.length - 1] === page ? "Submit" : submitBtn}
            </Button>
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
          <Modal.CloseButton />
          <Modal.Header p="5" borderBottomWidth="0">
            <H1 textAlign="center">Store your user credentials</H1>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <VStack alignItems="center">
                <Box
                  bg="gray.100"
                  p="3"
                  rounded="lg"
                  borderWidth={1}
                  borderColor="gray.300"
                >
                  <HStack alignItems="center" space="5">
                    <H3>Username</H3>
                    <BodySmall>{credentials?.username}</BodySmall>
                  </HStack>
                  <HStack alignItems="center" space="5">
                    <H3>Password</H3>
                    <BodySmall>{credentials?.password}</BodySmall>
                  </HStack>
                </Box>
              </VStack>
              <VStack alignItems="center">
                <Clipboard
                  text={`username:${credentials?.username}, password:${credentials?.password}`}
                  onPress={(e) =>
                    setCredentials({ ...credentials, copy: true })
                  }
                >
                  <HStack space="3">
                    <IconByName
                      name="FileCopyLineIcon"
                      isDisabled
                      rounded="full"
                      color="blue.300"
                    />
                    <H3 color="blue.300">Click here to copy and login</H3>
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
                  Login
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
