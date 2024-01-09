import { CustomOTPBox, FrontEndTypo, Layout, t } from "@shiksha/common-lib";
import { Box, HStack, Image, Stack, VStack } from "native-base";
import React, { useState, useCallback, useEffect } from "react";
import validator from "@rjsf/validator-ajv8";
import { get, set } from "idb-keyval";
import moment from "moment";
import {
  widgets,
  templates,
  RadioBtn,
  CustomR,
  FieldTemplate,
} from "../../../../component/BaseInput";

import Form from "@rjsf/core";

import Steper from "component/Steper";
import { useNavigate } from "react-router-dom";

const FacilitatorOnboarding = () => {
  const [activeScreenName, setActiveScreenName] = useState();
  const [mobileNumber, setMobileNumber] = useState("");
  const [previousScreen, setPreviousScreen] = useState(0);
  const [page, setPage] = React.useState(0);
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);

  const [date_of_birth, set_date_of_birth] = useState({});

  const [formData, setFormData] = useState({});

  const [formDataContact, setFormDataContact] = useState({});

  const [formDataBasicDetails, setFormDataBasicDetails] = useState({});

  const [formDataVolunteerExperience, setFormDataVolunteerExperience] =
    useState({});

  const [user_data, setUserData] = useState(null);

  // useEffect(async () => {
  //   if (user_data !== null) {
  //     set_date_of_birth(user_data?.users?.dob);
  //   }
  //   set_date_of_birth((prevData) => ({
  //     ...prevData,
  //     date_of_birth: date_of_birth,
  //   }));
  // }, [user_data]);

  const [countLoad, setCountLoad] = useState(0);

  const fetchData = useCallback(async () => {
    if (countLoad === 0) {
      setCountLoad(1);
    } else if (countLoad === 1) {
      let userData = await get("user_data");
      setUserData(userData);
      setCountLoad(2);
    } else if (countLoad === 2) {
      setCountLoad(3);
    }
  }, [countLoad]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigate = useNavigate();

  const handleInputChange = (value) => {
    setMobileNumber(value);
  };

  const handleNextScreen = (screenName) => {
    setActiveScreenName(screenName);

    setPage(page + 1);
    console.log("page", page);

    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      // console.log("Current page:", nextPage);

      // console.log("Navigating to:", screenName);
      navigate(`/offline/profile/${screenName}`);

      // console.log("Next page:", nextPage);

      return nextPage;
    });
  };

  const screensOrder = [
    "dateOfBirth",
    "contactDetails",
    "basicDetails",
    "voluenteerExperience",
    "jobExperience",
    "educationDetails",
    "otheDetails",
    "facilitatorProfilePicture",
  ];
  const handlePreviousScreen = () => {
    const currentIndex = screensOrder.indexOf(activeScreenName);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      const previousScreen = screensOrder[previousIndex];
      setActiveScreenName(previousScreen);
      navigate(`/offline/profile/${previousScreen}`);
    } else {
      console.log("previous screen");
    }
  };

  const handleDateOfBirth = async () => {
    try {
      const updatedUserData = {
        ...user_data,
        users: {
          ...user_data?.users,
          dob: date_of_birth.dob,
        },
      };

      // Update the specific fields in IndexedDB
      await set("user_data", updatedUserData);

      setUserData(updatedUserData); // Update the local state for immediate reflection
      setPage((prevPage) => prevPage + 1);
      handleNextScreen("contactDetails");
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
  };
  const handleContactDetails = async () => {
    try {
      // Update the specific fields in IndexedDB
      const updatedUserData = {
        ...user_data,
        users: {
          ...user_data?.users,
          mobile: formDataContact.mobile,
          alternative_mobile_number: formDataContact.alternative_mobile_number,
          email_id: formDataContact.email_id,
          // Add other fields as needed
        },
        core_faciltator: {
          ...user_data?.core_faciltator,
          device_ownership: formDataContact.device_ownership,
          device_type: formDataContact.device_type,
        },
      };

      // Update the specific fields in IndexedDB
      await set("user_data", updatedUserData);

      setUserData(updatedUserData); // Update the local state for immediate reflection
      setPage((prevPage) => prevPage + 1);
      handleNextScreen("basicDetails");
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
  };
  const handleBasicDetails = async () => {
    try {
      const updatedUserData = {
        ...user_data,
        users: {
          ...user_data?.users,
          gender: formDataBasicDetails.gender,
          // Add other fields as needed
        },
        extended_users: {
          ...user_data?.extended_users,
          marital_status: formDataBasicDetails.marital_status,
          social_category: formDataBasicDetails.social_category,
        },
      };

      // Update the specific fields in IndexedDB
      await set("user_data", updatedUserData);

      setUserData(updatedUserData); // Update the local state for immediate reflection
      setPage((prevPage) => prevPage + 1);
      handleNextScreen("voluenteerExperience");
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
  };

  const handleVoluenteerExperience = async () => {
    try {
      const updatedUserData = {
        ...user_data,
        experience: [
          {
            ...user_data?.experience,
            type: formDataVolunteerExperience.type,
            role_title: formDataVolunteerExperience.role_title,
            organization: formDataVolunteerExperience.organization,
            experience_in_years:
              formDataVolunteerExperience.experience_in_years,
            related_to_teaching:
              formDataVolunteerExperience.related_to_teaching,
            description: formDataVolunteerExperience.description,
          },
        ],
      };

      // Update the specific fields in IndexedDB
      await set("user_data", updatedUserData);

      setUserData(updatedUserData); // Update the local state for immediate reflection
      setPage((prevPage) => prevPage + 1);
      console.log("hi");
      handleNextScreen("jobExperience");
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
  };

  //screen1

  React.useEffect(() => {
    let minYear = moment().subtract("years", 30);
    let maxYear = moment().subtract("years", 12);
    setYearsRange([minYear.year(), maxYear.year()]);
  }, []);

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

  const dateOfBirth = () => (
    <>
      <VStack flex={3} space={6}>
        <Stack space={3}>
          <Form
            formData={date_of_birth}
            onChange={(e) => set_date_of_birth(e.formData)}
            onSubmit={handleDateOfBirth}
            {...{ templates, FieldTemplate }}
            validator={validator}
            schema={{
              type: "object",
              required: ["dob"],
              properties: {
                dob: {
                  type: "string",
                  label: "DATE_OF_BIRTH",
                  description: "AS_PER_AADHAAR",
                  format: "date",
                },
              },
            }}
            uiSchema={uiSchema}
          >
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "40px" }}
              onPress={handleDateOfBirth}
            >
              {t("NEXT")}
            </FrontEndTypo.Primarybutton>
          </Form>
        </Stack>
      </VStack>
    </>
  );
  const contactDetails = () => (
    <>
      <VStack flex={3} space={6}>
        <Form
          formData={formDataContact}
          onChange={(e) => setFormDataContact(e.formData)}
          onSubmit={handleContactDetails}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          schema={{
            type: "object",
            properties: {
              mobile: {
                label: "CONTACT_INFORMATION",
                type: "number",
                title: "MOBILE_NUMBER",
              },
              device_ownership: {
                label: "DEVICE_OWNERSHIP",
                type: "string",
                format: "RadioBtn",
                enum: ["YES", "NO_I_USE_A_FAMILY_MEMBERS"],
              },
              device_type: {
                label: "TYPE_OF_MOBILE_PHONE",
                type: "string",
                format: "CustomR",
                grid: 2,
                icons: [{ name: "AndroidLineIcon" }, { name: "AppleLineIcon" }],
                enumNames: ["ANDROID", "IPHONE"],
                enum: ["android", "iphone"],
              },
              alternative_mobile: {
                label: "ALTERNATIVE_NUMBER",
                type: "number",
                title: "MOBILE_NUMBER",
              },

              email_id: {
                label: "EMAIL_ID",
                type: "string",
                format: "email",
                title: "EMAIL_ID",
              },
            },
          }}
        >
          <VStack space={7}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={handleContactDetails}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              style={{ top: "40px", bottom: "20px" }}
              // onPress={handleContactDetails}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );

  const basicDetails = () => (
    <>
      <VStack flex={3} space={6}>
        <Form
          formData={formDataBasicDetails}
          onChange={(e) => setFormDataBasicDetails(e.formData)}
          onSubmit={handleBasicDetails}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          schema={{
            type: "object",
            properties: {
              gender: {
                label: "GENDER",
                type: "string",
                format: "CustomR",
                grid: 3,
                icons: [
                  {
                    name: "Female",
                    _icon: { size: "30" },
                  },
                  {
                    name: "Male",
                    _icon: { size: "30" },
                  },
                  {
                    name: "Other",
                    _icon: { size: "30" },
                  },
                ],
                enumNames: ["FEMALE", "MALE", "OTHER"],
                enum: ["female", "male", "other"],
              },
              marital_status: {
                label: "MARITAL_STATUS",
                type: "string",
                format: "CustomR",
                grid: 2,
                enumNames: [
                  "MARITAL_STATUS_MARRIED",
                  "MARITAL_STATUS_UNMARRIED",
                  "MARITAL_STATUS_SINGLE",
                ],
                enum: ["married", "unmarried", "single"],
              },
              social_category: {
                label: "SOCIAL_CATEGORY",
                type: "string",
                format: "CustomR",
                grid: 2,
                enumNames: [
                  "BENEFICIARY_SOCIAL_STATUS_GENERAL",
                  "BENEFICIARY_SOCIAL_STATUS_SC",
                  "BENEFICIARY_SOCIAL_STATUS_ST",
                  "BENEFICIARY_SOCIAL_STATUS_OBC",
                  "BENEFICIARY_REASONS_FOR_DROPOUT_REASONS_OTHER",
                ],
                enum: ["general", "sc", "st", "obc", "other"],
              },
            },
          }}
        >
          <VStack space={4}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={handleBasicDetails}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              style={{ top: "50px" }}
              onPress={() => handleNextScreen("profile")}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );
  const voluenteerExperience = () => (
    <>
      <VStack flex={3} space={6}>
        <FrontEndTypo.H2 bold color="textMaroonColor.400">
          {t("DO_YOU_HAVE_ANY_VOLUNTEER_EXPERIENCE")}
        </FrontEndTypo.H2>
        <Form
          formData={formDataVolunteerExperience}
          onChange={(e) => setFormDataVolunteerExperience(e.formData)}
          onSubmit={handleVoluenteerExperience}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          uiSchema={uiSchema}
          schema={{
            type: "object",
            required: ["aadharName"],
            properties: {
              volunteer_experience: {
                type: "object",
                title: "DO_YOU_HAVE_ANY_VOLUNTEER_EXPERIENCE",
                properties: {
                  vo_experience: {
                    type: "array",
                    items: {
                      // title: "VOLUNTEER_EXPERIENCE",
                      required: [
                        "role_title",
                        "organization",
                        "experience_in_years",
                      ],
                      properties: {
                        role_title: {
                          title: "VOLUNTEER_TITLE",
                          type: "string",
                        },
                        organization: {
                          title: "COMPANY_AND_ORGANIZATION_NAME",
                          type: "string",
                        },
                        add_description: {
                          title: "THE_ENROLLMENT_DETAILS",
                          type: "string",
                        },

                        experience_in_years: {
                          label: "EXPERIENCE_IN_YEARS",
                          type: "string",
                          format: "CustomR",
                          grid: 5,
                          enumNames: ["<=1", "2", "3", "4", "5+"],
                          enum: ["1", "2", "3", "4", "5"],
                        },

                        related_to_teaching: {
                          label: "IS_THE_JOB_RELATED_TO_TEACHING",
                          type: "string",
                          format: "RadioBtn",
                          enumNames: ["YES", "NO"],
                          enum: ["yes", "no"],
                        },
                        description: {
                          title: "DESCRIPTION",
                          type: "string",
                          // format: "Textarea",
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
        >
          <VStack space={3}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={handleVoluenteerExperience}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              style={{ top: "50px" }}
              onPress={() => handleNextScreen("profile")}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );
  const jobExperience = () => (
    <>
      <VStack flex={3} space={6}>
        <FrontEndTypo.H2 bold color="textMaroonColor.400">
          {t("DO_YOU_HAVE_ANY_JOB_EXPERIENCE")}
        </FrontEndTypo.H2>
        <Form
          formData={formData}
          onSubmit={(data) => setFormData(data.formData)}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          uiSchema={uiSchema}
          schema={{
            type: "object",
            required: ["aadharName"],
            properties: {
              job_experience: {
                title: "DO_YOU_HAVE_ANY_JOB_EXPERIENCE",
                type: "object",
                properties: {
                  experience: {
                    type: "array",
                    items: {
                      title: "EXPERIENCE",
                      required: [
                        "role_title",
                        "organization",
                        "experience_in_years",
                      ],
                      properties: {
                        role_title: {
                          title: "JOB_TITLE",
                          type: "string",
                        },
                        organization: {
                          title: "COMPANY_NAME",
                          type: "string",
                        },
                        description: {
                          title: "DESCRIPTION",
                          type: "string",
                          format: "Textarea",
                          rows: 5,
                        },
                        experience_in_years: {
                          label: "EXPERIENCE_IN_YEARS",
                          type: "string",
                          format: "CustomR",
                          grid: 5,
                          enumNames: ["<=1", "2", "3", "4", "+5"],
                          enum: ["1", "2", "3", "4", "5"],
                        },
                        related_to_teaching: {
                          label: "IS_THE_JOB_RELATED_TO_TEACHING",
                          type: "string",
                          format: "RadioBtn",
                          enumNames: ["YES", "NO"],
                          enum: ["yes", "no"],
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
        >
          <VStack space={3}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={() => handleNextScreen("educationDetails")}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              style={{ top: "50px" }}
              onPress={() => handleNextScreen("profile")}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );
  const educationDetails = () => (
    <>
      <VStack flex={3} space={6}>
        <Form
          formData={formData}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          uiSchema={uiSchema}
          schema={{
            title: "YOUR_HIGHEST_QUALIFICATION",
            type: "object",
            properties: {
              qualification_master_id: {
                type: ["string", "number"],
                format: "CustomR",
                grid: 2,
                enumNames: [
                  "PURSUING_GRADUATION",
                  "GRADUATION",
                  "MASTERS",
                  "PHD",
                  "12TH_GRADE",
                ],
                enum: [
                  "persuing_graduation",
                  "graduation",
                  "masters",
                  "phd",
                  "12th_grade",
                ],
              },
              degree: {
                label: "DO_YOU_HAVE_ANY_TEACHING_DEGREE",
                type: ["string", "number"],
                format: "CustomR",
                grid: 2,
                enumNames: [
                  "NTT",
                  "D.El.Ed",
                  "DROPOUT_REASONS_OTHER",
                  "NO_ONE",
                ],
                enum: ["ntt", "ded", "other", "no"],
              },
            },
          }}
        >
          <VStack space={3}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={() => handleNextScreen("otheDetails")}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              style={{ top: "50px" }}
              onPress={() => handleNextScreen("profile")}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );
  const otheDetails = () => (
    <>
      <VStack flex={3} space={6}>
        <Form
          formData={formData}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          uiSchema={uiSchema}
          schema={{
            title: "YOUR_WORK_AVAILABILITY_WILL_BE",
            type: "object",
            properties: {
              qualification_master_id: {
                type: ["string", "number"],
                format: "CustomR",
                grid: 2,
                enumNames: ["FACILITATOR_PART_TIME", "FACILITATOR_FULL_TIME"],
                enum: ["part_time", "full_time"],
              },
              degree: {
                label: "HOW_DID_YOU_FIND_OUT_ABOUT_PROJECT_PRAGATI",
                type: ["string", "number"],
                format: "CustomR",
                grid: 2,
                enumNames: [
                  "अन्य प्रेरक से",
                  "NGO_REFERRAL",
                  "विज्ञापन",
                  "मैं स्वयं एक पुराना प्रेरक हूं",
                  "DROPOUT_REASONS_OTHER",
                ],
                enum: ["ntt", "ded", "other", "no", ""],
              },
            },
          }}
        >
          <VStack space={3}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={() => handleNextScreen("facilitatorProfilePicture")}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              style={{ top: "50px" }}
              onPress={() => handleNextScreen("profile")}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );
  const facilitatorProfilePicture = () => (
    <>
      <VStack flex={3} space={6}>
        <Form
          formData={formData}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          uiSchema={uiSchema}
          schema={{
            title: "YOUR_WORK_AVAILABILITY_WILL_BE",
            type: "object",
            properties: {
              qualification_master_id: {
                type: ["string", "number"],
                format: "CustomR",
                grid: 2,
                enumNames: ["FACILITATOR_PART_TIME", "FACILITATOR_FULL_TIME"],
                enum: ["part_time", "full_time"],
              },
            },
          }}
        >
          <VStack space={3}>
            <FrontEndTypo.Secondarybutton
              style={{ top: "50px" }}
              onPress={() => handleNextScreen("profile")}
            >
              {t("SAVE_AND_PROFILE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Form>
      </VStack>
    </>
  );
  const renderSwitchCase = () => {
    switch (activeScreenName) {
      case "dateOfBirth":
        return dateOfBirth();
      case "contactDetails":
        return contactDetails();
      case "basicDetails":
        return basicDetails();
      case "voluenteerExperience":
        return voluenteerExperience();
      case "jobExperience":
        return jobExperience();
      case "educationDetails":
        return educationDetails();
      case "otheDetails":
        return otheDetails();
      case "facilitatorProfilePicture":
        return facilitatorProfilePicture();
      default:
        return dateOfBirth();
    }
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        onPressBackButton: (e) => handlePreviousScreen(),
      }}
    >
      <VStack flex={2} padding={3} space={3}>
        <Steper
          type={"circle"}
          steps={[
            { value: "0", label: t("BASIC_DETAILS") },
            { value: "3", label: t("VOLUNTEER_JOB_QUALIFICATION") },
            { value: "6", label: t("OTHER_DETAILS") },
          ]}
          progress={page === "upload" ? 10 : page}
        />
      </VStack>

      <VStack flex={2} padding={3} space={3}>
        {renderSwitchCase()}
      </VStack>
    </Layout>
  );
};

export default FacilitatorOnboarding;
