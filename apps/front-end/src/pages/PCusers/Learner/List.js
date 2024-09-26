import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  PcuserService,
  SelectStyle,
  benificiaryRegistoryService,
  jsonParse,
} from "@shiksha/common-lib";
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Modal,
  Select,
  Spinner,
  Stack,
  VStack,
} from "native-base";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { List } from "./LearnerListView";

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function LearnerList({ userTokenInfo }) {
  const [filter, setFilter] = useState({});
  const [selectStatus, setSelectStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prerakList, setPrerakList] = useState();
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [beneficiary, setBeneficiary] = useState(true);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(bodyHeight - ref?.current?.clientHeight);
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const status = await benificiaryRegistoryService.getStatusList();
        setSelectStatus(status);
        const result = await PcuserService.getPrerakList({
          ...filter,
          limit: 100,
        });
        const apiData = transformData(result?.facilitator_data);
        setPrerakList(apiData);
        const getSelectedPrerakList = jsonParse(
          localStorage.getItem("pc_user_prerak_filter_for_leaner"),
          [],
        );
        if (getSelectedPrerakList?.length > 0) {
          const filteredUsers = apiData?.filter((item) =>
            getSelectedPrerakList?.includes(item.user_id),
          );
          setFilteredData(filteredUsers);
          setSelectedPrerak(getSelectedPrerakList);
        }
      } catch (error) {
        console.error("Failed to fetch status list:", error);
      }
      setLoading(false);
    };
    init();
  }, []);

  const transformData = (data) => {
    const userMap = {};

    data.forEach((item) => {
      const userId = item.user_id;

      if (!userMap[userId]) {
        userMap[userId] = {
          user_id: userId,
          academic_year: [],
          program_id: item.program_id,
          program: item.program,
          user: item.user,
        };
      }

      userMap[userId].academic_year.push({
        name: item.academic_year.name,
        academic_year_id: item.academic_year_id,
        status: item.status,
      });
    });

    return Object.values(userMap);
  };

  const onHandleChange = () => {
    setIsModalOpen(true);
    setFilter({});
  };

  const handlePrerakChange = (values) => {
    setIsDisable(values.length === 0);
    setSelectedPrerak(values);
  };

  const handleContinueBtn = () => {
    const filteredUsers = prerakList?.filter((item) =>
      selectedPrerak?.includes(item.user_id),
    );
    localStorage.setItem(
      "pc_user_prerak_filter_for_leaner",
      JSON.stringify(selectedPrerak),
    );
    setFilteredData(filteredUsers);
    setIsModalOpen(false);
  };

  const getLearner = async (filters) => {
    const { currentPage, totalPages, error, ...result } =
      await PcuserService.getLearnerList(filters);
    if (!error) {
      setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
      if (filters.page <= 1) {
        setBeneficiary(result?.data);
      } else {
        setBeneficiary([...(beneficiary || []), ...(result?.data || [])]);
      }
    }
  };

  useEffect(() => {
    if (filter?.search || filter?.status || filter?.sortType)
      getLearner(filter);
  }, [filter]);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      facilitator={userTokenInfo?.authUser || {}}
      _appBar={{
        name: t("LEARNER_PROFILE"),
        onPressBackButton: () => {
          navigate("/learner/learnerProfileView");
        },
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({
            ...filter,
            search: value,
            status: " ",
            sortType: " ",
            page: 1,
          });
          setFilteredData([]);
          setSelectedPrerak([]);
          setIsDisable(true);
        },
      }}
      _footer={{ menues: true }}
      loading={loading}
      analyticsPageTitle={"LEARNER_PROFILE"}
      pageTitle={t("LEARNER_PROFILE")}
    >
      <VStack ref={ref} p="4" space={4}>
        <Box
          flex="1"
          onClick={() => onHandleChange()}
          borderColor="textMaroonColor.500"
          borderBottomColor="black"
          bg="white"
          borderWidth="2px"
          p="2"
          minH="30px"
          rounded={"full"}
        >
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <FrontEndTypo.H4>{t("SELECT_PRERAK")}</FrontEndTypo.H4>
            <IconByName name="ArrowDownSLineIcon" />
          </HStack>
        </Box>
        <HStack>
          <Box>{`Selected Prerak: ${selectedPrerak?.length}`}</Box>
        </HStack>
        <HStack justifyContent="space-between" space="2" alignItems="center">
          <SelectStyle
            flex="1"
            overflowX="hidden"
            selectedValue={filter?.status || ""}
            placeholder={t("STATUS_ALL")}
            onValueChange={(nextValue) => {
              setFilter({
                ...filter,
                status: nextValue,
                search: undefined,
                page: 1,
              });
              setFilteredData([]);
              setSelectedPrerak([]);
              setIsDisable(true);
            }}
            _selectedItem={{
              bg: "cyan.600",
              endIcon: <IconByName name="ArrowDownSLineIcon" />,
            }}
            accessibilityLabel="Select a position for Menu"
          >
            <Select.Item key={0} label={t("BENEFICIARY_ALL")} value={""} />
            {Array.isArray(selectStatus) &&
              selectStatus.map((option) => (
                <Select.Item
                  key={option?.value}
                  label={t(option.title)}
                  value={option.value}
                />
              ))}
          </SelectStyle>
          <SelectStyle
            flex="1"
            overflowX="hidden"
            selectedValue={filter?.sortType ? filter?.sortType : ""}
            placeholder={t("SORT_BY")}
            onValueChange={(nextValue) => {
              setFilter({
                ...filter,
                sortType: nextValue,
                search: undefined,
                page: 1,
              });
              setFilteredData([]);
              setSelectedPrerak([]);
              setIsDisable(true);
            }}
            _selectedItem={{
              bg: "secondary.700",
            }}
            accessibilityLabel="Select a position for Menu"
          >
            {select2.map((option) => (
              <Select.Item
                key={option?.value}
                label={t(option.label)}
                value={option.value}
                p="5"
              />
            ))}
          </SelectStyle>
        </HStack>
      </VStack>
      {filteredData.length <= 0 &&
      beneficiary.length > 0 &&
      (filter?.search || filter?.status || filter?.sortType) ? (
        <InfiniteScroll
          key={loadingHeight}
          height={loadingHeight}
          next={(e) =>
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            })
          }
          dataLength={beneficiary?.length}
          hasMore={hasMore}
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
              {beneficiary?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          // below props only if you need pull down functionality
          pullDownToRefreshThreshold={50}
        >
          <List data={beneficiary} location={location} />
        </InfiniteScroll>
      ) : filteredData.length > 0 &&
        !filter?.search &&
        !filter?.status &&
        !filter?.sortType ? (
        <Box p={4} flex={1}>
          {filteredData.map((item) => (
            <Box key={item.user_id}>
              <FrontEndTypo.H3 my={"15px"}>
                {[
                  item?.user.first_name,
                  item?.user.middle_name,
                  item?.user.last_name,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </FrontEndTypo.H3>
              {item?.academic_year?.map((academic) => {
                return (
                  <HStack
                    bg="gray.100"
                    borderColor="gray.300"
                    key={academic.user_id}
                    borderWidth="1px"
                    my={2}
                    borderRadius="10px"
                    px={4}
                  >
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Stack space="md" alignItems="center">
                        {academic?.name}
                      </Stack>
                      <Stack>
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={() => {
                            navigate(`/learners/list-view`, {
                              state: {
                                filter: location?.state,
                                prerak_id: item?.user_id,
                                academic: academic,
                                program_id: item?.program_id,
                              },
                            });
                          }}
                          color="maroon.400"
                        />
                      </Stack>
                    </HStack>
                  </HStack>
                );
              })}
            </Box>
          ))}
        </Box>
      ) : (
        <VStack paddingBottom="64px">
          <VStack paddingLeft="16px" paddingRight="16px" space="24px">
            <VStack alignItems="center" pt="20px">
              {beneficiary?.profile_photo_1?.id ? (
                <ImageView
                  source={{
                    document_id: beneficiary?.profile_photo_1?.id,
                  }}
                  width="190px"
                  height="190px"
                />
              ) : (
                <IconByName
                  name="AccountCircleLineIcon"
                  color="gray.300"
                  _icon={{ size: "190px" }}
                />
              )}
            </VStack>
          </VStack>
          <FrontEndTypo.H4 textAlign="center" color="black">
            {t("SELECT_A_PRERAK")}
          </FrontEndTypo.H4>
          <FrontEndTypo.H6 textAlign="center" color="black">
            {t("SELECT_AT_LEAST_ONE_PRERAK")}
          </FrontEndTypo.H6>
        </VStack>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        safeAreaTop={true}
        size="xl"
      >
        <Modal.Content>
          <Modal.Header p="4">
            <Checkbox
              position="absolute"
              colorScheme="red"
              top="1"
              left="0"
              onChange={(e) => {
                setIsDisable(false);
                if (e) {
                  setSelectedPrerak(prerakList.map((i) => i.user_id));
                } else {
                  setSelectedPrerak([]);
                }
              }}
              isChecked={prerakList?.length <= selectedPrerak?.length}
            >
              <FrontEndTypo.H3 color="gray.800">
                {t("SELECT_ALL")}
              </FrontEndTypo.H3>
            </Checkbox>
            <FrontEndTypo.H3 textAlign="center" color="black">
              {t("SELECT_PRERAK")}
            </FrontEndTypo.H3>
            <IconButton
              position="absolute"
              right="3"
              onPress={() => setIsModalOpen(false)}
              icon={<IconByName name="CloseCircleLineIcon" size="4" />}
              top="3"
            />
          </Modal.Header>

          <Modal.Body p="4">
            <VStack space="5">
              <Checkbox.Group
                onChange={handlePrerakChange}
                colorScheme="red"
                value={selectedPrerak}
              >
                {prerakList?.map((item) => (
                  <Checkbox key={item.user_id} value={item.user_id} mb="1">
                    <FrontEndTypo.H3 color="gray.800">
                      {[
                        item?.user.first_name,
                        item?.user.middle_name,
                        item?.user.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </FrontEndTypo.H3>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between" alignItems="center">
            <FrontEndTypo.Secondarybutton
              onPress={(e) => setIsModalOpen(false)}
            >
              {t("GO_BACK")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              onPress={handleContinueBtn}
              colorScheme="red"
              isDisabled={isDisable}
            >
              {t("VIEW_LEARNERS")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

LearnerList.propTypes = {
  userTokenInfo: PropTypes.any,
};
