import React, { useState, useEffect } from "react";
import { HStack, VStack } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  benificiaryRegistoryService,
  t,
  Layout,
  enumRegistryService,
  GetEnumValue,
  CardComponent,
  getSelectedProgramId,
  setSelectedProgramId,
  getOnboardingMobile,
  setSelectedAcademicYear,
  facilitatorRegistryService,
  objProps,
  arrList,
  ImageView,
} from "@shiksha/common-lib";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import ProfilePhoto from "../../Functional/ProfilePhoto/ProfilePhoto";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import FilePreview from "v2/components/Static/FilePreview/FilePreview";

export default function BenificiaryBasicDetails(userTokenInfo) {
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [requestData, setRequestData] = React.useState([]);
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

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const resultData = await benificiaryRegistoryService.getEditRequest(obj);
    if (resultData?.data?.length > 0) {
      const fieldData = JSON.parse(resultData?.data?.[0]?.fields);
      setRequestData(fieldData);
    }
  }, []);

  const edit = `/beneficiary/${benificiary?.id}/upload/1`;

  const isFamilyDetailsEdit = () => {
    const data = requestData.filter((e) =>
      [
        "father_first_name",
        "father_middle_name",
        "father_last_name",
        "mother_first_name",
        "mother_middle_name",
        "mother_last_name",
      ].includes(e)
    );
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        data.length > 0)
    );
  };
  const isPersonalDetailsEdit = () => {
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        requestData.filter((e) =>
          ["social_category", "marital_status"].includes(e)
        ).length > 0)
    );
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

  return (
    <Layout
      _appBar={{
        name: t("BASIC_DETAILS"),
        onPressBackButton,
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      analyticsPageTitle={"BENEFICIARY_BASIC_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("BASIC_DETAILS")}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <FrontEndTypo.H1 fontWeight="600" mx="4" mt="6">
          {t("BASIC_DETAILS")}
        </FrontEndTypo.H1>
        <VStack px="16px" space="24px">
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            space={4}
          >
            <HStack space={4} alignItems={"center"}>
              {/* <VStack>
                <ProfilePhoto
                  isProfileEdit={true}
                  editLink={edit}
                  profile_photo_1={benificiary?.profile_photo_1}
                  profile_photo_2={benificiary?.profile_photo_2}
                  profile_photo_3={benificiary?.profile_photo_3}
                />
              </VStack> */}
              <HStack alignContent={"center"} alignItems={"center"} space={2}>
                {benificiary?.profile_photo_1?.id ? (
                  <ImageView
                    source={{
                      document_id: benificiary?.profile_photo_1?.id,
                    }}
                    width={"64px"}
                    height={"64px"}
                    borderRadius="50%"
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name="AccountCircleLineIcon"
                    color="gray.300"
                    _icon={{ size: "120px" }}
                  />
                )}

                <IconByName
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={() => navigate(`/beneficiary/${id}/upload/1`)}
                />
              </HStack>
              <VStack>
                <HStack justifyContent="space-between" alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.750" bold>
                    {benificiary?.first_name ? benificiary?.first_name : "-"}
                    &nbsp;
                    {benificiary?.middle_name?.trim() === "null"
                      ? ""
                      : benificiary?.middle_name}
                    &nbsp;
                    {benificiary?.last_name == "null"
                      ? ""
                      : benificiary?.last_name}
                  </FrontEndTypo.H3>
                  {/* {benificiary?.program_beneficiaries?.status ===
                  "enrolled_ip_verified" ? (
                    <></>
                  ) : (
                    <IconByName
                      name="PencilLineIcon"
                      color="iconColor.200"
                      _icon={{ size: "20" }}
                      onPress={(e) => {
                        navigate(`/beneficiary/edit/${id}/basic-info`);
                      }}
                    />
                  )} */}
                </HStack>
                <HStack alignItems="Center">
                  {/* <IconByName name="Cake2LineIcon" color="iconColor.300" /> */}
                  <FrontEndTypo.H3 color="textGreyColor.750" fontWeight="500">
                    {moment(benificiary?.dob).format("DD/MM/YYYY")
                      ? moment(benificiary?.dob).format("DD/MM/YYYY")
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <IconByName
                name="PencilLineIcon"
                color="iconColor.200"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/basic-info`);
                }}
              />
            </HStack>
          </HStack>
          {benificiary?.profile_photo_1?.id && (
            <HStack justifyContent="space-between">
              <HStack alignItems="center" space="6">
                {[
                  benificiary?.profile_photo_1,
                  benificiary?.profile_photo_2,
                  benificiary?.profile_photo_3,
                ].map(
                  (photo) =>
                    photo?.id && (
                      <ImageView
                        key={photo?.id}
                        source={{
                          document_id: photo?.id,
                        }}
                        width={"36px"}
                        height={"36px"}
                        borderRadius="50%"
                      />
                    )
                )}
              </HStack>
              <HStack>
                <IconByName
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={() => navigate(`/beneficiary/${id}/upload/1`)}
                />
              </HStack>
            </HStack>
          )}
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("CONTACT_DETAILS")}
            label={[
              "MOBILE_NUMBER",
              "MARK_AS_WHATSAPP_REGISTER",
              "TYPE_OF_MOBILE_PHONE",
              "MARK_OWNERSHIP",
              "ALTERNATIVE_NUMBER",
              "EMAIL",
            ]}
            item={{
              ...benificiary,
              mark_as_whatsapp_number:
                benificiary?.core_beneficiaries?.mark_as_whatsapp_number,

              device_type: benificiary?.core_beneficiaries?.device_type,
              device_ownership:
                benificiary?.core_beneficiaries?.device_ownership,
            }}
            arr={[
              "mobile",
              "mark_as_whatsapp_number",
              "device_type",
              "device_ownership",
              "alternative_mobile_number",
              "email_id",
            ]}
            onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("FAMILY_DETAILS")}
            label={["FATHER", "MOTHER"]}
            item={benificiary?.core_beneficiaries}
            arr={["father_first_name", "mother_first_name"]}
            onEdit={
              isFamilyDetailsEdit()
                ? (e) => navigate(`/beneficiary/edit/${id}/family-details`)
                : false
            }
          />

          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("PERSONAL_DETAILS")}
            label={["SOCIAL", "MARITAL"]}
            item={{
              ...benificiary?.extended_users,
              marital_status: benificiary?.extended_users?.marital_status ? (
                <GetEnumValue
                  t={t}
                  enumType={"MARITAL_STATUS"}
                  enumOptionValue={benificiary?.extended_users?.marital_status}
                  enumApiData={enumOptions}
                />
              ) : (
                "-"
              ),
              social_category: benificiary?.extended_users?.social_category ? (
                <GetEnumValue
                  t={t}
                  enumType={"BENEFICIARY_SOCIAL_STATUS"}
                  enumOptionValue={benificiary?.extended_users?.social_category}
                  enumApiData={enumOptions}
                />
              ) : (
                "-"
              ),
            }}
            arr={["social_category", "marital_status"]}
            onEdit={
              isPersonalDetailsEdit()
                ? (e) => navigate(`/beneficiary/edit/${id}/personal-details`)
                : false
            }
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("REFERENCE_DETAILS")}
            label={["NAME", "RELATION", "CONTACT"]}
            item={benificiary?.references[0]}
            arr={["first_name", "relation", "contact_number"]}
            onEdit={(e) =>
              navigate(`/beneficiary/edit/${id}/reference-details`)
            }
          />
        </VStack>
      </VStack>
    </Layout>
  );
}
