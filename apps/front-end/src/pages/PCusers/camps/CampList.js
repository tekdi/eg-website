import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  campService,
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  Loading,
} from "@shiksha/common-lib";
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Modal,
  Pressable,
  VStack,
} from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

export default function CampList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    search: "",
  });
  const [loadingList, setLoadingList] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [prerakList, setPrerakList] = React.useState([]);
  const [selectedPrerak, setSelectedPrerak] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrerakIds, setSelectedPrerakIds] = useState([]);

  useEffect(() => {
    const getPrerakCampList = async () => {
      setLoadingList(true);
      try {
        const result = await campService.getPrerakCampList(filter);
        setPrerakList(result?.facilitator_data);
        setLoadingList(false);
        const camp_prerak_selected_ids = JSON.parse(
          localStorage.getItem("camp_prerak_selected_ids"),
        );
        if (camp_prerak_selected_ids) {
          // Ensure prerakList is set before calling searchSelectedPrerakCamps
          if (result?.facilitator_data) {
            setSelectedPrerakIds(camp_prerak_selected_ids);
            searchSelectedPrerakCamps(
              camp_prerak_selected_ids,
              result.facilitator_data,
            ); // Pass the prerakList directly
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingList(false);
      }
    };
    getPrerakCampList();
  }, [localStorage.getItem("camp_prerak_selected_ids")]);

  const searchSelectedPrerakCamps = async (selectedPrerakIds, prerakList) => {
    setSelectedPrerakIds(selectedPrerakIds);
    localStorage.setItem(
      "camp_prerak_selected_ids",
      JSON.stringify(selectedPrerakIds),
    );
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
      const groupedCampData = groupCampsByFacilitator(result);
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

  if (loadingList) {
    return <Loading loading={loadingList} />;
  }

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
      <VStack>
        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="center"
          p={4}
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
              <FrontEndTypo.H4>{`${t("SELECTED_PRERAKS")}: ${selectedPrerak?.length}`}</FrontEndTypo.H4>
              <IconByName name="ArrowDownSLineIcon" />
            </HStack>
          </Box>
        </HStack>
        {selectedPrerak?.length === 0 && (
          <Box
            onClick={() => onHandleChange()}
            mb="2"
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
        )}
      </VStack>
      <VStack space={4} px={4}>
        <VStack space={2} py={4} ml="2">
          {selectedPrerak &&
            selectedPrerak?.map((item) => (
              <Box key={item.camp_id}>
                <HStack>
                  <FrontEndTypo.H3 value={item} my={2}>
                    {item?.first_name} {item?.middle_name} {item?.last_name}
                  </FrontEndTypo.H3>
                </HStack>
                {item?.camps?.map((camp) => (
                  <Pressable
                    key={camp?.camp_id}
                    bg="boxBackgroundColour.100"
                    shadow="AlertShadow"
                    borderRadius="10px"
                    p="4"
                    mb={2}
                    onPress={() => {
                      navigate(`/camps/CampProfileView/${camp?.camp_id}`, {
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
                          <FrontEndTypo.H2>
                            {`${t("CAMP_ID")}: ${camp?.camp_id}`}
                          </FrontEndTypo.H2>
                          <FrontEndTypo.H4>
                            {camp?.camp_type == "pcr"
                              ? t("PCR_CAMP")
                              : t("MAIN_CAMP")}
                          </FrontEndTypo.H4>
                        </VStack>
                        <HStack alignItems={"center"}>
                          <IconByName
                            isDisabled
                            name={"ArrowRightSFillIcon"}
                            _icon={{ size: "30px" }}
                          />
                        </HStack>
                      </HStack>
                    </Box>
                  </Pressable>
                ))}
              </Box>
            ))}
        </VStack>
      </VStack>
      {isModalOpen && (
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
              <FacilitatorForm
                data={prerakList}
                searchSelectedPrerakCamps={searchSelectedPrerakCamps}
                selectedPrerakIds={selectedPrerakIds}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
    </Layout>
  );
}

const FacilitatorForm = ({
  data,
  searchSelectedPrerakCamps,
  selectedPrerakIds,
}) => {
  // State to keep track of checked facilitators' ids
  const [selectedFacilitators, setSelectedFacilitators] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedFacilitators(selectedPrerakIds, data);
  }, [selectedPrerakIds]);

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
    // You can return or use the selectedFacilitators array as needed
    searchSelectedPrerakCamps(selectedFacilitators);
  };

  return (
    <Box p={4}>
      <VStack space={4}>
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
        <HStack justifyContent={"center"} space={4}>
          <FrontEndTypo.Primarybutton
            onPress={handleSubmit}
            isDisabled={selectedFacilitators.length == 0}
          >
            {t("VIEW_CAMPS")}
          </FrontEndTypo.Primarybutton>
        </HStack>
      </VStack>
    </Box>
  );
};

FacilitatorForm.propTypes = {
  data: PropTypes.array,
  searchSelectedPrerakCamps: PropTypes.func,
  selectedPrerakIds: PropTypes.array,
};
