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
  const [filter, setFilter] = useState({ limit: 6 });
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
  const [prerakList, setPrerakList] = React.useState();
  const [filteredData, setFilteredData] = useState([]);
  const [prerakData, setPrerakData] = React.useState();
  const [isDisable, setIsDisable] = useState(true);
  const [beneficiary, setBeneficiary] = useState(true);
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPrerakCampList = async () => {
      setLoadingList(true);
      try {
        const result = await campService.getPrerakCampList();
        setPrerakList(result);
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingList(false);
      }
    };
    getPrerakCampList();
  }, []);

  const handlePrerakChange = (values) => {
    setIsDisable(values.length === 0);
    setSelectedPrerak(values);
  };

  const handleContinueBtn = () => {
    const filteredUsers = prerakList?.filter((item) =>
      selectedPrerak?.includes(item?.camp_id)
    );
    setFilteredData(filteredUsers);
    console.log("filteredUsers", filteredUsers);
    setIsModalOpen(false);
  };

  const onHandleChange = () => {
    setIsModalOpen(true);
    // getPrerakCampList();
  };

  const handleSearch = useCallback(
    (e) => {
      setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
    },
    [filter]
  );
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _footer={{ menues: true }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      analyticsPageTitle={"CAMP_LIST"}
      pageTitle={t("CAMP_LIST")}
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
        <Box
          onClick={() => onHandleChange()}
          mb="2"
          mt="4"
          style={{ cursor: "pointer" }}
          width={"100%"}
          alignItems={"center"}
        >
          {selectedPrerak.length > 0 ? (
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
                    {prerakList &&
                      prerakList?.map((item) => (
                        <Checkbox key={item.camp_id} value={item} my={2}>
                          {item?.first_name} {item?.middle_name}{" "}
                          {item?.last_name}
                        </Checkbox>
                      ))}
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
        <Box space={4} py={4}>
          {selectedPrerak &&
            selectedPrerak?.map((item) => (
              <Pressable
                bg="boxBackgroundColour.100"
                shadow="AlertShadow"
                borderRadius="10px"
                py={3}
                px={5}
                mb="4"
              >
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <VStack flex={"0.9"}>
                    <FrontEndTypo.H3 color="textMaroonColor.400">
                      <FrontEndTypo.H3
                        key={item}
                        value={item}
                        my={2}
                        onPress={() => {
                          navigate(`/camps/CampProfileView/${item?.camp_id}`, {
                            state: {
                              academic_year_id: item?.academic_year_id,
                              program_id: item?.program_id,
                              user_id: item?.facilitator_id,
                            },
                          });
                        }}
                      >
                        {t("CAMP")}
                        {item?.camp_id}
                      </FrontEndTypo.H3>
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
            ))}
        </Box>
      </VStack>
    </Layout>
  );
}
