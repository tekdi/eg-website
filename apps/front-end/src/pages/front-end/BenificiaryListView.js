import {
  facilitatorRegistryService,
  t,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
  SelectStyle,
  ImageView,
  Loading,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable, CheckIcon } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
const List = ({ data }) => {
  const navigate = useNavigate();
  return (
    <VStack space="4" p="4" alignContent="center">
      {(data && data?.length > 0) || data?.constructor?.name === "Array" ? (
        data &&
        data?.constructor?.name === "Array" &&
        data?.map((item) => (
          <VStack
            bg="white"
            p="2"
            shadow="FooterShadow"
            borderRadius="4px"
            space="2"
          >
            <Pressable
              onPress={async () => {
                navigate(`/beneficiary/${item?.id}`);
              }}
            >
              <HStack justifyContent="space-between">
                <HStack alignItems="Center" flex="5">
                  {item?.profile_photo_1?.id ? (
                    <ImageView
                      source={{
                        document_id: item?.profile_photo_1?.id,
                      }}
                      // alt="Alternate Text"
                      width={"45px"}
                      height={"45px"}
                    />
                  ) : (
                    <IconByName
                      isDisabled
                      name="AccountCircleLineIcon"
                      color="gray.300"
                      _icon={{ size: "50px" }}
                    />
                  )}
                  <VStack pl="2">
                    <FrontEndTypo.H3
                      bold
                      color="textGreyColor.800"
                      wordWrap="break-word"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      width="150px"
                    >
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
                <Box maxW="121px">
                  <ChipStatus
                    status={item?.program_beneficiaries?.status}
                    is_duplicate={item?.is_duplicate}
                    is_deactivate={item?.is_deactivate}
                    rounded={"sm"}
                  />
                </Box>
              </HStack>
            </Pressable>
            <VStack bg="white" pl="2">
              {item?.program_beneficiaries?.status === "identified" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("COMPLETE_THE_DOCUMENTATION")}
                  </FrontEndTypo.H4>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(`/beneficiary/${item?.id}/docschecklist`);
                    }}
                  />
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "enrollment_pending" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("CONTINUE_ENROLLMENT")}
                  </FrontEndTypo.H4>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(`/beneficiary/${item?.id}/docschecklist`);
                    }}
                  />
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "ready_to_enroll" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("ENTER_THE_ENROLLMENT_DETAILS")}
                  </FrontEndTypo.H4>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={() => {
                      navigate(`/beneficiary/${item?.id}/enrollmentdetails`);
                    }}
                  />
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "enrolled" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("FOLLOW_UP_WITH_IP")}
                  </FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "dropout" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4
                    color="blueText.450"
                    underline
                  ></FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "duplicated" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("FOLLOW_UP_WITH_IP_ASSIGNMENT")}
                  </FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status ===
                "enrolled_ip_verified" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("BENEFICIARY_STATUS_REGISTERED_IN_CAMP")}
                  </FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status === "rejected" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4
                    color="blueText.450"
                    underline
                  ></FrontEndTypo.H4>
                </HStack>
              )}

              {item?.program_beneficiaries?.status ===
                "ineligible_for_pragati_camp" && (
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4
                    color="blueText.450"
                    underline
                  ></FrontEndTypo.H4>
                </HStack>
              )}
            </VStack>
          </VStack>
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

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  const [service, setService] = React.useState("");
  const [sort, setSort] = React.useState("sort");
  const [sortValue, setSortValue] = React.useState("");
  const [statusValue, setStatusValue] = React.useState("");
  const [limit, setLimit] = React.useState(10);
  const [status, setStatus] = React.useState("status");
  const [data, setData] = React.useState();
  const [selectStatus, setSelectStatus] = React.useState([]);
  const [searchBenficiary, setSearchBenficiary] = React.useState("");
  const [loadingList, setLoadingList] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState();
  const [loadingHeight, setLoadingHeight] = React.useState(0);

  const fa_id = localStorage.getItem("id");
  React.useEffect(async () => {
    const data = await benificiaryRegistoryService.getStatusList();
    if (data.length > 0) {
      setSelectStatus(data);
    }
  }, []);

  React.useEffect(() => {
    const reqBody = {
      limit: limit,
      status: statusValue,
      sortType: sortValue,
      search: searchBenficiary,
    };
    aglist(reqBody);
  }, [limit, statusValue, sortValue, searchBenficiary]);
  const aglist = async (reqBody) => {
    const result = await benificiaryRegistoryService.getBeneficiariesList(
      reqBody
    );
    setTotalCount(result?.totalCount);
    if (!result?.error) {
      setLoadingList(false);
      setData(result?.data);
    } else {
      setData([]);
    }
  };

  const styles = {
    inforBox: {
      style: {
        background:
          "linear-gradient(75.39deg, rgba(255, 255, 255, 0) -7.58%, rgba(255, 255, 255, 0) -7.57%, rgba(255, 255, 255, 0.352337) -7.4%, #CAE9FF 13.31%, #CAE9FF 35.47%, #CAE9FF 79.94%, rgba(255, 255, 255, 0.580654) 103.6%, rgba(255, 255, 255, 0) 108.42%)",
      },
    },
  };

  const [record, setRecord] = React.useState(data);
  function handleFilter(e) {
    const newData = data.filter((row) => {
      return row.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecord(newData);
  }

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);
  const fetchMoreData = () => {
    if (limit >= totalCount) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setLimit((prevLimit) => prevLimit + 10);
    }, 500);
  };
  return (
    <Layout
      getBodyHeight={(e) => setLoadingHeight(e)}
      _appBar={{
        onlyIconsShow: ["userInfo"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setSearchBenficiary(value);
        },
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <VStack>
        <Pressable
          onPress={(e) => {
            [
              "pragati_mobilizer",
              "selected_prerak",
              "selected_for_training",
              "selected_for_onboarding",
            ].includes(facilitator.status) && navigate(`/beneficiary`);
          }}
        >
          <HStack
            p="5"
            space="5"
            // borderBottomWidth="1"
            {...styles.inforBox}
            alignItems="Center"
          >
            <IconByName
              isDisabled
              name="UserFollowLineIcon"
              _icon={{ size: "30px" }}
              onPress={(e) => {
                navigate("/beneficiary");
              }}
            />
            <VStack flex="0.8">
              <FrontEndTypo.H3
                bold
                color="textGreyColor.800"
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {t("ADD_MORE_AG")}
              </FrontEndTypo.H3>
            </VStack>
          </HStack>
        </Pressable>
      </VStack>
      <HStack
        justifyContent="space-between"
        space="2"
        alignItems="Center"
        p="4"
      >
        <Box flex="2">
          <SelectStyle
            overflowX="hidden"
            selectedValue={status}
            placeholder={t("STATUS_ALL")}
            onValueChange={(nextValue) => {
              setStatus(nextValue);
              setStatusValue(nextValue);
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
                  key={index}
                  label={t(option.title)}
                  value={option.value}
                />
              ))}
          </SelectStyle>
        </Box>
        <Box flex="2">
          <SelectStyle
            overflowX="hidden"
            selectedValue={sort}
            placeholder={t("SORT_BY")}
            onValueChange={(nextValue) => {
              setSort(nextValue);
              setSortValue(nextValue);
            }}
            _selectedItem={{
              bg: "secondary.700",
            }}
            accessibilityLabel="Select a position for Menu"
          >
            {select2.map((option, index) => (
              <Select.Item
                key={index}
                label={t(option.label)}
                value={option.value}
              />
            ))}
          </SelectStyle>
        </Box>
      </HStack>
      {!loadingList ? (
        <InfiniteScroll
          dataLength={data?.length || limit}
          next={fetchMoreData}
          hasMore={hasMore}
          height={loadingHeight}
          loader={<Loading />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>{t("COMMON_NO_MORE_RECORDS")}</b>
            </p>
          }
        >
          <List data={data} />
        </InfiniteScroll>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
