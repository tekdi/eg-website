import {
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
  enumRegistryService,
  PcuserService,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ChipStatus } from "component/Chip";

const List = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack space="4" p="4" alignContent="center">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <Pressable
            onPress={() =>
              navigate(`/prerak/PrerakProfileView/${item?.user_id}`)
            }
            key={item?.user_id}
          >
            <CardComponent
              _body={{ px: "3", pt: "3", pb: 3 }}
              _vstack={{ p: 0, space: 0, flex: 1 }}
            >
              <HStack justifyContent="space-between" space={1}>
                <HStack alignItems="center" flex={[4, 2, 1]}>
                  <Chip>
                    <Clipboard text={item?.user_id}>
                      <FrontEndTypo.H2 bold>{item?.user_id}</FrontEndTypo.H2>
                    </Clipboard>
                  </Chip>
                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <FrontEndTypo.H3 bold color="textGreyColor.800">
                      {[
                        item?.user?.first_name,
                        item?.user?.middle_name,
                        item?.user?.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H5 color="textGreyColor.800">
                      {item?.user?.mobile}
                    </FrontEndTypo.H5>

                    <FrontEndTypo.H5 color="textGreyColor.800">
                      {item?.academic_year?.name}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <VStack alignItems="end" flex={[2, 1, 1]}>
                  <ChipStatus
                    py="1"
                    px="1"
                    w="fit-content"
                    status={item?.status}
                    is_duplicate={item?.is_duplicate}
                    is_deactivated={item?.is_deactivated}
                    rounded={"sm"}
                  />
                </VStack>
              </HStack>
            </CardComponent>
          </Pressable>
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </VStack>
  );
};

List.propTypes = {
  data: PropTypes.array,
};

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function PrerakList({ userTokenInfo }) {
  const [filter, setFilter] = useState({ limit: 6 });
  const [selectStatus, setSelectStatus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const { t } = useTranslation();
  const [prerakList, setPrerakList] = React.useState();
  const [cohorts, setCohorts] = React.useState();

  useEffect(() => {
    const getPrerakList = async () => {
      setLoadingList(true);
      try {
        const result = await PcuserService.getPrerakList();
        const program_id =
          userTokenInfo?.authUser?.program_users?.[0]?.program_id;
        const cohortResult = await PcuserService.getAcademicYear({
          program_id,
        });
        setCohorts(cohortResult);
        setPrerakList(result?.facilitator_data);

        const data = await enumRegistryService.listOfEnum();
        setSelectStatus(data?.data ? data?.data?.FACILITATOR_STATUS : {});

        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching data:", error);

        setLoadingList(false);
      }
    };
    getPrerakList();
  }, []);

  useEffect(() => {
    const getPrerakList = async () => {
      setLoadingList(true);
      try {
        const result = await PcuserService.getPrerakList(filter);
        if (result?.facilitator_data?.length == 0) {
          setHasMore(false);
        }
        setPrerakList(result?.facilitator_data);
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingList(false);
      }
    };
    getPrerakList();
  }, [filter]);

  return (
    <Layout
      getBodyHeight={(e) => setLoadingHeight(e)}
      analyticsPageTitle={"PRERAK_LIST"}
      _footer={{ menues: true }}
      pageTitle={t("PRERAK_LIST")}
      _appBar={{
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({
            ...filter,
            search: value,
            page: 1,
          });
        },
      }}
      facilitator={userTokenInfo?.authUser || {}}
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
              <Select.Item key={0} label={t("PRERAK_ALL")} value={""} />
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
              selectedValue={filter?.academic_year_id}
              placeholder={t("SELECT_COHORT_INFO")}
              onValueChange={(nextValue) => {
                if (nextValue == "") {
                  const { academic_year_id, ...otherFilter } = filter;
                  setFilter({ ...otherFilter, page: 1 });
                } else {
                  setFilter({
                    ...filter,
                    academic_year_id: nextValue,
                    page: 1,
                  });
                }
              }}
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <IconByName name="ArrowDownSLineIcon" />,
              }}
              accessibilityLabel="Select a position for Menu"
            >
              <Select.Item key={0} label={t("COHORT_ALL")} value={""} />
              {Array.isArray(cohorts) &&
                cohorts.map((option, index) => (
                  <Select.Item
                    key={index || ""}
                    label={t(option.name)}
                    value={option.academic_year_id}
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
      {!loadingList ? (
        <InfiniteScroll
          dataLength={prerakList?.length || 0}
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
              {prerakList?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
        >
          <List data={prerakList} />
        </InfiniteScroll>
      ) : (
        // Loading component here if needed
        <></>
      )}
    </Layout>
  );
}

PrerakList.propTypes = {
  userTokenInfo: PropTypes.any,
};
