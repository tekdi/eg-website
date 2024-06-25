import {
  Box,
  CheckIcon,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { dataConfig } from "./card";

import {
  FrontEndTypo,
  H2,
  IconByName,
  Loading,
  OnestService,
} from "@shiksha/common-lib";

const consumptionTypes = [
  { label: "JOB_APPLICATIONS", value: "jobs" },
  { label: "SCHOLARSHIP_APPLICATIONS", value: "scholarship" },
  { label: "LEARNING_EXPERIENCES", value: "learning" },
];

const limit = 6;

export default function MyConsumptions({ userTokenInfo: { authUser } }) {
  const [type, setType] = useState("jobs");
  const [listData, setListData] = useState([]);
  const [config, setConfig] = useState();
  const [filter, setFilter] = useState();
  const [page, setPage] = useState(1);
  const ref = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListData = async () => {
      setLoading(t("FETCHING_THE_DETAILS"));
      try {
        const configData = dataConfig[type] || {};
        setConfig(configData);
        const userDataDetails = localStorage.getItem("userData");
        const userData = JSON.parse(userDataDetails);
        const data = {
          context: type,
          user_id: userData.user_id,
          limit,
          page,
        };
        let result = await OnestService.getList({ filters: data });
        if (result?.data) {
          setListData(result?.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListData();
  }, [type, filter]);

  const handleFilter = (key, value) => {
    setFilter((e) => ({
      ...e,
      [key]: value,
    }));
  };

  const onPressBackButton = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading message={loading} />;
  }

  const getWarningMessage = () => {
    const warningKey = {
      scholarship: "NO_SCHOLARSHIPS_APPLIED",
      jobs: "NO_JOBS_APPLIED",
      learning: "NO_LEARNINGS_SUBSCRIBED",
    }[type];
    return t(warningKey);
  };

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      _appBar={{
        onPressBackButton,
        leftIcon: <FrontEndTypo.H2>{t("PHOTOS")}</FrontEndTypo.H2>,
        onlyIconsShow: ["backBtn"],
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"VOUNTEER_PROFILE"}
      //   pageTitle={t("VOUNTEER")}
      //   stepTitle={t("PHOTOS")}
    >
      <VStack p="4" flexWrap="wrap" space={4}>
        <H2 color="textMaroonColor.400">{t("MY_CONSUMPTIONS")}</H2>
        <Box w="100%">
          <Select
            selectedValue={type}
            minWidth="200"
            accessibilityLabel="Choose Option"
            placeholder="Choose Option"
            _selectedItem={{
              bg: "cyan.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setType(itemValue)}
          >
            {consumptionTypes.map((item) => (
              <Select.Item
                key={item.value}
                label={t(item.label)}
                value={item.value}
              />
            ))}
          </Select>
        </Box>

        <HStack justify="space-between" align="center" ref={ref}>
          <Input
            flex={11}
            type="text"
            placeholder="Search by name..."
            onChange={(e) =>
              handleFilter(config?.searchByKey || "title", e.target.value)
            }
            InputRightElement={
              <IconByName
                color="grey.100"
                name="SearchLineIcon"
                marginRight={2}
              />
            }
          />
        </HStack>
      </VStack>

      <Text p={4} fontSize={"16px"} fontWeight={"500"}>
        {t(dataConfig[type].title)}
      </Text>
      <VStack flexWrap="wrap" space={4}>
        <VStack space="4" alignContent="center" p="4">
          {listData?.length ? (
            listData?.map((e) => (
              <RenderCards key={e} obj={e} config={config} />
            ))
          ) : (
            <FrontEndTypo.H2>{getWarningMessage()}</FrontEndTypo.H2>
          )}
          {/* {listData?.length > 0 && (
            <FrontEndTypo.Primarybutton onPress={(e) => fetchData(1)}>
              {t("NEXT")}
            </FrontEndTypo.Primarybutton>
          )}
          {page > 1 && listData?.length > 0 && (
            <FrontEndTypo.Primarybutton onPress={(e) => fetchData(-1)}>
              {t("BACK")}
            </FrontEndTypo.Primarybutton>
          )} */}
        </VStack>
      </VStack>
    </Layout>
  );
}

const StyledChip = ({ label }) => (
  <Box
    px={2}
    py={1}
    rounded="md"
    bg="primary.700"
    alignSelf="flex-start"
    _text={{
      color: "white",
      fontWeight: "bold",
    }}
  >
    <HStack spacing={2} alignItems="center">
      <Text>{label}</Text>
    </HStack>
  </Box>
);

const RenderCards = ({ obj, config }) => {
  const navigate = useNavigate();
  return (
    <Box
      width={"100%"}
      p="6"
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="10px"
      backgroundColor="white"
      shadow="4"
    >
      {config.title === "LEARNING_EXPERIENCES" ? (
        <VStack space={4}>
          <Text fontSize={"16px"} fontWeight={600}>
            {obj?.item_name}
          </Text>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {obj?.provider_name}
            </Text>
          </HStack>
        </VStack>
      ) : (
        <VStack space={4}>
          <Text fontSize={"16px"} fontWeight={600}>
            {obj?.item_name}
          </Text>
          <StyledChip label={obj?.status} />
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {obj?.provider_name}
            </Text>
          </HStack>
          <FrontEndTypo.Primarybutton
            onPress={() => {
              navigate(`/${config?.listLink}/${obj?.context_item_id}`);
            }}
          >
            Sync Aplication Status
          </FrontEndTypo.Primarybutton>
        </VStack>
      )}
    </Box>
  );
};
