import {
  BodySmall,
  facilitatorRegistryService,
  H2,
  IconByName,
  Layout,
} from "@shiksha/common-lib";
import Chip, { ChipStatus } from "component/Chip";
import { HStack, VStack, Box, Text, Select, Image } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

const List = ({ data }) => {
  console.log("data", data);
  return (
    <VStack space="10" paddingLeft="4" paddingTop="10" paddingRight="4">
      {data && data.length <= 0 ? (
        <H2>data not found</H2>
      ) : (
        data &&
        data?.map((item) => (
          <HStack alignItems="Center" justifyContent="space-between">
            <HStack alignItems="Center" justifyContent="space-between">
              <IconByName name="UserAddLineIcon" />
              <VStack>
                <Text>
                  {item?.first_name}
                  {item.last_name && ` ${item.last_name}`}
                </Text>
                <Text>{item?.mobile}</Text>
              </VStack>
            </HStack>
            <Chip>{item?.beneficiaries?.[0]?.enrollment_status}</Chip>
          </HStack>
        ))
      )}
    </VStack>
  );
};

const select1 = [
  { label: "Status :", value: "status" },
  { label: "Identified :", value: "identified" },
  { label: "Documented", value: "documented" },
  { label: "Enrolled", value: "enrolled" },
  { label: "Approved", value: "approved" },
];

const select2 = [
  { label: "sort", value: "sort" },
  { label: "Top Left", value: "top left" },
  { label: "Top", value: "top" },
  { label: "Top Right", value: "top right" },
  { label: "Right Top", value: "right top" },
  { label: "Right", value: "right" },
  { label: "Right Bottom", value: "right bottom" },
  { label: "Bottom Left", value: "bottom left" },
  { label: "Bottom", value: "bottom" },
  { label: "Bottom Right", value: "bottom right" },
  { label: "Left Top", value: "left top" },
  { label: "Left", value: "left" },
  { label: "Left Bottom", value: "left bottom" },
];

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  const [service, setService] = React.useState("");
  const [sort, setSort] = React.useState("sort");
  const [status, setStatus] = React.useState("status");
  const [data, setData] = React.useState();

  React.useEffect(() => {
    aglist();
  }, []);

  const aglist = async () => {
    let reqBody = {
      page: "1",
      limit: "10",
      status: "applied",
      sortType: "desc",
    };
    const result = await facilitatorRegistryService.getBeneficiariesDetails(
      reqBody
    );
    console.log("result", result);
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
    AddAnAgShadowBox: {
      style: {
        boxShadow: "2px 3px 0px #790000",
        border: "1px solid #790000",
        borderRadius: "10px",
        padding: "50px",
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
            bg="info.200"
            {...styles.inforBox}
            alignItems="Center"
          >
            <IconByName
              flex="0.1"
              isDisabled
              name="UserAddLineIcon"
              _icon={{ size: "25px" }}
            />
            <VStack flex="0.9">
              <H2
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                Add more AGs
              </H2>
              <BodySmall
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                You need to Enroll 15 or more AG Learners to set up a viable
                camp
              </BodySmall>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
      <HStack
        justifyContent="space-between"
        paddingTop="20"
        paddingLeft="4"
        paddingRight="4"
        alignItems="Center"
      >
        <Box>
          <Select
            variant="rounded"
            overflowX="hidden"
            width="204px"
            height="42px"
            selectedValue={status}
            onValueChange={(nextValue) => setStatus(nextValue)}
            _selectedItem={{
              bg: "cyan.600",
            }}
            accessibilityLabel="Select a position for Menu"
          >
            {select1.map((option, index) => (
              <Select.Item
                key={index}
                label={option.label}
                value={option.value}
              />
            ))}
          </Select>
        </Box>
        <Box>
          <Select
            overflowX="hidden"
            variant="rounded"
            width="108px"
            height="42"
            selectedValue={sort}
            onValueChange={(nextValue) => setSort(nextValue)}
            _selectedItem={{
              bg: "cyan.600",
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
