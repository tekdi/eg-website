import {
  facilitatorRegistryService,
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
  Text,
} from "native-base";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

export default function CampList() {
  const { t } = useTranslation();
  // const [facilitator, setFacilitator] = useState({});
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    search: "prit",
  });
  // const [data, setData] = useState([]);
  // const [selectStatus, setSelectStatus] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  // const [hasMore, setHasMore] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const [prerakList, setPrerakList] = React.useState([]);
  const [filteredPrerakIds, setFilteredPrerakIds] = useState([]);
  const [campPrerak, setCampPrerak] = React.useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPrerakCampList = async () => {
      setLoadingList(true);
      try {
        const result = await campService.getPrerakCampList(filter);
        console.log("getPrerakCampList", result);
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
            console.log("getCampPrerak", camp);
            setCampPrerak(camp);
            let filteredUsers;
            if (camp.length > 0) {
              const groupedData = {};
              camp?.forEach((element) => {
                const id = element.facilitator_id;
                if (!groupedData[id]) {
                  groupedData[id] = {
                    facilitator_id: id,
                    camp_id: [element.camp_id],
                    isCampAvailable: true,
                  };
                } else {
                  groupedData[id].camp_id.push(element.camp_id);
                }
              });
              const filteredUsers = result?.facilitator_data?.map((e) => {
                if (groupedData[e.user_id]) {
                  return {
                    ...e,
                    ...groupedData[e.user_id],
                  };
                } else {
                  return {
                    ...e,
                    isCampAvailable: false,
                  };
                }
              });
              setSelectedPrerak(filteredUsers);
            } else {
              filteredUsers = result?.facilitator_data?.map((e) => {
                return {
                  ...e,
                  isCampAvailable: false,
                };
              });
            }
            console.log("filteredUsers", filteredUsers, groupedData);
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

  const groupCampsByFacilitator = (data) => {
    // Object to store grouped data
    const groupedData = {};

    // Iterate over each item in the data array
    data.forEach((item) => {
      const facilitatorId = item.facilitator_id;

      // Check if facilitator_id already exists in groupedData
      if (!groupedData[facilitatorId]) {
        // If not, create a new entry with facilitator details and camps array
        groupedData[facilitatorId] = {
          camps: [{ camp_id: item.camp_id, camp_type: item.camp_type }],
          first_name: item.first_name,
          last_name: item.last_name,
          facilitator_id: item.facilitator_id,
          program_id: item.program_id,
          academic_year_id: item.academic_year_id,
        };
      } else {
        // If exists, add the current camp_id and camp_type to the camps array
        groupedData[facilitatorId].camps.push({
          camp_id: item.camp_id,
          camp_type: item.camp_type,
        });
      }
    });

    // Convert the groupedData object back into an array
    return Object.values(groupedData);
  };

  const handleContinueBtn = async (selectedPrerakIds) => {
    console.log("selectedPrerakIds", selectedPrerakIds);
    console.log("prerakList", prerakList);
    let filteredUsers = prerakList?.filter((item) =>
      selectedPrerakIds?.includes(item?.user_id),
    );

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
      console.log("getCampPrerak 111", result);
      const groupedCampData = groupCampsByFacilitator(result);
      console.log("groupedCampData", groupedCampData);
      setCampPrerak(result);
      setSelectedPrerak(groupedCampData);
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
      }}
    >
      <VStack ref={ref}>
        <HStack
          space={"2"}
          p={"4"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Input
            type="text"
            flex={"1"}
            placeholder={t("SEARCH")}
            borderColor="SelectBorderColor.500"
            InputRightElement={
              <IconByName
                name="SearchLineIcon"
                paddingRight="2"
                color="textBlack.500"
              />
            }
          />
        </HStack>
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
            bg="#FFFFFF"
            borderWidth="1px"
            borderColor="SelectBorderColor.500"
            p="2"
            minH="30px"
            rounded={"md"}
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
              <VStack paddingBottom="64px">
                <VStack paddingLeft="16px" paddingRight="16px" space="24px">
                  <VStack alignItems="center" pt="20px">
                    <IconByName
                      name="AccountCircleLineIcon"
                      color="gray.300"
                      _icon={{ size: "190px" }}
                    />
                  </VStack>
                </VStack>
                <AdminTypo.H4 textAlign="center" color="black">
                  {t("SELECT_A_PRERAK")}
                </AdminTypo.H4>
                <AdminTypo.H6 textAlign="center" color="black">
                  {t("SELECT_AT_LEAST_ONE_PRERAK_TO_VIEW_A_LIST_OF_CAMPS")}
                </AdminTypo.H6>
              </VStack>
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
              {/* <VStack>
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
                          {`${item?.user?.first_name || ""} ${
                            item?.user?.middle_name || ""
                              ? item.user.middle_name + " "
                              : ""
                          }${item?.user?.last_name || ""}`}
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
              </VStack> */}
              <FacilitatorForm
                data={prerakList}
                handleContinueBtn={handleContinueBtn}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
        {console.log("selectedPrerak 33333", selectedPrerak)}
        <VStack space={4} py={4} ml="2">
          {selectedPrerak &&
            selectedPrerak?.map((item) => (
              <Box key={item.camp_id}>
                {console.log("item", item)}
                <HStack>
                  <FrontEndTypo.H3 value={item} my={2}>
                    {item?.first_name} {item?.middle_name} {item?.last_name}
                  </FrontEndTypo.H3>
                </HStack>
                {item?.camps?.map((camp, i) => {
                  console.log("camp", camp);
                  return (
                    <Pressable
                      key={camp?.camp_id}
                      bg="boxBackgroundColour.100"
                      shadow="AlertShadow"
                      borderRadius="10px"
                      p="4"
                      mb={2}
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
                      <Box>
                        <HStack
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <VStack flex={"0.9"}>
                            <FrontEndTypo.H3 color="textMaroonColor.400">
                              {`${camp?.camp_id} ${camp?.camp_type}`}
                            </FrontEndTypo.H3>
                          </VStack>
                          <HStack alignItems={"center"}>
                            <IconByName
                              isDisabled
                              name={"ErrorWarningLineIcon"}
                              color={"textMaroonColor.400"}
                              _icon={{ size: "20px" }}
                            />
                          </HStack>
                        </HStack>
                      </Box>
                    </Pressable>
                  );
                })}
              </Box>
            ))}
        </VStack>
      </VStack>
      {/* {!loadingList ? (
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
          <List data={prerakList} />
        </InfiniteScroll>
      ) : (
        Loading component here if needed
        <></>
      )} */}
    </Layout>
  );
}

const FacilitatorForm = ({ data, handleContinueBtn }) => {
  // State to keep track of checked facilitators' ids
  const [selectedFacilitators, setSelectedFacilitators] = useState([]);

  // Function to handle checkbox toggle
  const handleCheckboxChange = (userId) => {
    setSelectedFacilitators(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // If already selected, unselect
          : [...prev, userId], // Otherwise, add to selected list
    );
  };

  // Function to handle form submission
  const handleSubmit = () => {
    console.log("Selected Facilitator IDs:", selectedFacilitators);
    handleContinueBtn(selectedFacilitators);
    // You can return or use the selectedFacilitators array as needed
    return selectedFacilitators;
  };

  return (
    <Box p={4}>
      <VStack space={4}>
        {/* Map through data to create checkboxes */}
        {data?.map((item) => (
          <Checkbox
            key={item.user_id}
            isChecked={selectedFacilitators.includes(item.user_id)}
            onChange={() => handleCheckboxChange(item.user_id)}
            value={item.user_id.toString()}
          >
            {[item.user.first_name, item.user.middle_name, item.user.last_name]
              .filter(Boolean)
              .join(" ")}
          </Checkbox>
        ))}
        {/* Submit button */}
        <HStack justifyContent={"center"} space={4}>
          <FrontEndTypo.Secondarybutton>Cancel</FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Primarybutton onPress={handleSubmit}>
            Submit
          </FrontEndTypo.Primarybutton>
        </HStack>
      </VStack>
    </Box>
  );
};
