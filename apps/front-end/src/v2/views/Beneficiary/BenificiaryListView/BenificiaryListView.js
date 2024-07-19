import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  SelectStyle,
  arrList,
  benificiaryRegistoryService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
  t,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import {
  Box,
  HStack,
  Input,
  Pressable,
  Select,
  VStack,
  Spinner,
} from "native-base";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import { debounce } from "lodash";

const LearnerMessage = ({ program_beneficiaries }) => {
  const [reason, setReason] = useState({});
  useEffect(() => {
    if (
      program_beneficiaries?.enrollment_verification_status ===
      "change_required"
    ) {
      setReason(
        JSON.parse(program_beneficiaries?.enrollment_verification_reason)
      );
    }
  }, []);

  const getTitle = () => {
    if (
      reason?.learner_enrollment_details === "no" &&
      reason?.enrollment_details === "no"
    ) {
      return t("ENROLLMENT_RECEIPT_AND_DETAILS_MISMATCH");
    } else if (reason?.learner_enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_DETAILS");
    } else if (reason?.enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_LEARNER_DETAILS");
    } else {
      return t("FOLLOW_UP_WITH_IP");
    }
  };

  return (
    <HStack color="LearnerListCardLink.500" alignItems="center">
      <FrontEndTypo.H4 color="LearnerListCardLink.500">
        {getTitle()}
      </FrontEndTypo.H4>
    </HStack>
  );
};

const List = ({ data }) => {
  const navigate = useNavigate();

  return (
    <VStack
      space="4"
      p="4"
      alignContent="center"
      // overflowY={"scroll"}
      // h={"50vh"}
      // css={{
      //   "&::-webkit-scrollbar": {
      //     display: "none", // Hide the scrollbar in WebKit browsers
      //   },
      // }}
    >
      {(data && data?.length > 0) || data?.constructor?.name === "Array" ? (
        data &&
        data?.constructor?.name === "Array" &&
        data?.map((item) => (
          <CardComponent
            key={item?.id}
            _body={{ px: "0", py: "2" }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={async () => {
                navigate(`/beneficiary/${item?.id}`);
              }}
              flex={1}
            >
              <VStack
                alignItems="center"
                p="1"
                borderBottomColor={"LeanerListCardIDBorder.500"}
                borderStyle={"dotted"}
                borderBottomWidth={"1px"}
              >
                <Clipboard text={item?.id}>
                  <FrontEndTypo.H4
                    color="floatingLabelColor.500"
                    fontWeight={"600"}
                  >
                    {item?.id}
                  </FrontEndTypo.H4>
                </Clipboard>
              </VStack>
              <HStack pt={2} px={3} justifyContent="space-between" space={1}>
                <HStack alignItems="Center" flex={[1, 2, 4]}>
                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {[
                      "enrolled_ip_verified",
                      "registered_in_camp",
                      "ineligible_for_pragati_camp",
                      "10th_passed",
                      "pragati_syc",
                    ].includes(item?.program_beneficiaries?.status) ? (
                      <FrontEndTypo.H3 bold color="textGreyColor.800">
                        {item?.program_beneficiaries?.enrollment_first_name}
                        {item?.program_beneficiaries?.enrollment_middle_name &&
                          item?.program_beneficiaries
                            ?.enrollment_middle_name !== "null" &&
                          ` ${item?.program_beneficiaries?.enrollment_middle_name}`}
                        {item?.program_beneficiaries?.enrollment_last_name &&
                          item?.program_beneficiaries?.enrollment_last_name !==
                            "null" &&
                          ` ${item?.program_beneficiaries?.enrollment_last_name}`}
                      </FrontEndTypo.H3>
                    ) : (
                      <FrontEndTypo.H4 fontWeight={"600"} color="grayTitleCard">
                        {item?.first_name}
                        {item?.middle_name &&
                          item?.middle_name !== "null" &&
                          ` ${item.middle_name}`}
                        {item?.last_name &&
                          item?.last_name !== "null" &&
                          ` ${item.last_name}`}
                      </FrontEndTypo.H4>
                    )}

                    <FrontEndTypo.H5 color="LearnerListCardNumber.500">
                      {item?.mobile}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <VStack alignItems="end" flex={[1]}>
                  <ChipStatus
                    w="fit-content"
                    status={item?.program_beneficiaries?.status}
                    is_duplicate={item?.is_duplicate}
                    is_deactivated={item?.is_deactivated}
                    rounded={"sm"}
                  />
                </VStack>
              </HStack>
            </Pressable>
            <VStack px={2} bg="white" alignItems={"end"}>
              {item?.program_beneficiaries?.status === "identified" && (
                <Pressable
                  onPress={() => {
                    navigate(`/beneficiary/${item?.id}/docschecklist`);
                  }}
                >
                  <HStack color="LearnerListCardLink.500" alignItems="center">
                    <FrontEndTypo.H4 color="LearnerListCardLink.500">
                      {t("COMPLETE_THE_DOCUMENTATION")}
                    </FrontEndTypo.H4>
                    <IconByName
                      color="LearnerListCardLink.500"
                      name="ArrowRightSLineIcon"
                      py="0"
                    />
                  </HStack>
                </Pressable>
              )}
              {item?.program_beneficiaries?.status === "enrollment_pending" && (
                <Pressable
                  onPress={() => {
                    navigate(`/beneficiary/${item?.id}/docschecklist`);
                  }}
                >
                  <HStack color="LearnerListCardLink.500" alignItems="center">
                    <FrontEndTypo.H4 color="blueText.450">
                      {t("CONTINUE_ENROLLMENT")}
                    </FrontEndTypo.H4>
                    <IconByName name="ArrowRightSLineIcon" />
                  </HStack>
                </Pressable>
              )}
              {item?.program_beneficiaries?.status === "ready_to_enroll" && (
                <Pressable
                  onPress={() => {
                    navigate(`/beneficiary/${item?.id}/enrollmentdetails`);
                  }}
                >
                  <HStack color="LearnerListCardLink.500" alignItems="center">
                    <FrontEndTypo.H4 color="blueText.450">
                      {t("ENTER_THE_ENROLLMENT_DETAILS")}
                    </FrontEndTypo.H4>
                    <IconByName name="ArrowRightSLineIcon" />
                  </HStack>
                </Pressable>
              )}
              {["duplicated", "enrolled_ip_verified"]?.includes(
                item?.program_beneficiaries?.status
              ) && (
                <HStack
                  color="LearnerListCardLink.500"
                  alignItems="center"
                  mb="2"
                >
                  <FrontEndTypo.H4 color="blueText.450">
                    {item?.program_beneficiaries?.status === "duplicated"
                      ? t("FOLLOW_UP_WITH_IP_ASSIGNMENT")
                      : t("TO_BE_REGISTERED_IN_CAMP")}
                  </FrontEndTypo.H4>
                </HStack>
              )}
              {item?.program_beneficiaries?.status === "enrolled" && (
                <LearnerMessage
                  program_beneficiaries={item?.program_beneficiaries}
                />
              )}
            </VStack>
          </CardComponent>
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </VStack>
  );
};
const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

const styles = {
  inforBox: {
    style: {
      background: "textMaroonColor.50",
    },
  },
};

export default function BenificiaryListView({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ limit: 6 });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const refButton = useRef(null);

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
              data?.attendances?.filter(
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
  const prerak_status = localStorage.getItem("status");

  useEffect(async () => {
    const data = await benificiaryRegistoryService.getStatusList();
    if (data.length > 0) {
      setSelectStatus(data);
    }
  }, []);

  useEffect(() => {
    if (
      ref?.current?.clientHeight >= 0 &&
      refButton?.current?.clientHeight >= 0 &&
      bodyHeight >= 0
    ) {
      setLoadingHeight(
        bodyHeight -
          ref?.current?.clientHeight -
          refButton?.current?.clientHeight
      );
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  useEffect(async () => {
    const { search } = filter;
    setSearch(search);
    if (filter?.page < 2) {
      setLoadingList(true);
    }
    const { currentPage, totalPages, error, ...result } =
      await benificiaryRegistoryService.getBeneficiariesList(filter);
    if (!error) {
      setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
      if (filter?.page > 1) {
        setData([...data, ...(result.data || [])]);
      } else {
        setData(result.data || []);
      }
    } else {
      setData([]);
    }
    setLoadingList(false);
  }, [filter]);

  useEffect(async () => {
    if (userTokenInfo) {
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setFilter({ ...filter, search: value, page: 1 });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), []);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn", "langBtn"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({ ...filter, search: value, page: 1 });
        },
        _box: { bg: "white", shadow: "appBarShadow" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY_LIST"}
      pageTitle={t("BENEFICIARY_LIST")}
    >
      <VStack ref={ref}>
        <FrontEndTypo.H1 fontWeight="600" mx="4" my="6" mb="0">
          {t("LEARNER_LIST")}
        </FrontEndTypo.H1>
        <HStack space={2} padding={4}>
          <Input
            value={search}
            width={"100%"}
            borderColor={"gray.300"}
            placeholder={t("SEARCH_BY_NAME")}
            onChangeText={debouncedHandleSearch}
            InputRightElement={
              <IconByName color="grayTitleCard" name="SearchLineIcon" mr="2" />
            }
          />
        </HStack>

        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="Center"
          p="4"
        >
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              dropdownIcon={
                <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
              }
              selectedValue={filter?.status}
              placeholder={t("STATUS_ALL")}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, status: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <IconByName name="ArrowDownSLineIcon" />,
              }}
              accessibilityLabel="Select a position for Menu"
            >
              <Select.Item key={0} label={t("BENEFICIARY_ALL")} value={""} />
              {Array.isArray(selectStatus) &&
                selectStatus.map((option, index) => (
                  <Select.Item
                    key={index || ""}
                    label={t(option.title)}
                    value={option.value}
                  />
                ))}
            </SelectStyle>
          </Box>
          <Box flex="2">
            <SelectStyle
              dropdownIcon={
                <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
              }
              overflowX="hidden"
              selectedValue={filter?.sortType ? filter?.sortType : ""}
              placeholder={t("SORT_BY")}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, sortType: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "secondary.700",
              }}
              accessibilityLabel="Select a position for Menu"
            >
              {select2.map((option, index) => (
                <Select.Item
                  key={index || ""}
                  label={t(option.label)}
                  value={option.value}
                  p="5"
                />
              ))}
            </SelectStyle>
          </Box>
        </HStack>
      </VStack>

      {!loadingList ? (
        <InfiniteScroll
          dataLength={data?.length}
          next={(e) =>
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            })
          }
          hasMore={hasMore}
          height={loadingHeight}
          loader={
            <Spinner
              accessibilityLabel="Loading posts"
              color="bgRed.500"
              size="lg"
            />
          }
          endMessage={
            <FrontEndTypo.H3
              fontWeight={"600"}
              display="inherit"
              textAlign="center"
            >
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          // below props only if you need pull down functionality
          pullDownToRefreshThreshold={50}
        >
          <List data={data} />
        </InfiniteScroll>
      ) : (
        <Spinner
          accessibilityLabel="Loading posts"
          color="bgRed.500"
          size="lg"
        />
      )}

      <HStack
        ref={refButton}
        width={"100%"}
        bg={"white"}
        flex={1}
        safeAreaTop
        position="fixed"
        bottom="70px"
        zIndex={"9999999"}
      >
        <FrontEndTypo.Secondarybutton
          onPress={(e) => {
            if (
              [
                "pragati_mobilizer",
                "selected_prerak",
                "selected_for_training",
                "selected_for_onboarding",
              ].includes(facilitator.status)
            ) {
              navigate(`/beneficiary`);
            } else {
              navigate("/beneficiary");
            }
          }}
          mx="auto"
          my="2"
        >
          {t("ADD_MORE_AG")}
        </FrontEndTypo.Secondarybutton>
      </HStack>
    </Layout>
  );
}

BenificiaryListView.PropTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
