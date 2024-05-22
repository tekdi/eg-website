import {
  AdminTypo,
  BodyMedium,
  CardComponent,
  FrontEndTypo,
  IconByName,
  ImageView,
  Layout,
  arrList,
  campService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import {
  Alert,
  Box,
  Checkbox,
  HStack,
  Modal,
  Pressable,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import { useTranslation } from "react-i18next";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

// App
export default function CampSelectedLearners(userTokenInfo) {
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState(false);
  const camp_id = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nonRegisteredUser, setNonRegisteredUser] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [registeredId, setRegisteredId] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [canSelectUsers, setCanSelectUsers] = React.useState([]);
  const [nonRegister, setNonRegister] = React.useState([]);
  const [selectAllChecked, setSelectAllChecked] = React.useState(false);

  // PROFILE DATA IMPORTS
  const [facilitator, setFacilitator] = useState({ notLoaded: true });
  const fa_id = localStorage.getItem("id");
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
    navigate(`/camps/${camp_id?.id}`);
  };

  const handleCheckboxChange = (id) => {
    setRegisteredId(id);
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleSelectAllChange = (e) => {
    setSelectAllChecked(e);
    if (!e) {
      setSelectedIds([]);
    } else {
      const newSelectedIds = nonRegisteredUser
        ?.filter((item) => !canSelectUsers.some((user) => user.id === item.id))
        .map((item) => item.id);
      setSelectedIds(newSelectedIds);
    }
  };

  const updateLearner = async () => {
    setIsDisable(true);
    if (selectedIds?.length !== 0) {
      setIsDisable(true);
      const updateLearner = {
        learner_ids: selectedIds,
        edit_page_type: "edit_learners",
        id: camp_id?.id,
      };

      const data = await campService.updateCampDetails(updateLearner);
      if (data) {
        navigate(`/camps/${camp_id?.id}`);
      }
    } else {
      setIsDisable(false);
      setAlert(true);
    }
  };

  React.useEffect(async () => {
    const result = await campService.campNonRegisteredUser();
    const campdetails = await campService.getCampDetails(camp_id);
    let users = [];
    if (
      ["registered", "camp_ip_verified"].includes(
        campdetails?.data?.group?.status
      )
    ) {
      users = campdetails?.data?.group_users || [];
      setCanSelectUsers(users);
    }
    const campNotRegisterUsers = result?.data?.user || [];
    const nonRegister = result?.data?.user || [];
    setNonRegister(nonRegister);
    const mergedData =
      campdetails?.data?.group_users?.concat(campNotRegisterUsers);
    setNonRegisteredUser(mergedData);
    const ids = campdetails?.data?.group_users?.map((item) => item.id);
    setSelectedIds(ids);
    setLoading(false);
    const selectAllChecked =
      selectedIds?.length ===
      nonRegisteredUser?.filter(
        (item) => !registeredUsers.some((user) => user.id === item.id)
      ).length;
    setSelectAllChecked(selectAllChecked);
  }, []);

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
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("LEARNERS_IN_CAMP"),
        onPressBackButton,
        _box: { bg: "white" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
    >
      <Box py={6} px={4} mb={5}>
        <AdminTypo.H3 color={"textMaroonColor.400"}>
          {alert && (
            <Alert
              status="warning"
              alignItems={"start"}
              mb="3"
              mt="4"
              width={"100%"}
            >
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t("SELECT_LEARNER")}</BodyMedium>
              </HStack>
            </Alert>
          )}
        </AdminTypo.H3>
        {nonRegister?.length > 0 && (
          <HStack
            space={2}
            paddingRight={2}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            {t("SELECT_ALL")}
            <Checkbox
              isChecked={selectAllChecked}
              onChange={handleSelectAllChange}
              colorScheme="danger"
            />
          </HStack>
        )}

        {nonRegisteredUser?.map((item) => {
          return (
            <CardComponent
              _header={{ bg: "white" }}
              _vstack={{
                bg: "white",
                m: "2",
              }}
              key={item}
            >
              <HStack
                w={"100%"}
                bg="white"
                my={1}
                rounded="sm"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack justifyContent="space-between">
                  <HStack alignItems="Center" flex="5">
                    <Pressable onPress={() => setModalVisible(item)}>
                      {item?.profile_photo_1?.id ? (
                        <ImageView
                          source={{
                            uri: item?.profile_photo_1?.name,
                          }}
                          // alt="Alternate Text"
                          width={"45px"}
                          height={"45px"}
                        />
                      ) : (
                        <IconByName
                          isDisabled
                          name="AccountCircleLineIcon"
                          color="gray.300"
                          _icon={{ size: "51px" }}
                        />
                      )}
                    </Pressable>
                    <VStack
                      pl="2"
                      flex="1"
                      wordWrap="break-word"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <FrontEndTypo.H3 bold color="textGreyColor.800">
                        {item?.program_beneficiaries[0]?.enrollment_first_name}
                        {item?.program_beneficiaries[0]
                          ?.enrollment_middle_name &&
                          ` ${item?.program_beneficiaries[0]?.enrollment_middle_name}`}
                        {item?.program_beneficiaries[0]?.enrollment_last_name &&
                          ` ${item?.program_beneficiaries[0]?.enrollment_last_name}`}
                      </FrontEndTypo.H3>
                      <FrontEndTypo.H4>{item?.district}</FrontEndTypo.H4>
                      <FrontEndTypo.H4>{item?.block}</FrontEndTypo.H4>
                      <FrontEndTypo.H4>{item?.village}</FrontEndTypo.H4>
                    </VStack>
                  </HStack>
                </HStack>

                <Box maxW="121px">
                  {!canSelectUsers.find((e) => e?.id === item?.id)?.id && (
                    <Checkbox
                      isChecked={selectedIds.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      colorScheme="danger"
                    />
                  )}
                </Box>
              </HStack>
            </CardComponent>
          );
        })}
        <FrontEndTypo.Primarybutton
          isDisabled={isDisable}
          onPress={updateLearner}
        >
          {t("SAVE_AND_CAMP_PROFILE")}
        </FrontEndTypo.Primarybutton>
      </Box>
      <Modal isOpen={modalVisible} avoidKeyboard size="xl">
        <Modal.Content>
          <Modal.Header textAlign={"Center"}>{t("PROFILE")}</Modal.Header>
          <Modal.Body>
            <VStack alignItems={"center"}>
              {modalVisible?.profile_photo_1?.id ? (
                <ImageView
                  source={{
                    uri: modalVisible?.profile_photo_1?.name,
                  }}
                  // alt="Alternate Text"
                  width={"60px"}
                  height={"60px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="gray.300"
                  _icon={{ size: "60px" }}
                />
              )}

              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {
                  modalVisible?.program_beneficiaries?.[0]
                    ?.enrollment_first_name
                }
                {modalVisible?.program_beneficiaries?.[0]
                  ?.enrollment_middle_name &&
                  ` ${modalVisible?.program_beneficiaries?.[0]?.enrollment_middle_name}`}
                {modalVisible?.program_beneficiaries?.[0]
                  ?.enrollment_last_name &&
                  ` ${modalVisible?.program_beneficiaries?.[0]?.enrollment_last_name}`}
              </FrontEndTypo.H3>
              <Chip children={modalVisible?.id} />
              <ChipStatus
                is_duplicate={
                  modalVisible?.program_beneficiaries?.[0]?.is_duplicate
                }
                is_deactivated={
                  modalVisible?.program_beneficiaries?.[0]?.is_deactivated
                }
                status={modalVisible?.program_beneficiaries?.[0]?.status}
                rounded={"sm"}
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <HStack
              // height={"80%"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <FrontEndTypo.Secondarybutton
                onPress={() => setModalVisible(false)}
              >
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton
                onPress={() => navigate(`/beneficiary/${modalVisible?.id}`)}
              >
                {t("VIEW_PROFILE")}
              </FrontEndTypo.Primarybutton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
