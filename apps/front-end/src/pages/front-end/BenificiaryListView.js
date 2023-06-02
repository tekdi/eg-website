import {
  BodySmall,
  facilitatorRegistryService,
  H2,
  t,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  benificiaryEnumService
} from "@shiksha/common-lib";
import Chip, { ChipStatus } from "component/Chip";
import { HStack, VStack, Box, Text, Select, Image, Pressable } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

const List = ({ data }) => {

  const navigate = useNavigate();
  return (
    <VStack space="10" paddingLeft="4%" paddingTop="10%" paddingRight="4%">
      {data && data.length <= 0 ? (
        <H2>{t("DATA_NOT_FOUND")}</H2>
      ) : (
        data &&
        data?.map((item) => (
          <Pressable
            onPress={async () => {
              navigate(`/beneficiary/profile/${item?.id}`)
            }}>
            <HStack alignItems="Center" justifyContent="space-between">
              <HStack alignItems="Center" justifyContent="space-between">
                <IconByName name="UserAddLineIcon" />
                <VStack>
                  <Text bold

                  >

                    {item?.first_name}
                    {item.last_name && ` ${item.last_name}`}
                  </Text>
                  <Text>{item?.mobile}</Text>
                </VStack>
              </HStack>
              <ChipStatus status={"screened"}>
                <Chip>{item?.program_beneficiaries?.[0]?.status || "nothing"}</Chip>
              </ChipStatus>
            </HStack>
          </Pressable>
        ))
      )}
    </VStack>
  );
};
const select2 = [
  { label: "asc", value: "asc" },
  { label: "desc", value: "desc" }
];

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  const [service, setService] = React.useState("");
  const [sort, setSort] = React.useState("sort");
  const [sortValue, setSortValue] = React.useState("desc")
  const [statusValue, setStatusValue] = React.useState("")
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [reqBodyData, setReqBodyData] = React.useState();
  const [status, setStatus] = React.useState("status");
  const [data, setData] = React.useState();
  const [selectStatus, setSelectStatus] = React.useState([])
  const [searchBenficiary, setSearchBenficiary] = React.useState("")


  React.useEffect(async () => {
    const data = await benificiaryEnumService.getStatusList()
    setSelectStatus(data)
  }, [])
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
      search: reqBodyData.searchBenficiary
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
          setSearchBenficiary(value)
        }
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="gray.200">
        <VStack>
          <HStack
            p="5"
            space="5"
            borderBottomWidth="1"
            borderBottomColor={"gray.300"}
            bg={{
              backgroundImage: 'linear-gradient(75.39deg, rgba(255, 255, 255, 0) -7.58%, rgba(255, 255, 255, 0) -7.57%, rgba(255, 255, 255, 0.352337) -7.4%, #CAE9FF 13.31%, #CAE9FF 35.47%, #CAE9FF 79.94%, rgba(255, 255, 255, 0.580654) 103.6%, rgba(255, 255, 255, 0) 108.42%)',
            }}
            alignItems="Center"
          >
            <IconByName
              flex="0.1"
              isDisabled
              name="UserAddLineIcon"
              _icon={{ size: "50%" }}
            />
            <VStack flex="0.9">
              <H2
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >

                {t("ADD_MORE_AG")}
              </H2>
              <BodySmall
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {t("ENROLL_15_OR_MORE")}
              </BodySmall>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
      <HStack
        justifyContent="space-between"
        paddingTop="15%"
        paddingLeft="1%"
        paddingRight="1%"
        alignItems="Center"
      >
        <Box>
          <Select
            variant="rounded"
            overflowX="hidden"
            width="70%"
            height="50%"
            selectedValue={status}
            placeholder="Status:All"
            onValueChange={(nextValue) => {
              setStatus(nextValue)
              setStatusValue(nextValue)
            }}
            _selectedItem={{
              bg: "cyan.600",
            }}
            accessibilityLabel="Select a position for Menu"
          >
            <Select.Item
              key={0}
              label={t('BENEFICIARY_ALL')}
              value={''}
            />
            {selectStatus?.map((option, index) => (
              <Select.Item
                key={index}
                label={`${t(option.title)}`}
                value={option.value}
              />
            ))}
          </Select>
        </Box>
        <Box
        >
          <Select
            overflowX="hidden"
            variant="rounded"
            width="50%"
            height="50%"
            selectedValue={sort}
            placeholder="Sort By"
            onValueChange={(nextValue) => {
              setSort(nextValue)
              setSortValue(nextValue)

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
