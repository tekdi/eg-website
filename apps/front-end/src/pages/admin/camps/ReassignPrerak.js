import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  ImageView,
  FrontEndTypo,
  tableCustomStyles,
  campService,
  useWindowSize,
  facilitatorRegistryService,
  BodyMedium,
  geolocationRegistryService,
  getOptions,
  setFilterLocalStorage,
  getFilterLocalStorage,
} from "@shiksha/common-lib";
import {
  Box,
  HStack,
  Modal,
  VStack,
  ScrollView,
  useToast,
  Alert,
  Stack,
  Button,
  Input,
} from "native-base";
import Form from "@rjsf/core";
import { ChipStatus } from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { MultiCheck } from "component/BaseInput";
import validator from "@rjsf/validator-ajv8";
import { debounce } from "lodash";

const columns = (navigate, t, setModal) => [
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.id,
    sortable: true,
    attr: "PRERAK_ID",
  },
  {
    name: t("PRERAK"),
    selector: (row) => row?.first_name + " " + row?.last_name,
    sortable: true,
    attr: "PRERAK",
  },
  {
    name: t("DISTRICT"),
    selector: (row) => (row?.district ? row?.district : "-"),
    sortable: true,
    attr: "DISTRICT",
  },
  {
    name: t("BLOCK"),
    selector: (row) => (row?.block ? row?.block : "-"),
    sortable: true,
    attr: "BLOCK",
  },
  {
    name: t("LEARNER_COUNT"),
    selector: (row) =>
      row?.sum_camp_learner_count ? row?.sum_camp_learner_count : "0",
    sortable: true,
    wrap: true,
    attr: "LEARNER_COUNT",
  },
  {
    name: t("CAMP_COUNT"),
    selector: (row) =>
      row?.camp_count?.aggregate?.count
        ? row?.camp_count?.aggregate?.count
        : "0",
    sortable: true,
    wrap: true,
    attr: "CAMP_COUNT",
  },
  {
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton my="3" onPress={() => setModal(row)}>
        {t("ASSIGN")}
      </AdminTypo.Secondarybutton>
    ),
    sortable: true,
    attr: "count",
  },
];

const uiSchema = {
  district: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
  block: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
};
const filterName = "camp_reassign_filter";

export default function AgAdminProfile({ footerLinks, userTokenInfo }) {
  const { id, user_id } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [filter, setFilter] = useState();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [prerakData, setPrerakData] = useState();
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const [modal, setModal] = useState();
  const toast = useToast();
  const [isDisable, setIsDisable] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [schema, setSchema] = useState();

  const handleOpenButtonClick = () => {
    setDrawerOpen((prevState) => !prevState);
  };
  const schemat = {
    type: "object",
    properties: {
      district: {
        type: "array",
        title: t("DISTRICT"),
        grid: 1,
        _hstack: {
          maxH: 135,
          overflowY: "scroll",
          borderBottomColor: "bgGreyColor.200",
          borderBottomWidth: "2px",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
      block: {
        type: "array",
        title: t("BLOCKS"),
        grid: 1,
        _hstack: {
          maxH: 130,
          overflowY: "scroll",
          borderBottomColor: "bgGreyColor.200",
          borderBottomWidth: "2px",
        },
        items: {
          type: "string",
        },
        uniqueItems: true,
      },
    },
  };

  useEffect(async () => {
    const id = user_id;
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
    setLoading(false);
    const data = getFilterLocalStorage(filterName);
    if (Object.keys(data).find((e) => arr.includes(e))?.length) setFilter(data);
  }, [id]);

  useEffect(async () => {
    const getDistricts = await geolocationRegistryService.getDistricts({
      name: "RAJASTHAN",
    });
    let newSchema = getOptions(schemat, {
      key: "district",
      arr: getDistricts?.districts,
      title: "district_name",
      value: "district_name",
    });
    setSchema(newSchema);
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (schema && filter?.district?.length > 0) {
        const blockData = await geolocationRegistryService.getMultipleBlocks({
          districts: filter?.district,
        });
        let newSchema = getOptions(schema, {
          key: "block",
          arr: blockData,
          title: "block_name",
          value: "block_name",
        });
        setSchema(newSchema);
      }
    };
    fetchBlocks();
  }, [filter?.district]);

  useEffect(async () => {
    let newFilter = filter;
    const qData = await campService.getPrerakDetails(newFilter);
    setPrerakData(qData?.data);
    setPaginationTotalRows(qData?.totalCount ? qData?.totalCount : 0);
    setLoading(false);
  }, [filter]);

  const reassignCampToPrerak = async (user_id) => {
    setIsDisable(true);
    const obj = {
      facilitator_id: user_id,
      camp_id: id,
    };
    const result = await campService.reassignCampToPrerak(obj);
    if (result?.status !== 200) {
      setIsDisable(false);
      toast.show({
        render: () => {
          return (
            <Alert status="warning" alignItems={"start"} mb="3" mt="4">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t(result?.message)}</BodyMedium>
              </HStack>
            </Alert>
          );
        },
      });
    } else {
      toast.show({
        render: () => {
          return (
            <Alert status="success" alignItems={"start"} mb="3" mt="4">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t(result?.message)}</BodyMedium>
              </HStack>
            </Alert>
          );
        },
      });
      setModal("");
      navigate(`/admin/camps/${id}`);
    }
  };
  const setFilterObject = useCallback((prerakData) => {
    setFilter(prerakData);
    setFilterLocalStorage(filterName, prerakData);
  }, []);
  const onChange = useCallback(
    async (prerakData) => {
      const { district: newDistrict, block: newBlock } =
        prerakData?.formData || {};
      const { district, block, ...remainData } = filter || {};
      setFilterObject({
        ...remainData,
        ...(newDistrict && newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
      });
    },
    [filter, setFilterObject]
  );

  const clearFilter = useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [filter, setFilterObject]);

  const handleSearch = useCallback(
    (e) => {
      setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
    },
    [filter]
  );

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);
  return (
    <Layout
      _sidebar={footerLinks}
      loading={loading}
      getRefAppBar={(e) => setRefAppBar(e)}
    >
      <VStack p={"4"} space={"3%"} width={"100%"}>
        <Box>
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName name="UserLineIcon" size="md" />
            <AdminTypo.H4>{t("PROFILE")}</AdminTypo.H4>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />

            <AdminTypo.H4
              bold
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {data?.program_beneficiaries?.status === "enrolled_ip_verified"
                ? `${
                    data?.program_beneficiaries?.enrollment_first_name ?? "-"
                  } ${data?.program_beneficiaries?.enrollment_last_name ?? "-"}`
                : `${data?.first_name ?? "-"} ${data?.last_name ?? "-"}`}
            </AdminTypo.H4>
          </HStack>
          <HStack p="5" justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <ChipStatus status={data?.status} />
              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                p="2"
                alignItems="center"
                space="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="MapPinLineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {[
                    data?.state,
                    data?.district,
                    data?.block,
                    data?.village,
                    data?.grampanchayat,
                  ]
                    .filter((e) => e)
                    .join(",")}
                </AdminTypo.H6>
              </HStack>
              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                p="2"
                alignItems="center"
                space="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="Cake2LineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {data?.program_beneficiaries?.status ===
                  "enrolled_ip_verified"
                    ? data?.program_beneficiaries?.enrollment_dob
                    : data?.dob ?? "-"}
                </AdminTypo.H6>
              </HStack>

              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                alignItems="center"
                p="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="CellphoneLineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {data?.mobile}
                </AdminTypo.H6>
              </HStack>
            </VStack>
            <HStack flex="0.5" mt={"-5"} justifyContent={"space-between"}>
              {data?.profile_photo_1?.id ? (
                <ImageView
                  source={{
                    document_id: data?.profile_photo_1?.id,
                  }}
                  alt="Alternate Text"
                  width={"200px"}
                  height={"200px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="gray.300"
                  _icon={{ size: "190px" }}
                />
              )}
            </HStack>
          </HStack>
          <VStack alignItems={"center"}>
            <Input
              size={"xs"}
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
            />
          </VStack>
        </Box>
        <HStack space={2}>
          <Stack style={{ position: "relative", overflowX: "hidden" }}>
            <Stack
              style={{
                position: "absolute",
                top: 0,
                left: "0",
                transition: "left 0.3s ease",
                width: "250px",
                height: "100%",
                background: "white",
                zIndex: 1,
              }}
            >
              <Box
                flex={[2, 2, 1]}
                style={{
                  borderRightColor: "dividerColor",
                  borderRightWidth: "2px",
                }}
              >
                <ScrollView
                  maxH={
                    Height -
                    (refAppBar?.clientHeight + ref?.current?.clientHeight)
                  }
                >
                  <VStack space={3} py="5">
                    <HStack
                      alignItems="center"
                      justifyContent="space-between"
                      borderBottomWidth="2"
                      borderColor="#eee"
                      flexWrap="wrap"
                    >
                      <HStack>
                        {/* <IconByName isDisabled name="FilterLineIcon" /> */}
                        <AdminTypo.H5 bold>{t("FILTERS")}</AdminTypo.H5>
                      </HStack>
                      <Button variant="link" pt="3" onPress={clearFilter}>
                        <AdminTypo.H6 color="blueText.400" underline bold>
                          {t("CLEAR_FILTER")}
                        </AdminTypo.H6>
                      </Button>
                    </HStack>
                    <Box p={[0, 0, 3]} pr="3">
                      <Form
                        schema={schema}
                        uiSchema={uiSchema}
                        onChange={onChange}
                        validator={validator}
                        formData={filter}
                      >
                        <Button display={"none"} type="submit"></Button>
                      </Form>
                    </Box>
                  </VStack>
                </ScrollView>
              </Box>
            </Stack>

            <Stack
              style={{
                marginLeft: isDrawerOpen ? "250px" : "0",
                transition: "margin-left 0.3s ease",
              }}
            />
          </Stack>
          <VStack
            ml={"-1"}
            rounded={"xs"}
            height={"50px"}
            bg={filter?.district || filter?.block ? "textRed.400" : "#E0E0E0"}
            justifyContent="center"
            onClick={handleOpenButtonClick}
          >
            <IconByName
              name={isDrawerOpen ? "ArrowLeftSLineIcon" : "FilterLineIcon"}
              color={filter?.district || filter?.block ? "white" : "black"}
              _icon={{ size: "30px" }}
            />
          </VStack>

          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
          >
            <DataTable
              filter={filter}
              setFilter={(e) => {
                setFilter(e);
                setFilterLocalStorage(filterName, e);
              }}
              customStyles={tableCustomStyles}
              columns={[...columns(navigate, t, setModal)]}
              persistTableHead
              facilitator={userTokenInfo?.authUser}
              pagination
              paginationTotalRows={paginationTotalRows}
              paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
              defaultSortAsc
              paginationServer
              data={prerakData}
              onChangeRowsPerPage={(e) => {
                setFilter({ ...filter, limit: e?.toString() });
              }}
              onChangePage={(e) => {
                setFilter({ ...filter, page: e?.toString() });
              }}
            />
          </ScrollView>
        </HStack>
      </VStack>

      <Modal isOpen={modal} size="lg">
        <Modal.Content>
          <Modal.Header>
            <FrontEndTypo.H2 color="textMaroonColor.600">
              {t("REASSIGN_CAMP")}
            </FrontEndTypo.H2>
          </Modal.Header>
          <Modal.Body p="5">
            <VStack>
              <AdminTypo.H4>
                {t("PRERAK_NAME")}:{`${modal?.first_name} `}
                {modal?.last_name ? modal?.last_name : ""}
              </AdminTypo.H4>
              <AdminTypo.H4>
                {t("ADDRESS")}:
                {/* {`${modal?.district ? modal?.district modal?.block : "-"}`} */}
                {modal?.district ? `${modal?.district}, ${modal?.block}` : "NA"}
              </AdminTypo.H4>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-between"}>
            <FrontEndTypo.Secondarybutton onPress={(e) => setModal()}>
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              isDisabled={isDisable}
              onPress={() => reassignCampToPrerak(modal?.id)}
            >
              {t("CONFIRM")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
