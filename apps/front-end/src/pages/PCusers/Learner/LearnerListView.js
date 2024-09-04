import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  PcuserService,
  SelectStyle,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import BeneficiaryCard from "component/Beneficiary/BeneficiaryCard";
import { Box, HStack, Select, Spinner, VStack } from "native-base";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";

export const List = ({ data, location }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack space="4" p="4" alignContent="center">
      {Array.isArray(data) && data?.length > 0 ? (
        data?.map((item) => (
          <BeneficiaryCard
            key={item?.id}
            item={{
              ...item,
              id: item?.user_id,
              program_beneficiaries: {
                status: item?.status,
                enrollment_first_name: item?.first_name,
                enrollment_middle_name: item?.middle_name,
                enrollment_last_name: item?.last_name,
              },
            }}
            onPress={() =>
              navigate(`/learners/list-view/${item?.user_id}`, {
                state: { filter: location?.state },
              })
            }
          />
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </VStack>
  );
};

List.propTypes = {
  data: PropTypes.array,
  location: PropTypes.any,
};

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function LearnerListView({ userTokenInfo }) {
  const [filter, setFilter] = useState();
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [bodyHeight, setBodyHeight] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const handleBack = () => {
    navigate(`/learners`, {
      state: { filter: location?.state },
    });
  };

  useEffect(() => {
    if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(bodyHeight - ref?.current?.clientHeight);
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingList(true);
      const filters = location?.state;
      const filterData = {
        limit: 6,
        facilitator_list: [
          {
            user_id: filters?.prerak_id,
            academic_year_id: filters?.academic?.academic_year_id,
            program_id: filters?.program_id,
          },
        ],
      };
      setFilter(filterData);

      const status = await benificiaryRegistoryService.getStatusList();
      setSelectStatus(status);
      setLoadingList(false);
    };

    fetchData();
  }, []);

  const getLearner = async (filters) => {
    const { currentPage, totalPages, error, ...result } =
      await PcuserService.getLearnerList(filters);
    if (!error) {
      setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
      if (filters.page <= 1) {
        setData(result?.data);
      } else {
        setData([...(data || []), ...(result?.data || [])]);
      }
    }
  };

  useEffect(() => {
    if (filter) getLearner(filter);
  }, [filter]);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      analyticsPageTitle={"LEARNER_LIST"}
      pageTitle={t("LEARNER_LIST")}
      _appBar={{
        onPressBackButton: handleBack,
      }}
      loading={loadingList}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <VStack ref={ref}>
        <HStack
          space="2"
          p="4"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex="2">
            <SelectStyle
              placeholder={t("STATUS_ALL")}
              selectedValue={filter?.status}
              overflowX="hidden"
              accessibilityLabel="Select a position for Menu"
              onValueChange={(nextValue) => {
                setFilter({ ...filter, status: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <IconByName name="ArrowDownSLineIcon" />,
              }}
            >
              <Select.Item label={t("ALL")} value={""} key={0} />
              {Array.isArray(selectStatus) &&
                selectStatus.map((option, index) => (
                  <Select.Item
                    value={option.value}
                    label={t(option.title)}
                    key={index || ""}
                  />
                ))}
            </SelectStyle>
          </Box>
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              placeholder={t("SORT_BY")}
              accessibilityLabel="Select a position for Menu"
              selectedValue={filter?.sortType ? filter?.sortType : ""}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, sortType: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "secondary.700",
              }}
            >
              {select2.map((option, index) => (
                <Select.Item
                  p="5"
                  key={index || ""}
                  label={t(option.label)}
                  value={option.value}
                />
              ))}
            </SelectStyle>
          </Box>
        </HStack>
      </VStack>
      <InfiniteScroll
        key={loadingHeight}
        height={loadingHeight}
        next={(e) =>
          setFilter({
            ...filter,
            page: (filter?.page ? filter?.page : 1) + 1,
          })
        }
        dataLength={data?.length}
        hasMore={hasMore}
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
        <List data={data} location={location} />
      </InfiniteScroll>
    </Layout>
  );
}

LearnerListView.propTypes = {
  userTokenInfo: PropTypes.any,
};
