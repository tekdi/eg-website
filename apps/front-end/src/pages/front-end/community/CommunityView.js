import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  CardComponent,
  CustomAlert,
  FrontEndTypo,
  GetEnumValue,
  Layout,
  arrList,
  benificiaryRegistoryService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getOptions,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import { templates, widgets } from "component/BaseInput";
import { Box, VStack } from "native-base";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import schema1 from "./schema";
import { useNavigate } from "react-router-dom";
export default function CommunityView({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [schema, setSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [addMore, setAddMore] = useState();
  const [data, setData] = useState({});
  const [enumOptions, setEnumOptions] = useState({});
  const formRef = useRef();
  const navigate = useNavigate();

  // PROFILE DATA IMPORTS
  const [facilitator, setFacilitator] = useState({ notLoaded: true });
  const fa_id = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [countLoad, setCountLoad] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cohortData, setCohortData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [isUserRegisterExist, setIsUserRegisterExist] = useState(false);
  const [selectedCohortData, setSelectedCohortData] = useState(null);
  const [selectedProgramData, setSelectedProgramData] = useState(null);
  const [selectCohortForm, setSelectCohortForm] = useState(false);
  const [academicYear, setAcademicYear] = useState(null);
  const [academicData, setAcademicData] = useState([]);
  const [isTodayAttendace, setIsTodayAttendace] = useState();
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );

  useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    setEnumOptions(qData?.data ? qData?.data : {});
    const data = qData?.data?.COMMUNITY_MEMBER_DESIGNATIONS;
    let newSchema = schema1;
    if (schema1["properties"]) {
      newSchema = getOptions(newSchema, {
        key: "designation",
        arr: data,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }
  }, []);

  useEffect(async () => {
    const getData = await benificiaryRegistoryService.getCommunityReferences({
      context: "community.user",
    });
    const community_response = getData?.data?.community_response;
    setData(community_response);
  }, []);

  const onChange = async (e, id) => {
    const data = e.formData;
    const newData = { ...formData, ...data };
    if (id === "root_contact_number") {
      if (newData?.contact_number?.length !== 10) {
        const newErrors = {
          contact_number: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      } else {
        setErrors();
      }
    }
    setFormData(newData);
  };

  const transformErrors = (errors) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      }
      return error;
    });
  };

  const saveDataToIndexedDB = async () => {
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    try {
      const [ListOfEnum, qualification, editRequest] = await Promise.all([
        enumRegistryService.listOfEnum(),
        enumRegistryService.getQualificationAll(),
        facilitatorRegistryService.getEditRequests(obj),
        // enumRegistryService.userInfo(),
      ]);
      const currentTime = moment().toString();
      await Promise.all([
        setIndexedDBItem("enums", ListOfEnum.data),
        setIndexedDBItem("qualification", qualification),
        setIndexedDBItem("lastFetchTime", currentTime),
        setIndexedDBItem("editRequest", editRequest),
      ]);
    } catch (error) {
      console.error("Error saving data to IndexedDB:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // ...async operation
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
        //do page load first operation
        //get user info
        if (userTokenInfo) {
          const IpUserInfo = await getIpUserInfo(fa_id);
          let ipUserData = IpUserInfo;
          if (isOnline && !IpUserInfo) {
            ipUserData = await setIpUserInfo(fa_id);
          }

          setFacilitator(ipUserData);
        }
        setLoading(false);
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

  useEffect(() => {
    const fetchdata = async () => {
      const programId = await getSelectedProgramId();
      if (programId) {
        try {
          const c_data =
            await facilitatorRegistryService.getPrerakCertificateDetails({
              id: fa_id,
            });
          const data =
            c_data?.data?.filter(
              (eventItem) =>
                eventItem?.params?.do_id?.length &&
                eventItem?.lms_test_tracking?.length < 1
            )?.[0] || {};
          if (data) {
            setIsTodayAttendace(
              data?.attendances.filter(
                (attendance) =>
                  attendance.user_id == fa_id &&
                  attendance.status == "present" &&
                  data.end_date ==
                    moment(attendance.date_time).format("YYYY-MM-DD")
              )
            );

            setCertificateData(data);
            if (data?.lms_test_tracking?.length > 0) {
              setLmsDetails(data?.lms_test_tracking?.[0]);
            }
            const dataDay = moment.utc(data?.end_date).isSame(moment(), "day");
            const format = "HH:mm:ss";
            const time = moment(moment().format(format), format);
            const beforeTime = moment.utc(data?.start_time, format).local();
            const afterTime = moment.utc(data?.end_time, format).local();
            if (time?.isBetween(beforeTime, afterTime) && dataDay) {
              setIsEventActive(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchdata();
  }, [selectedCohortData]);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (academicYear != null) {
        //get cohort id and store in localstorage
        const user_cohort_id = academicYear;
        const cohort_data = await facilitatorRegistryService.getCohort({
          cohortId: user_cohort_id,
        });
        setSelectedCohortData(cohort_data);
        await setSelectedAcademicYear(cohort_data);
      }
    }
    fetchData();
  }, [academicYear]);

  useEffect(() => {
    async function fetchData() {
      if (!facilitator?.notLoaded === true) {
        // ...async operations
        const res = objProps(facilitator);
        setProgress(
          arrList(
            {
              ...res,
              qua_name: facilitator?.qualifications?.qualification_master?.name,
            },
            [
              "device_ownership",
              "mobile",
              "device_type",
              "gender",
              "marital_status",
              "social_category",
              "name",
              "contact_number",
              "availability",
              "aadhar_no",
              "aadhaar_verification_mode",
              "aadhar_verified",
              "qualification_ids",
              "qua_name",
            ]
          )
        );
        //check exist user registered
        try {
          let onboardingURLData = await getOnboardingURLData();
          setCohortData(onboardingURLData?.cohortData);
          setProgramData(onboardingURLData?.programData);
          //get program id and store in localstorage

          const user_program_id = facilitator?.program_faciltators?.program_id;
          const program_data = await facilitatorRegistryService.getProgram({
            programId: user_program_id,
          });
          setSelectedProgramData(program_data[0]);
          await setSelectedProgramId(program_data[0]);
          //check mobile number with localstorage mobile no
          let mobile_no = facilitator?.mobile;
          let mobile_no_onboarding = await getOnboardingMobile();
          if (
            mobile_no != null &&
            mobile_no_onboarding != null &&
            mobile_no == mobile_no_onboarding &&
            onboardingURLData?.cohortData
          ) {
            //get cohort id and store in localstorage
            const user_cohort_id =
              onboardingURLData?.cohortData?.academic_year_id;
            const cohort_data = await facilitatorRegistryService.getCohort({
              cohortId: user_cohort_id,
            });
            setSelectedCohortData(cohort_data);
            await setSelectedAcademicYear(cohort_data);
            localStorage.setItem("loadCohort", "yes");
            setIsUserRegisterExist(true);
          } else {
            setIsUserRegisterExist(false);
            await showSelectCohort();
          }
        } catch (e) {}
      }
    }
    fetchData();
  }, [facilitator]);

  const showSelectCohort = async () => {
    let loadCohort = null;
    try {
      loadCohort = localStorage.getItem("loadCohort");
    } catch (e) {}
    if (loadCohort == null || loadCohort == "no") {
      const user_cohort_list =
        await facilitatorRegistryService.GetFacilatorCohortList();
      let stored_response = await setSelectedAcademicYear(
        user_cohort_list?.data[0]
      );
      setAcademicData(user_cohort_list?.data);
      setAcademicYear(user_cohort_list?.data[0]?.academic_year_id);
      localStorage.setItem("loadCohort", "yes");
      if (user_cohort_list?.data.length == 1) {
        setSelectCohortForm(false);
        await checkDataToIndex();
        await checkUserToIndex();
      } else {
        setSelectCohortForm(true);
      }
    }
  };
  const checkDataToIndex = async () => {
    // Online Data Fetch Time Interval
    const timeInterval = 30;
    const enums = await getIndexedDBItem("enums");
    const qualification = await getIndexedDBItem("qualification");
    const lastFetchTime = await getIndexedDBItem("lastFetchTime");
    const editRequest = await getIndexedDBItem("editRequest");
    let timeExpired = false;
    if (lastFetchTime) {
      const timeDiff = moment
        .duration(moment().diff(lastFetchTime))
        .asMinutes();
      if (timeDiff >= timeInterval) {
        timeExpired = true;
      }
    }
    if (
      isOnline &&
      (!enums ||
        !qualification ||
        !editRequest ||
        timeExpired ||
        !lastFetchTime ||
        editRequest?.status === 400)
    ) {
      await saveDataToIndexedDB();
    }
  };

  const onAdd = () => {
    setFormData();
    setAddMore(true);
  };
  const onSubmit = async () => {
    const result = await benificiaryRegistoryService.createCommunityReference(
      formData
    );
    if (result?.message === "Mobile number already exists") {
      const newErrors = {
        contact_number: {
          __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
        },
      };
      setErrors(newErrors);
    } else {
      setAddMore(false);
    }
    if (result?.success === true) {
      window?.location?.reload(true);
    }
  };

  const onPressBackButton = () => {
    navigate("/");
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["userInfo", "loginBtn", "langBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"COMMUNITY_REFRENCE"}
      pageTitle={t("COMMUNITY_REFRENCE")}
    >
      <Box p="4">
        {!addMore ||
          (data?.length <= 2 && (
            <CustomAlert
              _hstack={{ mb: 9 }}
              status={"customAlertdanger"}
              title={t("COMMUNITY_ALERT_MESSAGE")}
            />
          ))}
        {!addMore ? (
          <VStack paddingTop="4" space="4">
            <FrontEndTypo.H3 color="textGreyColor.750" bold>
              {t("COMMUNITY_DETAILS")}
            </FrontEndTypo.H3>
            {data?.length > 0 &&
              data
                ?.slice()
                .reverse()
                .map((item, index) => {
                  return (
                    <CardComponent
                      key={item?.id}
                      title={`${index + 1}. ${t("MEMBER_DETAILS")}`}
                      item={{
                        ...item,
                        designation: item?.designation ? (
                          <GetEnumValue
                            t={t}
                            enumType={"COMMUNITY_MEMBER_DESIGNATIONS"}
                            enumOptionValue={item?.designation}
                            enumApiData={enumOptions}
                          />
                        ) : (
                          "-"
                        ),
                      }}
                      label={[
                        "FIRST_NAME",
                        "MIDDLE_NAME",
                        "LAST_NAME",
                        "DESIGNATION",
                        "CONTACT_NUMBER",
                      ]}
                      arr={[
                        "first_name",
                        "middle_name",
                        "last_name",
                        "designation",
                        "contact_number",
                      ]}
                    />
                  );
                })}
            {data?.length < 10 && (
              <FrontEndTypo.Primarybutton mt="6" onPress={onAdd}>
                {t("ADD_COMMUNITY_MEMBER")}
              </FrontEndTypo.Primarybutton>
            )}
          </VStack>
        ) : (
          <Form
            key={schema}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              templates,
              widgets,
              schema: schema || {},
              formData,
              onChange,
              onSubmit,
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              p="4"
              mt="4"
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("ADD_MEMBER")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              p="4"
              mt="4"
              onPress={() => setAddMore()}
            >
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
          </Form>
        )}
      </Box>
    </Layout>
  );
}

CommunityView.PropTypes = {
  footerLinks: PropTypes.any,
};
