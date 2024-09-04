import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  PcuserService,
  SelectStyle,
  benificiaryRegistoryService,
  jsonParse,
} from "@shiksha/common-lib";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Modal,
  Pressable,
  Select,
  Stack,
  VStack,
} from "native-base";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const List = ({ data }) => {
  const navigate = useNavigate();

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
                navigate(`/learner/learverProfileView/${item?.id}`)
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

List.propTypes = {
  data: PropTypes.object,
};

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function LearnerList() {
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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const status = await benificiaryRegistoryService.getStatusList();
        setSelectStatus(status);
        const result = await PcuserService.getPrerakList(filter);
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
    const data = await PcuserService.getLearnerList(filters);
    setBeneficiary(data);
  };

  useEffect(() => {
    getLearner(filter);
  }, [filter]);

  const getView = () => {
    return filteredData.length > 0 &&
      !filter?.search &&
      !filter?.status &&
      !filter?.sortType ? (
      filteredData.map((item) => (
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
        <FrontEndTypo.H4 textAlign="center" color="black">
          {t("SELECT_A_PRERAK")}
        </FrontEndTypo.H4>
        <FrontEndTypo.H6 textAlign="center" color="black">
          {t("SELECT_AT_LEAST_ONE_PRERAK")}
        </FrontEndTypo.H6>
      </VStack>
    );
  };

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
      <Box p={4} flex={1}>
        {filteredData.length <= 0 &&
        beneficiary.length > 0 &&
        (filter?.search || filter?.status || filter?.sortType)
          ? beneficiary?.map((item) => {
              return (
                <CardComponent
                  key={item?.id}
                  _body={{ px: "3", py: "3" }}
                  _vstack={{ p: 0, space: 2, flex: 1, m: 4 }}
                >
                  <Pressable
                    onPress={() =>
                      navigate(`/learners/list-view/${item?.user_id}`, {
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
                          wordWrap="break-word"
                          flex="1"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                          overflow="hidden"
                          pl="2"
                        >
                          <FrontEndTypo.H3 bold color="textGreyColor.800">
                            {[
                              item?.first_name,
                              item?.middle_name,
                              item?.last_name,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </FrontEndTypo.H3>
                          <FrontEndTypo.H5 color="textGreyColor.800">
                            {item?.enrollment_number}
                          </FrontEndTypo.H5>
                        </VStack>
                      </HStack>
                      <VStack alignItems="end" flex={[1]}>
                        <ChipStatus
                          width="fit-content"
                          status={item?.status}
                          is_duplicate={item?.is_duplicate}
                          is_deactivated={item?.is_deactivated}
                          rounded={"sm"}
                        />
                      </VStack>
                    </HStack>
                  </Pressable>
                </CardComponent>
              );
            })
          : getView()}
      </Box>
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

LearnerList.propTypes = {};
