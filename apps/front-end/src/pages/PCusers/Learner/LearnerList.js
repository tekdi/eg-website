import {
  t,
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
  AdminTypo,
  PcUserService,
  benificiaryRegistoryService,
  PcuserService,
  enumRegistryService,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Box,
  Select,
  Pressable,
  Modal,
  Checkbox,
  IconButton,
  Button,
  Divider,
  Stack,
  Input,
} from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const List = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack space="4" p="4" alignContent="center">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <CardComponent
            key={item?.id}
            _body={{ px: "3", py: "3" }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={() =>
                navigate(`/learner/learnerProfileView/${item?.id}`)
              }
            >
              <HStack justifyContent="space-between" space={1}>
                <HStack alignItems="center" flex={[1, 2, 4]}>
                  <VStack alignItems="center" p="1">
                    <Chip>
                      <Clipboard text={item?.id}>
                        <FrontEndTypo.H2 bold>{item?.id}</FrontEndTypo.H2>
                      </Clipboard>
                    </Chip>
                  </VStack>
                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <FrontEndTypo.H3 bold color="textGreyColor.800">
                      {item?.first_name}
                      {item?.middle_name &&
                        item?.middle_name !== "null" &&
                        ` ${item.middle_name}`}
                      {item?.last_name &&
                        item?.last_name !== "null" &&
                        ` ${item.last_name}`}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H5 color="textGreyColor.800">
                      {item?.mobile}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
              </HStack>
            </Pressable>
          </CardComponent>
        ))
      ) : (
        <></>
      )}
    </VStack>
  );
};

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function LearnerList() {
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setloading] = useState(false);
  const [prerakList, setPrerakList] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [beneficiary, setBeneficiary] = useState(true);

  useEffect(async () => {
    setLoadingList(true);
    try {
      const status = await benificiaryRegistoryService.getStatusList();
      setSelectStatus(status);
      getPrerakList();
    } catch (error) {
      console.error("Failed to fetch status list:", error);
    }
    setLoadingList(false);
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

  const getPrerakList = async () => {
    setLoadingList(true);
    try {
      const result = await PcuserService.getPrerakList(filter);
      const apiData = transformData(result?.facilitator_data);
      setPrerakList(apiData);
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingList(false);
    }
  };

  const onHandleChange = () => {
    getPrerakList();
    setIsModalOpen(true);
    setFilter({});
  };

  const handlePrerakChange = (values) => {
    setIsDisable(values.length === 0);
    setSelectedPrerak(values);
  };

  const handleContinueBtn = () => {
    const filteredUsers = prerakList?.filter((item) =>
      selectedPrerak?.includes(item.user_id)
    );
    setFilteredData(filteredUsers);
    setIsModalOpen(false);
  };

  const getLearner = async (filters) => {
    const data = await PcuserService.getLearnerList(filters);
    setBeneficiary(data);
  };

  useEffect(() => {
    getLearner(filter);
  }, [filter]);

  return (
    <Layout
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
      <VStack ref={ref}>
        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="center"
          p="4"
        >
          <Box
            flex="2"
            onClick={() => onHandleChange()}
            placeholderTextColor="textBlack.500"
            borderColor="textMaroonColor.500"
            borderBottomColor="black"
            bg="#FFFFFF"
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
        </HStack>
        <HStack>
          <Box
            marginLeft={"25px"}
          >{`Selected Prerak: ${selectedPrerak?.length}`}</Box>
        </HStack>
        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="center"
          p="4"
        >
          <Box flex="2">
            <SelectStyle
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
        <Box
          onClick={() => onHandleChange()}
          mb="2"
          mt="4"
          style={{ cursor: "pointer" }}
          width={"100%"}
          alignItems={"center"}
        ></Box>
      </VStack>
      <Box p={4} flex={1}>
        {filteredData.length <= 0 &&
        beneficiary.length > 0 &&
        (filter?.search || filter?.status || filter?.sortType) ? (
          beneficiary?.map((item) => {
            return (
              <CardComponent
                key={item?.id}
                _body={{ px: "3", py: "3" }}
                _vstack={{ p: 0, space: 2, flex: 1, m: 4 }}
              >
                <Pressable
                  onPress={() =>
                    navigate(`/learner/learnerListView/${item?.user_id}`, {
                      state: {
                        location: {
                          academic: {
                            academic_year_id: item?.academic_year_id,
                          },
                          prerak_id: item?.user_id,
                          program_id: item?.program_id,
                        },
                      },
                    })
                  }
                >
                  <HStack justifyContent="space-between" space={1}>
                    <HStack alignItems="center" flex={[1, 2, 4]}>
                      <VStack alignItems="center" p="1">
                        <Chip>
                          <Clipboard text={item?.id}>
                            <FrontEndTypo.H2 bold>
                              {item?.user_id}
                            </FrontEndTypo.H2>
                          </Clipboard>
                        </Chip>
                      </VStack>
                      <VStack
                        pl="2"
                        flex="1"
                        wordWrap="break-word"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        <FrontEndTypo.H3 bold color="textGreyColor.800">
                          {item?.first_name}
                          {item?.middle_name &&
                            item?.middle_name !== "null" &&
                            ` ${item.middle_name}`}
                          {item?.last_name &&
                            item?.last_name !== "null" &&
                            ` ${item.last_name}`}
                        </FrontEndTypo.H3>
                        <FrontEndTypo.H5 color="textGreyColor.800">
                          {item?.enrollment_number}
                        </FrontEndTypo.H5>
                      </VStack>
                    </HStack>
                    <VStack alignItems="end" flex={[1]}>
                      <ChipStatus
                        w="fit-content"
                        status={item?.status}
                        rounded={"sm"}
                      />
                    </VStack>
                  </HStack>
                </Pressable>
              </CardComponent>
            );
          })
        ) : filteredData.length > 0 &&
          !filter?.search &&
          !filter?.status &&
          !filter?.sortType ? (
          filteredData.map((item, index) => (
            <Box key={item.user_id}>
              <FrontEndTypo.H3 my={"15px"}>
                {item?.user.first_name} {item?.user.middle_name}{" "}
                {item?.user.last_name}
              </FrontEndTypo.H3>
              {item?.academic_year?.map((academic) => {
                return (
                  <HStack
                    key={academic.user_id}
                    bg="gray.100"
                    borderColor="gray.300"
                    borderRadius="10px"
                    borderWidth="1px"
                    my={2}
                    px={4}
                  >
                    <HStack
                      width={"100%"}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack space="md" alignItems="center">
                        {academic?.name}
                      </Stack>
                      <Stack>
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={() => {
                            navigate(`/learner/LearnerListView`, {
                              state: {
                                academic: academic,
                                prerak_id: item?.user_id,
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
          ))
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
            <AdminTypo.H4 textAlign="center" color="black">
              {t("SELECT_A_PRERAK")}
            </AdminTypo.H4>
            <AdminTypo.H6 textAlign="center" color="black">
              {t("SELECT_AT_LEAST_ONE_PRERAK")}
            </AdminTypo.H6>
          </VStack>
        )}
      </Box>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        safeAreaTop={true}
        size="xl"
      >
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <AdminTypo.H3 textAlign="center" color="black">
              {t("SELECT_PRERAK")}
            </AdminTypo.H3>

            <IconButton
              icon={<IconByName name="CloseCircleLineIcon" size="4" />}
              onPress={() => setIsModalOpen(false)}
              position="absolute"
              right="3"
              top="3"
            />
          </Modal.Header>

          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <HStack
                space="5"
                // borderBottomWidth={1}
                // borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Checkbox.Group
                  colorScheme="gray"
                  value={selectedPrerak}
                  onChange={handlePrerakChange}
                >
                  {prerakList &&
                    prerakList?.map((item) => (
                      <Checkbox key={item.user_id} value={item.user_id} my={2}>
                        {item?.user.first_name}
                        {item?.user.middle_name
                          ? `${item?.user.middle_name} ${item?.user.last_name}`
                          : item?.user.last_name}
                      </Checkbox>
                    ))}
                </Checkbox.Group>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center" mt="5">
                <Button
                  colorScheme="red"
                  onPress={(e) => setIsModalOpen(false)}
                >
                  {t("GO_BACK")}
                </Button>
                <Button
                  colorScheme="red"
                  onPress={handleContinueBtn}
                  isDisabled={isDisable}
                >
                  {t("VIEW_LEARNERS")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

LearnerList.propTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
