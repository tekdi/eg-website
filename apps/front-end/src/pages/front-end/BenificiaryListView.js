import {
  facilitatorRegistryService,
  t,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import Chip, { ChipStatus } from "component/Chip";
import { HStack, VStack, Box, Select, Pressable } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

const List = ({ data }) => {
  const navigate = useNavigate();
  return (
    <VStack space="4" p="5" alignContent="center" bg="bgGreyColor.200">
      {data && data.length <= 0 ? (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      ) : (
        data &&
        data?.map((item) => (
          <Pressable
            onPress={async () => {
              navigate(`/beneficiary/${item?.id}`);
            }}
          >
            <VStack
              bg="white"
              p="2"
              shadow="FooterShadow"
              borderRadius="4px"
              space="2"
            >
              <HStack justifyContent="space-between">
                <HStack alignItems="Center" justifyContent="space-between">
                  <IconByName
                    name="AccountCircleLineIcon"
                    _icon={{ size: "40px", color: "textGreyColor.900" }}
                  />
                  <VStack>
                    <FrontEndTypo.H3 bold color="textGreyColor.800">
                      {item?.first_name}
                      {item?.last_name && ` ${item.last_name}`}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H5 color="textGreyColor.800">
                      {item?.mobile}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <ChipStatus status={"screened"} pt="3">
                  <FrontEndTypo.H3 bold>{item?.program_beneficiaries?.[0]?.status || "nothing"}</FrontEndTypo.H3>
                </ChipStatus>
              </HStack>
              <VStack bg="white" pl="2">
                <HStack color="blueText.450" alignItems="center">
                  <FrontEndTypo.H4 color="blueText.450" underline>
                    {t("CHECK_DOCUMENTS")}
                  </FrontEndTypo.H4>
                  <IconByName name="ArrowRightSLineIcon" />
                </HStack>
              </VStack>
            </VStack>
          </Pressable>
        ))
      )}
    </VStack>
  );
};
const select2 = [
  { label: "asc", value: "asc" },
  { label: "desc", value: "desc" },
];

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  const [service, setService] = React.useState("");
  const [sort, setSort] = React.useState("sort");
  const [sortValue, setSortValue] = React.useState("desc");
  const [statusValue, setStatusValue] = React.useState("");
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [reqBodyData, setReqBodyData] = React.useState();
  const [status, setStatus] = React.useState("status");
  const [data, setData] = React.useState();
  const [selectStatus, setSelectStatus] = React.useState([]);
  const [searchBenficiary, setSearchBenficiary] = React.useState("");

  React.useEffect(async () => {
    const data = await benificiaryRegistoryService.getStatusList();
    setSelectStatus(data);
  }, []);
  React.useEffect(() => {
    setReqBodyData({ page, limit, statusValue, sortValue, searchBenficiary });
  }, [page, limit, statusValue, sortValue, searchBenficiary]);
  React.useEffect(() => {
    aglist(reqBodyData);
  }, [reqBodyData]);
  const aglist = async (reqBodyData) => {
    let reqBody = {
      page: reqBodyData.page,
      limit: reqBodyData.limit,
      status: reqBodyData.statusValue,
      sortType: reqBodyData.sortValue,
      search: reqBodyData.searchBenficiary,
    };
    const result = await benificiaryRegistoryService.getBeneficiariesList(
      reqBody
    );
    if (!result?.error) {
      setData(result);
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
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["userInfo"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setSearchBenficiary(value);
        },
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="gray.200">
        <VStack>
          <HStack
            p="5"
            space="5"
            borderBottomWidth="1"
            {...styles.inforBox}
            alignItems="Center"
          >
            <IconByName
              isDisabled
              name="UserFollowLineIcon"
              _icon={{ size: "30px" }}
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
              <FrontEndTypo.H4
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {t("ENROLL_15_OR_MORE")}
              </FrontEndTypo.H4>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
      <HStack justifyContent="space-between" alignItems="Center" m="4">
        <Box my="3">
          <Select
            borderWidth="1px"
            borderColor="textMaroonColor.400"
            color="textMaroonColor.400"
            bold
            borderRadius="30px"
            shadow="RedOutlineShadow"
            overflowX="hidden"
            width="50%"
            selectedValue={status}
            placeholder="Status:All"
            onValueChange={(nextValue) => {
              setStatus(nextValue);
              setStatusValue(nextValue);
            }}
            _selectedItem={{
              bg: "cyan.600",
            }}
            accessibilityLabel="Select a position for Menu"
          >
            <FrontEndTypo.H5>
              <Select.Item key={0} label={t("BENEFICIARY_ALL")} value={""} />
              {selectStatus?.map((option, index) => (
                <Select.Item
                  key={index}
                  label={`${t(option.title)}`}
                  value={option.value}
                />
              ))}
            </FrontEndTypo.H5>
          </Select>
        </Box>
        <Box>
          <Select
            borderWidth="1px"
            borderColor="textMaroonColor.400"
            color="textMaroonColor.400"
            bold
            borderRadius="30px"
            shadow="RedOutlineShadow"
            overflowX="hidden"
            width="42%"
            selectedValue={sort}
            placeholder="Sort By"
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
                label={option.label}
                value={option.value}
              />
            ))}
          </Select>
        </Box>
      </HStack>
      <List data={data} />
    </Layout>
  );
}
