import {
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
  PcuserService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const List = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack space="4" p="4" alignContent="center">
      {Array.isArray(data) && data?.length > 0 ? (
        data?.map((item) => (
          <CardComponent
            key={item?.id}
            _body={{ px: "3", py: "3" }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={() =>
                navigate(`/learner/learnerListView/${item?.user_id}`, {
                  state: { filter: location?.state },
                })
              }
            >
              <HStack justifyContent="space-between" space={1}>
                <HStack alignItems="center" flex={[1, 2, 4]}>
                  <VStack alignItems="center" p="1">
                    <Chip>
                      <Clipboard text={item?.id}>
                        <FrontEndTypo.H2 bold>{item?.user_id}</FrontEndTypo.H2>
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
                      {item?.enrollment_number}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <VStack alignItems="end" flex={[1]}>
                  <ChipStatus
                    w="fit-content"
                    status={item?.status}
                    rounded={"sm"}
                  />
                </VStack>
              </HStack>
            </Pressable>
          </CardComponent>
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
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

export default function LearnerListView() {
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
    if (filters) {
      const data = await PcuserService.getLearnerList(filters);
      setData(data);
    }
  };

  useEffect(() => {
    getLearner(filter);
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
    >
      <VStack ref={ref}>
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
              <Select.Item key={0} label={t("ALL")} value={""} />
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
      </VStack>
      {!loadingList && (
        <InfiniteScroll
          dataLength={data?.length}
          // next={() =>
          //   setFilter({
          //     ...filter,
          //     page: (filter?.page ? filter?.page : 1) + 1,
          //   })
          // }
          hasMore={hasMore}
          height={loadingHeight}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
        >
          <List data={data} location={location} />
        </InfiniteScroll>
      )}
    </Layout>
  );
}
