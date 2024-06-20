import {
  t,
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
  AdminTypo,
  benificiaryRegistoryService,
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
} from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "component/BeneficiaryStatus";
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
              onPress={() => navigate(`/prerak/PrerakProfileView/${item?.id}`)}
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
  const [filter, setFilter] = useState({ limit: 6 });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setloading] = React.useState(false);
  const [beneficiary, setBeneficiary] = React.useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [prerakData, setPrerakData] = React.useState();
  const [isDisable, setIsDisable] = useState(true);

  console.log({ loadingList });

  useEffect(async () => {
    setLoadingList(true);
    try {
      const data = await benificiaryRegistoryService.getStatusList();
      if (data.length > 0) {
        setSelectStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch status list:", error);
    }
    setLoadingList(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingList(true);
      try {
        const fetchedData = [
          {
            id: "1",
            first_name: "John",
            middle_name: null,
            last_name: "Doe",
            mobile: "1234567890",
            program_beneficiaries: {
              status: "enrolled",
              enrollment_first_name: "John",
              enrollment_middle_name: null,
              enrollment_last_name: "Doe",
            },
            is_duplicate: false,
            is_deactivated: false,
            cohorts: [
              {
                name: "Cohort 2022-2023",
                users: [
                  {
                    userId: 1,
                    firstName: "Yogini",
                    lastName: "Tayade",
                    mobile: "8778909890",
                  },
                ],
              },
              {
                name: "Cohort 2021-2022",
                users: [
                  {
                    userId: 1,
                    firstName: "Sonali",
                    lastName: "Garud",
                    mobile: "8909879098",
                  },
                  {
                    userId: 2,
                    firstName: "Reshma",
                    lastName: "Mahadik",
                    mobile: "9876543509",
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            first_name: "Jane",
            middle_name: "David",
            last_name: "Smith",
            mobile: "0987654321",
            program_beneficiaries: {
              status: "identified",
              enrollment_first_name: "Jane",
              enrollment_middle_name: "David",
              enrollment_last_name: "Smith",
            },
            is_duplicate: false,
            is_deactivated: false,
            cohorts: [
              {
                name: "Cohort 2023-2024",
                users: [
                  {
                    userId: 1,
                    firstName: "Snehal",
                    lastName: "Sabade",
                    mobile: "98768909990",
                  },
                ],
              },
            ],
          },
          {
            id: "3",
            first_name: "David",
            middle_name: "Robin",
            last_name: "Dane",
            mobile: "9012345678",
            program_beneficiaries: {
              status: "enrolled",
              enrollment_first_name: "David",
              enrollment_middle_name: "Robin",
              enrollment_last_name: "Dane",
            },
            is_duplicate: false,
            is_deactivated: false,
            cohorts: [
              {
                name: "Cohort 2024-2025",
                users: [
                  {
                    userId: 1,
                    firstName: "Dhanashree",
                    lastName: "Patil",
                    mobile: "98098909890",
                  },
                ],
              },
            ],
          },
          {
            id: "4",
            first_name: "tatya",
            middle_name: "",
            last_name: "Dane",
            mobile: "9012345678",
            program_beneficiaries: {
              status: "enrolled",
              enrollment_first_name: "David",
              enrollment_middle_name: "Robin",
              enrollment_last_name: "Dane",
            },
            is_duplicate: false,
            is_deactivated: false,
            cohorts: [
              {
                name: "Cohort 2024-2025",
                users: [
                  {
                    userId: 1,
                    firstName: "Dhanashree",
                    lastName: "Patil",
                    mobile: "98098909890",
                  },
                ],
              },
            ],
          },
        ];
        setPrerakData(fetchedData);
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingList(false);
      }
    };
    fetchData();
  }, []);

  const handlePrerakChange = (values) => {
    setIsDisable(values.length === 0);
    setSelectedPrerak(values);
  };
  const handleContinueBtn = () => {
    const filteredUsers = prerakData.filter((item) =>
      selectedPrerak.includes(item.id)
    );
    setFilteredData(filteredUsers);
    setIsModalOpen(false);
  };

  return (
    <Layout
      _appBar={{
        name: t("LEARNER_PROFILE"),
        onPressBackButton: () => {
          navigate("/learner/learnerProfileView");
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
            onClick={() => setIsModalOpen(true)}
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
        <Box
          onClick={() => setIsModalOpen(true)}
          mb="2"
          mt="4"
          style={{ cursor: "pointer" }}
          width={"100%"}
          alignItems={"center"}
        >
          {filteredData.length > 0 ? (
            <></>
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
      </VStack>
      {console.log(filter)}
      {!loadingList ? (
        <InfiniteScroll
          dataLength={filteredData?.length}
          next={() =>
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            })
          }
          hasMore={hasMore}
          height={loadingHeight}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {filteredData?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
        >
          <Box p={4} flex={1}>
            {filteredData &&
              filteredData.length > 0 &&
              filteredData.map((item, index) => (
                <Box key={item.id}>
                  <span>
                    {item?.first_name} {item?.last_name}
                  </span>
                  {item?.cohorts &&
                    item?.cohorts?.map((cohart, i) => (
                      <Box space={4} py={4}>
                        <Pressable
                          onPress={() => {
                            navigate("/camps/12234");
                          }}
                          bg="boxBackgroundColour.100"
                          shadow="AlertShadow"
                          borderRadius="10px"
                          py={3}
                          px={5}
                        >
                          <HStack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <VStack flex={"0.9"}>
                              <FrontEndTypo.H3 color="textMaroonColor.400">
                                {t("COHORT 2023-2024")}
                              </FrontEndTypo.H3>
                            </VStack>
                            <HStack alignItems={"center"}>
                              <IconByName
                                isDisabled
                                name={
                                  ["camp_ip_verified"].includes()
                                    ? "CheckLineIcon"
                                    : "ErrorWarningLineIcon"
                                }
                                color={
                                  ["camp_ip_verified"].includes()
                                    ? "textGreen.700"
                                    : "textMaroonColor.400"
                                }
                                _icon={{ size: "20px" }}
                              />
                            </HStack>
                          </HStack>
                        </Pressable>
                      </Box>
                    ))}
                </Box>
              ))}
          </Box>
        </InfiniteScroll>
      ) : (
        // Loading component here if needed
        <></>
      )}
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
                  defaultValue={selectedPrerak}
                  onChange={handlePrerakChange}
                >
                  {prerakData?.map((item) => (
                    <Checkbox key={item.id} value={item.id} my={2}>
                      {item?.first_name} {item?.middle_name} {item?.last_name}
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
