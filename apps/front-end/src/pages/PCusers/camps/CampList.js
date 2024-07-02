import {
  facilitatorRegistryService,
  t,
  IconByName,
  PCusers_layout as Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
  SelectStyle,
  Loading,
  CardComponent,
  campService,
  AdminTypo,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Box,
  Select,
  Pressable,
  Input,
  Modal,
  IconButton,
  Checkbox,
  Button,
  Divider,
} from "native-base";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import { debounce } from "lodash";

export default function CampList() {
  const [facilitator, setFacilitator] = useState({});
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    search: "",
  });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const fa_id = localStorage.getItem("id");
  const prerak_status = localStorage.getItem("status");
  const [loading, setloading] = React.useState(false);
  const [prerakList, setPrerakList] = React.useState([]);
  const [filteredPrerakIds, setFilteredPrerakIds] = useState([]);
  const [campPrerak, setCampPrerak] = React.useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [beneficiary, setBeneficiary] = useState(true);
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPrerakCampList = async () => {
      setLoadingList(true);
      try {
        const result = await campService.getPrerakCampList(filter);
        setPrerakList(result?.facilitator_data);
        if (filter?.search) {
          if (result?.facilitator_data) {
            const req = {
              facilitator_list: result?.facilitator_data?.map((e) => ({
                user_id: e.user_id,
                academic_year_id: e?.academic_year_id,
                program_id: e?.program_id,
              })),
            };
            const camp = await campService.getCampPrerak(req);
            setCampPrerak(camp);
            let filteredUsers;
            if (camp.length > 0) {
              camp?.forEach((element) => {
                filteredUsers = result?.facilitator_data?.map((e) => {
                  if (
                    e.user_id == element.facilitator_id &&
                    e?.academic_year_id == element.academic_year_id &&
                    e?.program_id == element.program_id
                  ) {
                    return {
                      ...e,
                      camp_id: element.camp_id,
                      facilitator_id: element.facilitator_id,
                      isCampAvailable: true,
                    };
                  } else {
                    return {
                      ...e,
                      isCampAvailable: false,
                    };
                  }
                });
              });
            } else {
              filteredUsers = result?.facilitator_data?.map((e) => {
                return {
                  ...e,
                  isCampAvailable: false,
                };
              });
            }

            setSelectedPrerak(filteredUsers);
          }
        }
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingList(false);
      }
    };
    getPrerakCampList();
  }, [filter]);

  const handlePrerakChange = (values) => {
    setIsDisable(values?.length === 0);
    setFilteredPrerakIds(values);
  };

  const handleContinueBtn = async () => {
    let filteredUsers = prerakList?.filter((item) =>
      filteredPrerakIds?.includes(item?.user_id)
    );
    // setSelectedPrerak(filteredUsers);

    setIsModalOpen(false);
    const req = {
      facilitator_list: filteredUsers?.map((e) => ({
        user_id: e.user_id,
        academic_year_id: e?.academic_year_id,
        program_id: e?.program_id,
      })),
    };
    setLoadingList(true);
    try {
      const result = await campService.getCampPrerak(req);
      setCampPrerak(result);
      if (result.length > 0) {
        result?.forEach((element) => {
          filteredUsers = filteredUsers?.map((e) => {
            if (
              e.user_id == element.facilitator_id &&
              e?.academic_year_id == element.academic_year_id &&
              e?.program_id == element.program_id
            ) {
              return {
                ...e,
                camp_id: element.camp_id,
                facilitator_id: element.facilitator_id,
                isCampAvailable: true,
              };
            } else {
              return {
                ...e,
                isCampAvailable: false,
              };
            }
          });
        });
      } else {
        filteredUsers = filteredUsers?.map((e) => {
          return {
            ...e,
            isCampAvailable: false,
          };
        });
      }

      setSelectedPrerak(filteredUsers);
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingList(false);
    }
  };

  const onHandleChange = () => {
    setIsModalOpen(true);
    setFilter({
      ...filter,
      search: "",
    });
    // getPrerakCampList();
  };

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _footer={{ menues: true }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      analyticsPageTitle={"CAMP_LIST"}
      pageTitle={t("CAMP_LIST")}
      _appBar={{
        onPressBackButton: () => {
          navigate("/camps");
        },
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          if (value?.search) {
            setFilter((prevFilter) => ({
              ...prevFilter,
              search: value,
            }));
            setPrerakList([]);
            setSelectedPrerak([]);
            setIsDisable(true);
          } else {
            setFilter((prevFilter) => ({
              ...prevFilter,
              search: "",
            }));
            setPrerakList([]);
            setSelectedPrerak([]);
            setIsModalOpen(false);
          }
        },
      }}
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
        {filter?.search && selectedPrerak?.length === 0 && (
          <HStack>
            <Box marginLeft={"25px"}>{"No data available"}</Box>
          </HStack>
        )}
        {!filter?.search && selectedPrerak?.length === 0 && (
          <Box>
            <HStack>
              <Box
                marginLeft={"25px"}
              >{`Selected Prerak: ${selectedPrerak?.length}`}</Box>
            </HStack>
            <Box
              onClick={() => onHandleChange()}
              mb="2"
              mt="4"
              style={{ cursor: "pointer" }}
              width={"100%"}
              alignItems={"center"}
            >
              {selectedPrerak?.length > 0 ? (
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
                    {t("SELECT_AT_LEAST_ONE_PRERAK_TO_VIEW_A_LIST_OF_CAMPS")}
                  </AdminTypo.H6>
                </VStack>
              )}
            </Box>
          </Box>
        )}
      </VStack>
      <VStack space={4} p={4}>
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
                  pb="5"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Checkbox.Group
                    colorScheme="gray"
                    defaultValue={filteredPrerakIds}
                    onChange={handlePrerakChange}
                  >
                    {Array.isArray(prerakList) && prerakList.length > 0 ? (
                      prerakList.map((item) => (
                        <Checkbox
                          key={item?.user_id}
                          value={item?.user_id}
                          my={2}
                        >
                          {item?.user?.first_name} {item?.user?.middle_name}{" "}
                          {item?.user?.last_name}
                        </Checkbox>
                      ))
                    ) : (
                      <></>
                    )}
                  </Checkbox.Group>
                </HStack>

                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  mt="5"
                >
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
                    {t("VIEW_PRERAKS")}
                  </Button>
                </HStack>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <VStack space={4} py={4} ml="2">
          {selectedPrerak &&
            selectedPrerak?.map((item) => (
              <Box>
                <HStack>
                  <FrontEndTypo.H3
                    key={item.facilitator_id}
                    value={item}
                    my={2}
                  >
                    {item?.user?.first_name} {item?.user?.middle_name}{" "}
                    {item?.user?.last_name}
                  </FrontEndTypo.H3>
                </HStack>
                <Pressable
                  bg="boxBackgroundColour.100"
                  shadow="AlertShadow"
                  borderRadius="10px"
                  py={3}
                  px={5}
                  mb="4"
                >
                  <Box>
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <VStack flex={"0.9"}>
                        <FrontEndTypo.H3 color="textMaroonColor.400">
                          {!item?.isCampAvailable && (
                            <FrontEndTypo.H3 my={2}>
                              {t("CAMP")}&nbsp;
                              {t("NOT_AVAILABLE")}
                            </FrontEndTypo.H3>
                          )}
                          {item?.isCampAvailable && (
                            <FrontEndTypo.H3
                              key={item?.camp_id}
                              value={item}
                              my={2}
                              onPress={() => {
                                navigate(
                                  `/camps/CampProfileView/${item?.camp_id}`,
                                  {
                                    state: {
                                      academic_year_id: item?.academic_year_id,
                                      program_id: item?.program_id,
                                      user_id: item?.facilitator_id,
                                    },
                                  }
                                );
                              }}
                            >
                              {t("CAMP")}&nbsp;
                              {item?.camp_id}
                            </FrontEndTypo.H3>
                          )}
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
                  </Box>
                </Pressable>
              </Box>
            ))}
        </VStack>
      </VStack>
      {!loadingList ? (
        <InfiniteScroll
          dataLength={data?.length}
          next={() =>
            setFilter({
              ...filter,
            })
          }
          hasMore={hasMore}
          height={loadingHeight}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {prerakList?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
        >
          {/* <List data={prerakList} /> */}
        </InfiniteScroll>
      ) : (
        // Loading component here if needed
        <></>
      )}
    </Layout>
  );
}
