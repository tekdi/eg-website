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
import BaseInputTemplate from "../../component/BaseInput";
import CustomRadio from "../../component/CustomRadio";
import Steper from "../../component/Steper";
import {
  facilitatorRegistryService,
  Camera,
  Layout,
  H1,
  Caption,
  t,
  login,
  H3,
  IconByName,
  BodySmall,
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
          <Radio value={item?.value} size="lg">
            {item?.label}
          </Radio>
        ))}
      </Stack>
    </Radio.Group>
  );
};

export default function App({ facilitator, ip, onClick }) {
  const [page, setPage] = React.useState();
  const [corePage, setCorePage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(true);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
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
    refreere: {
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
        setCorePage("camera");
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

  const getOptions = (schema, key, data) => {
    return {
      ...schema,
      ["properties"]: {
        ...schema["properties"],
        [key]: {
          ...schema["properties"][key],
          ["anyOf"]: data,
        },
      },
    };
  };

  React.useEffect(async () => {
    if (schema?.properties?.qualification) {
      const qData = await facilitatorRegistryService.getQualificationAll();
      let newSchema = schema;
      const qualificationData = qData
        .filter((e) => e.type === "qualification")
        .map((e) => ({ title: e?.name, const: `${e?.id}` }));
      if (schema["properties"]["qualification"]["anyOf"]) {
        newSchema = getOptions(newSchema, "qualification", qualificationData);
      }
      const degreeData = qData
        .filter((e) => e.type === "teaching")
        .map((e) => ({ title: e?.name, const: `${e?.id}` }));
      if (schema["properties"]["degree"]["anyOf"]) {
        newSchema = getOptions(newSchema, "degree", degreeData);
      }
      setSchema(newSchema);
    }
  }, [page && schema?.properties?.qualification?.anyOf?.length === 0]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const arr = ["1", "2"];
      const { id, form_step_number } = facilitator;
      let newPage = [];
      if (id) {
        newPage = newSteps.filter((e) => !arr.includes(e));
        const pageSet = form_step_number ? form_step_number : 3;
        setPage(pageSet);
        setSchema(properties[pageSet]);
      } else {
        newPage = newSteps.filter((e) => arr.includes(e));
        setPage(newPage[0]);
        setSchema(properties[newPage[0]]);
      }
      setPages(newPage);
    }
  }, []);

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
  };

  const onError = (data) => {
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

  if (corePage === "camera" && cameraUrl) {
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
  if (corePage === "camera") {
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

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: `${ip?.first_name} ${ip?.last_name}`.trim(),
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
            // templates={{ BaseInputTemplate }}
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
              {pages[pages?.length - 1] === page ? "Submit" : "Next"}
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
