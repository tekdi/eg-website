import {
  FrontEndTypo,
  H2,
  IconByName,
  Loading,
  OnestService,
} from "@shiksha/common-lib";
import Chip from "component/Chip";
import { debounce } from "lodash";
import { Box, HStack, Input, VStack } from "native-base";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import { dataConfig } from "./card";

const consumptionTypes = [
  { label: "JOB_APPLICATIONS", value: "jobs" },
  { label: "SCHOLARSHIP_APPLICATIONS", value: "scholarship" },
  { label: "LEARNING_EXPERIENCES", value: "learning" },
];

const limit = 6;

export default function MyConsumptions({
  userTokenInfo: { authUser },
  footerLinks,
}) {
  const params = useParams();
  const [type, setType] = useState("");
  const [listData, setListData] = useState([]);
  const [config, setConfig] = useState();
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ref = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.type) {
      setType(params.type);
    }
  }, [params.type]);

  useEffect(() => {
    if (type) {
      fetchListData();
    }
  }, [type, filter, page]);

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
      };
      let result = await OnestService.getList({
        filters: { ...data, ...filter },
        limit,
        page,
      });
      if (result?.data) {
        setListData(result?.data);
        setTotalPages(result?.totalPages ? parseInt(result?.totalPages) : 1);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleFilter = useCallback(
    debounce((field, value) => {
      setFilter((e) => ({
        ...e,
        [field]: { _ilike: `%${value}%` },
      }));
    }, 2000),
    []
  );

  const onPressBackButton = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading message={loading} />;
  }

  const getWarningMessage = () => {
    if (filter == undefined || {}) {
      return t("NO_data_available");
    }
    const warningKey = {
      scholarship: "NO_SCHOLARSHIPS_APPLIED",
      jobs: "NO_JOBS_APPLIED",
      learning: "NO_LEARNINGS_SUBSCRIBED",
    }[type];
    return t(warningKey);
  };

  const cleatFilters = () => {
    setFilter({});
    setPage(1);
    setType(params?.type);
  };

  return (
    <Layout
      _footer={{ menues: footerLinks }}
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
      pageTitle={t("VOUNTEER")}
      stepTitle={t("MY_CONSUMPTIONS")}
    >
      <VStack p="4" flexWrap="wrap" space={4}>
        <H2 color="textMaroonColor.400">{t("MY_CONSUMPTIONS")}</H2>
        {/* <Box w="100%">
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
        </Box> */}

        <HStack justify="space-between" align="center" ref={ref} space={2}>
          <Input
            flex={11}
            type="text"
            placeholder="Search by name..."
            onChange={(e) => debouncedHandleFilter("item_name", e.target.value)}
            InputRightElement={
              <IconByName
                color="grey.100"
                name="SearchLineIcon"
                marginRight={2}
              />
            }
          />
          {filter == {} ? null : (
            <FrontEndTypo.Primarybutton size="sm" onPress={cleatFilters}>
              {t("CLEAR_FILTER")}
            </FrontEndTypo.Primarybutton>
          )}
        </HStack>
      </VStack>

      <FrontEndTypo.H1 p={4}>{t(dataConfig[type].title)}</FrontEndTypo.H1>
      <VStack flexWrap="wrap" space={4}>
        <VStack space="4" alignContent="center" p="4">
          {listData?.length ? (
            listData?.map((e) => (
              <RenderCards key={e.context_item_id} obj={e} config={config} />
            ))
          ) : (
            <FrontEndTypo.H2>{getWarningMessage()}</FrontEndTypo.H2>
          )}
          {totalPages > page && (
            <FrontEndTypo.Primarybutton onPress={() => setPage(page + 1)}>
              {t("NEXT")}
            </FrontEndTypo.Primarybutton>
          )}
          {page > 1 && page <= totalPages && (
            <FrontEndTypo.Primarybutton onPress={() => setPage(page - 1)}>
              {t("BACK")}
            </FrontEndTypo.Primarybutton>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}

const RenderCards = ({ obj, config }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <FrontEndTypo.H1>{obj?.item_name}</FrontEndTypo.H1>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="BuildingFillIcon" />
            <FrontEndTypo.H2 color="gray.700" fontWeight="400">
              {obj?.provider_name}
            </FrontEndTypo.H2>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <FrontEndTypo.H2 color="gray.700">{t("ITEM")}</FrontEndTypo.H2>
            <FrontEndTypo.H2 fontWeight="400" color="gray.700">
              {obj?.context_item_id}
            </FrontEndTypo.H2>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <FrontEndTypo.H2 color="gray.700">{t("ORDER")}</FrontEndTypo.H2>
            <FrontEndTypo.H2 color="gray.700">{obj?.order_id}</FrontEndTypo.H2>
          </HStack>
        </VStack>
      ) : (
        <VStack space={4}>
          <FrontEndTypo.H1>{obj?.item_name}</FrontEndTypo.H1>
          <HStack>
            <Chip label={obj?.status} py="2" px="4" />
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="BuildingFillIcon" />
            <FrontEndTypo.H2 color="gray.700" fontWeight="400">
              {obj?.provider_name}
            </FrontEndTypo.H2>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <FrontEndTypo.H2 color="gray.700">{t("ITEM")}</FrontEndTypo.H2>
            <FrontEndTypo.H2 fontWeight="400" color="gray.700">
              {obj?.context_item_id}
            </FrontEndTypo.H2>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <FrontEndTypo.H2 color="gray.700">{t("ORDER")}</FrontEndTypo.H2>
            <FrontEndTypo.H2 color="gray.700">{obj?.order_id}</FrontEndTypo.H2>
          </HStack>
          <FrontEndTypo.Primarybutton
            onPress={() => {
              navigate(`/${config?.listLink}/${obj?.context_item_id}`);
            }}
          >
            {t("SYNC_APPLICATION_STATUS")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      )}
    </Box>
  );
};
