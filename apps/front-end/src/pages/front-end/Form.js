import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../parts/schema.js";
import { Box, Button, Center, Image, Radio, Stack, VStack } from "native-base";
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
} from "@shiksha/common-lib";
import moment from "moment";

const CustomR = ({ options, value, onChange, required }) => {
  const items = options?.enumOptions?.map((e) => e.value);
  return (
    <CustomRadio
      items={items}
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

export default function App({ facilitator, onClick }) {
  const [page, setPage] = React.useState();
  const [corePage, setCorePage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(true);
  const [cameraUrl, setCameraUrl] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const onPressBackButton = () => {
    if (page !== "SplashScreen") {
      setPage("SplashScreen");
    } else {
      navigate(-1);
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
      },
    },
  };

  const setStep = async (pageNumber = "") => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      if (pageNumber !== "") {
        setPage(pageNumber);
        setSchema(properties[pageNumber]);
      } else {
        const index = pages.indexOf(page);
        if (index !== undefined) {
          const nextIndex = pages[index + 1];
          if (nextIndex !== undefined) {
            setPage(nextIndex);
            setSchema(properties[nextIndex]);
          } else {
            setCorePage("camera");
          }
        }
      }
    }
  };

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPages(newSteps);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
    }
  }, []);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmit = async () => {
    const result = await facilitatorRegistryService.create({
      ...formData,
      parent_ip: facilitator?.id,
    });
    onClick();
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
      const key = data[0].property.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = (data) => {
    const newFormData = data.formData;
    setFormData({ ...formData, ...newFormData });
    if (!errors) {
      setStep();
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
          <Button variant={"primary"} onPress={formSubmit}>
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
        name: `${facilitator?.first_name} ${facilitator?.last_name}`.trim(),
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
              schema,
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
    </Layout>
  );
}
