import {
  t,
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
  enumRegistryService,
  PcuserService,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable, Input } from "native-base";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

const List = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack space="4" p="4" alignContent="center">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <CardComponent
            key={item?.user_id}
            _body={{ px: "3", py: "3" }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={() =>
                navigate(`/prerak/PrerakProfileView/${item?.user_id}`)
              }
            >
              <HStack justifyContent="space-between" space={1}>
                <HStack alignItems="center" flex={[1, 2, 4]}>
                  <VStack alignItems="center" p="1">
                    <Chip>
                      <Clipboard text={item?.user_id}>
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
                      {item?.user?.first_name}
                      {item?.user?.middle_name &&
                        item?.user?.middle_name !== "null" &&
                        ` ${item.user?.middle_name}`}
                      {item?.user?.last_name &&
                        item?.last_name !== "null" &&
                        ` ${item.user?.last_name}`}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H5 color="textGreyColor.800">
                      {item?.user?.mobile}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <VStack alignItems="end" flex={[1]}>
                  <ChipStatus
                    w="fit-content"
                    status={item?.status}
                    is_duplicate={item?.is_duplicate}
                    is_deactivated={item?.is_deactivated}
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

const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

export default function PrerakList() {
  const [filter, setFilter] = useState({ limit: 6 });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [prerakList, setPrerakList] = React.useState();

  useEffect(() => {
    const getPrerakList = async () => {
      setLoadingList(true);
      try {
        const result = await PcuserService.getPrerakList();
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
        setPrerakList(result?.facilitator_data);
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching data:", error);

        setLoadingList(false);
      }
    };
    getPrerakList();
  }, [filter]);

  const handlePrerakChange = (values) => {
    setIsDisable(values.length === 0);
    setSelectedPrerak(values);
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
    >
      {/* <HStack justifyContent="start" alignItems="center" mt="2">
        <Input
          width={"97%"}
          size={"s"}
          minH="40px"
          maxH="40px"
          onScroll={false}
          InputLeftElement={
            <IconByName
              color="coolGray.500"
              name="SearchLineIcon"
              isDisabled
              pl="2"
            />
          }
          placeholder={t("SEARCH_BY_PRERAK_NAME")}
          variant="outline"
          onChange={debouncedHandleSearch}
          mx="auto"
        />
      </HStack> */}

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
  footerLinks: PropTypes.any,
};
