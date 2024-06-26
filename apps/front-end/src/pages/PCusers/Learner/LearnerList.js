import {
  t,
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
  AdminTypo,
  eventService,
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

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function LearnerList() {
  const [filter, setFilter] = useState({ limit: 6 });
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
  const [loading, setloading] = React.useState(false);
  const [prerakList, setPrerakList] = React.useState();
  const [filteredData, setFilteredData] = useState([]);
  const [prerakData, setPrerakData] = React.useState();
  const [isDisable, setIsDisable] = useState(true);
  const [beneficiary, setBeneficiary] = useState(true);

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

  const getPrerakList = async () => {
    setLoadingList(true);
    try {
      const result = await eventService.getPrerakList();
      setPrerakList(result?.facilitator_data);
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingList(false);
    }
  };
  const onHandleChange = () => {
    setIsModalOpen(true);
    getPrerakList();
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

  return (
    <Layout
      _appBar={{
        name: t("LEARNER_PROFILE"),
        onPressBackButton: () => {
          navigate("/learner/learnerProfileView");
        },
      }}
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
            {t("SELECT_PRERAK")}
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
          onClick={() => onHandleChange()}
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
      {!loadingList ? (
        <InfiniteScroll
          dataLength={data?.length}
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
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
        ></InfiniteScroll>
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
                  {prerakList &&
                    prerakList?.map((item) => (
                      <Checkbox key={item.user_id} value={item.user_id} my={2}>
                        {item?.user.first_name} {item?.user.middle_name}{" "}
                        {item?.user.last_name}
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
      <Box p={4} flex={1}>
        {filteredData &&
          filteredData.length > 0 &&
          filteredData.map((item, index) => (
            <Box key={item.user_id}>
              <span>
                {item?.user.first_name} {item?.user.middle_name}{" "}
                {item?.user.last_name}
              </span>
              <Box
                key={item.user_id}
                bg="gray.100"
                borderColor="gray.300"
                borderRadius="10px"
                borderWidth="1px"
                pb="6"
              >
                <VStack
                  paddingLeft="16px"
                  paddingRight="16px"
                  paddingTop="16px"
                >
                  <VStack space="2" paddingTop="5">
                    <HStack alignItems="center" justifyContent="space-between">
                      <HStack space="md" alignItems="center">
                        <FrontEndTypo.H3>
                          {item?.academic_year?.name}
                        </FrontEndTypo.H3>
                      </HStack>

                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={() => {
                          navigate(`/learner/LearnerListView`);
                        }}
                        color="maroon.400"
                      />
                    </HStack>
                    <Divider orientation="horizontal" />
                  </VStack>
                </VStack>
              </Box>
            </Box>
          ))}
      </Box>
    </Layout>
  );
}

LearnerList.propTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
