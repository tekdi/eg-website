import { FrontEndTypo, Layout, t } from "@shiksha/common-lib";
import { Stack, VStack } from "native-base";
import React, { useState, useCallback, useEffect } from "react";
import validator from "@rjsf/validator-ajv8";
import { get, set } from "idb-keyval";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
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

import * as formSchemas from "./onboarding.schema";

import {
  fetchIpUserData,
  selectedIpData,
  getData,
} from "../../../../store/Slices/ipUserInfoSlice";

const {
  dateOfBirthSchema,
  contactDetailsSchema,
  basicDetailsSchema,
  volunteerExperienceSchema,
  jobExperienceSchema,
  educationDetailsSchema,
  otherDetailsSchema,
  profilePictureSchema,
} = formSchemas;

const FacilitatorOnboarding = () => {
  const [activeScreenName, setActiveScreenName] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [page, setPage] = useState(0);
  const [yearsRange, setYearsRange] = useState([1980, 2030]);

  const [date_of_birth, set_date_of_birth] = useState({});

  const [formData, setFormData] = useState({});

  const [formDataContact, setFormDataContact] = useState({});

  const [formDataBasicDetails, setFormDataBasicDetails] = useState({});

  const [formDataVolunteerExperience, setFormDataVolunteerExperience] =
    useState({});

  const [user_data, setUserData] = useState(null);

  const [countLoad, setCountLoad] = useState(0);

  const dispatch = useDispatch();
  const ipData = useSelector(selectedIpData);

  useEffect(() => {
    dispatch(fetchIpUserData());
  }, []);

  console.log("ip-data", ipData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from IndexedDB...");
        let userData = await get("user_data");

        setUserData(userData);

        if (userData?.users?.dob) {
          set_date_of_birth({
            dob: userData.users.dob,
            mobile: userData.users.mobile,
            alternative_mobile_number: userData.users.alternative_mobile_number,
          });
        }

        // if (userData?.users?.mobile) {
        //   setFormDataContact({
        //     mobile: userData.users.mobile,
        //   });
        // }

        if (user_data?.core_faciltator?.device_ownership) {
          setFormDataContact({
            device_ownership: userData.formDataContact.device_ownership,
            device_type: userData.formDataContact.device_type,
          });
        }
        if (userData?.users?.gender) {
          setFormDataBasicDetails({
            gender: userData.users.gender,
            marital_status: userData.extended_users?.marital_status || "",
          });
        }

        setCountLoad(2);
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    setMobileNumber(value);
  };

  const handleNextScreen = (screenName) => {
    setActiveScreenName(screenName);
    setPage(page + 1);
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      navigate(`/offline/profile/${screenName}`);
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

      await set("user_data", updatedUserData);

      setUserData(updatedUserData);
      setPage((prevPage) => prevPage + 1);
      handleNextScreen("contactDetails");
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
  };
  const handleContactDetails = async () => {
    try {
      const updatedUserData = {
        ...user_data,
        users: {
          ...user_data?.users,
          mobile: formDataContact.mobile,
          alternative_mobile_number: formDataContact.alternative_mobile_number,
          email_id: formDataContact.email_id,
        },
        core_faciltator: {
          ...user_data?.core_faciltator,
          device_ownership: formDataContact.device_ownership,
          device_type: formDataContact.device_type,
        },
      };
      await set("user_data", updatedUserData);

      setUserData(updatedUserData);
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
        },
        extended_users: {
          ...user_data?.extended_users,
          marital_status: formDataBasicDetails.marital_status,
          social_category: formDataBasicDetails.social_category,
        },
      };
      await set("user_data", updatedUserData);
      setUserData(updatedUserData);
      setPage((prevPage) => prevPage + 1);
      handleNextScreen("voluenteerExperience");
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
  };

  const handleVolunteerExperience = async () => {
    const propertyNames = [
      "role_title",
      "organization",
      "experience_in_years",
      "related_to_teaching",
      "description",
    ];

    const newExperiences =
      formDataVolunteerExperience?.vo_experience?.vo_experience?.map(
        (entry) => {
          const newExperience = {};
          for (const propName of propertyNames) {
            newExperience[propName] = entry[propName] || "";
          }
          return newExperience;
        }
      ) || [];

    const experienceArray = Array.isArray(user_data.experience)
      ? user_data.experience
      : [];
    console.log(experienceArray, "Experience");
    const updatedUserData = {
      ...user_data,
      experience: [...experienceArray, ...newExperiences],
    };
    console.log(updatedUserData.experience, "After Update");

    await set("user_data", updatedUserData);
    setUserData(updatedUserData);
    setPage((prevPage) => prevPage + 1);
    console.log("hi");
    handleNextScreen("jobExperience");
  };

  useEffect(() => {
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

  const DateOfBirth = React.memo(() => {
    return (
      <VStack flex={3} space={6}>
        <Stack space={3}>
          <Form
            formData={date_of_birth}
            onChange={(e) => set_date_of_birth(e.formData)}
            onSubmit={handleDateOfBirth}
            {...{ templates, FieldTemplate }}
            validator={validator}
            schema={dateOfBirthSchema}
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
    );
  });
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
          schema={contactDetailsSchema}
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
          schema={basicDetailsSchema}
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
          onSubmit={handleVolunteerExperience}
          widgets={{ RadioBtn, CustomR }}
          {...{ templates, FieldTemplate, widgets }}
          validator={validator}
          uiSchema={uiSchema}
          schema={volunteerExperienceSchema}
        >
          <VStack space={3}>
            <FrontEndTypo.Primarybutton
              style={{ background: "#FF0000", top: "50px" }}
              onPress={handleVolunteerExperience}
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
          schema={jobExperienceSchema}
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
          schema={educationDetailsSchema}
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
          schema={otherDetailsSchema}
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
          schema={profilePictureSchema}
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
        return <DateOfBirth />;
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
        return <DateOfBirth />;
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
