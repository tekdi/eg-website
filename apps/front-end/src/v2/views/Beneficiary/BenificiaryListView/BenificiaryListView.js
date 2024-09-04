import {
  FrontEndTypo,
  IconByName,
  Layout,
  SelectStyle,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import BeneficiaryCard from "component/Beneficiary/BeneficiaryCard";
import { debounce } from "lodash";
import { Box, HStack, Input, Select, Spinner, VStack } from "native-base";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function BenificiaryListView({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ limit: 6 });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const refButton = useRef(null);

  const state_name =
    JSON.parse(localStorage.getItem("program"))?.state_name || "";

  const academic_year_name =
    JSON.parse(localStorage.getItem("academic_year"))?.academic_year_name || "";

  useEffect(async () => {
    let data = await benificiaryRegistoryService.getStatusList();
    if (data.length > 0) {
      setSelectStatus(data);
      if (state_name !== "RAJASTHAN") {
        data = data?.filter(
          (e) =>
            ![
              "sso_id_enrolled",
              "sso_id_verified",
              "registered_in_neev_camp",
            ].includes(e.value),
        );
      }
      setSelectStatus(data);
    }
  }, []);

  useEffect(() => {
    if (
      (ref?.current?.clientHeight >= 0 ||
        refButton?.current?.clientHeight >= 0) &&
      bodyHeight >= 0
    ) {
      setLoadingHeight(
        parseInt(bodyHeight || 0) -
          parseInt(ref?.current?.clientHeight || 0) -
          parseInt(refButton?.current?.clientHeight || 0),
      );
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  useEffect(async () => {
    const { search } = filter;
    setSearch(search);
    if (filter?.page < 2) {
      setLoadingList(true);
    }
    const { currentPage, totalPages, error, ...result } =
      await benificiaryRegistoryService.getBeneficiariesList(filter);
    if (!error) {
      setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
      if (filter?.page > 1) {
        setData([...data, ...(result.data || [])]);
      } else {
        setData(result.data || []);
      }
    } else {
      setData([]);
    }
    setLoadingList(false);
  }, [filter]);

  const handleSearch = (value) => {
    setSearch(value);
    setFilter({ ...filter, search: value, page: 1 });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), []);

  const showAddLearner = () => {
    return (
      !(
        state_name === "RAJASTHAN" &&
        (academic_year_name.includes("2023-2024") ||
          academic_year_name.includes("2023-24"))
      ) &&
      [
        "pragati_mobilizer",
        "selected_prerak",
        "selected_for_training",
        "selected_for_onboarding",
      ].includes(localStorage.getItem("status"))
    );
  };

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn", "langBtn"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({ ...filter, search: value, page: 1 });
        },
        _box: { bg: "white", shadow: "appBarShadow" },
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser || {}}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY_LIST"}
      pageTitle={t("BENEFICIARY_LIST")}
    >
      <VStack ref={ref} space={"4"}>
        <FrontEndTypo.H1 fontWeight="600" mx="4" my="6" mb="0">
          {t("LEARNER_LIST")}
        </FrontEndTypo.H1>
        <HStack space={2} px={4}>
          <Input
            value={search}
            width={"100%"}
            borderColor={"gray.300"}
            placeholder={t("SEARCH_BY_NAME")}
            onChangeText={debouncedHandleSearch}
            InputRightElement={
              <IconByName color="grayTitleCard" name="SearchLineIcon" mr="2" />
            }
          />
        </HStack>

        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="Center"
          px="4"
        >
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              dropdownIcon={
                <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
              }
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
              dropdownIcon={
                <IconByName color="grayTitleCard" name="ArrowDownSFillIcon" />
              }
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
      </VStack>

      {!loadingList ? (
        <InfiniteScroll
          key={loadingHeight}
          dataLength={data?.length}
          next={(e) =>
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            })
          }
          hasMore={hasMore}
          height={loadingHeight}
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
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          // below props only if you need pull down functionality
          pullDownToRefreshThreshold={50}
        >
          <VStack space="4" p="4" alignContent="center">
            {(data && data?.length > 0) ||
            data?.constructor?.name === "Array" ? (
              data &&
              data?.constructor?.name === "Array" &&
              data?.map((item) => (
                <BeneficiaryCard
                  key={item?.id}
                  item={item}
                  onPress={async () => {
                    navigate(`/beneficiary/${item?.id}`);
                  }}
                  onPressDocCheckList={() => {
                    navigate(`/beneficiary/edit/${item?.id}/docschecklist`);
                  }}
                  onPressRnroll={() => {
                    navigate(`/beneficiary/${item?.id}/enrollmentdetails`);
                  }}
                />
              ))
            ) : (
              <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
            )}
          </VStack>
        </InfiniteScroll>
      ) : (
        <Spinner
          accessibilityLabel="Loading posts"
          color="bgRed.500"
          size="lg"
        />
      )}

      {showAddLearner() && (
        <HStack
          ref={refButton}
          width={"100%"}
          bg={"white"}
          flex={1}
          safeAreaTop
          position="fixed"
          bottom="70px"
          zIndex={"9999999"}
        >
          <FrontEndTypo.Secondarybutton
            onPress={(e) => navigate(`/beneficiary`)}
            mx="auto"
            my="2"
          >
            {t("ADD_MORE_AG")}
          </FrontEndTypo.Secondarybutton>
        </HStack>
      )}
    </Layout>
  );
}

BenificiaryListView.propTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
