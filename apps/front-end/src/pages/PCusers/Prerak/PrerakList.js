import {
  t,
  IconByName,
  PCusers_layout as Layout,
  FrontEndTypo,
  SelectStyle,
  CardComponent,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <CardComponent
            key={item?.id}
            _body={{ px: "3", py: "3" }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={() => navigate(`/prerak/PrerakProfileView/${item?.id}`)}
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
                <VStack alignItems="end" flex={[1]}>
                  <ChipStatus
                    w="fit-content"
                    status={item?.program_beneficiaries?.status}
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

  useEffect(() => {
    // Fetch data here and set it in state
    const fetchData = async () => {
      setLoadingList(true);
      // Simulating data fetch
      const fetchedData = [
        {
          id: "1",
          first_name: "John",
          middle_name: null,
          last_name: "Doe",
          mobile: "1234567890",
          program_beneficiaries: {
            status: "enrolled",
            enrollment_first_name: "John",
            enrollment_middle_name: null,
            enrollment_last_name: "Doe",
          },
          is_duplicate: false,
          is_deactivated: false,
        },
        {
          id: "2",
          first_name: "Jane",
          middle_name: "A.",
          last_name: "Smith",
          mobile: "0987654321",
          program_beneficiaries: {
            status: "identified",
            enrollment_first_name: "Jane",
            enrollment_middle_name: "A.",
            enrollment_last_name: "Smith",
          },
          is_duplicate: false,
          is_deactivated: false,
        },
        {
          id: "3",
          first_name: "David",
          middle_name: "Robin",
          last_name: "Dane",
          mobile: "9012345678",
          program_beneficiaries: {
            status: "enrolled",
            enrollment_first_name: "David",
            enrollment_middle_name: "Robin",
            enrollment_last_name: "Dane",
          },
          is_duplicate: false,
          is_deactivated: false,
        },
      ];
      setData(fetchedData);
      setLoadingList(false);
    };

    fetchData();
  }, []);

  return (
    <Layout
      analyticsPageTitle={"PRERAK_LIST"}
      _footer={{ menues: true }}
      pageTitle={t("PRERAK_LIST")}
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
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
        >
          <List data={data} />
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
