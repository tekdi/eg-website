import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  benificiaryRegistoryService,
  ImageView,
  FrontEndTypo,
  tableCustomStyles,
  campService,
  useWindowSize,
  setQueryParameters,
  geolocationRegistryService,
  facilitatorRegistryService,
  debounce,
  BodyMedium,
} from "@shiksha/common-lib";
import {
  Box,
  HStack,
  Modal,
  VStack,
  ScrollView,
  useToast,
  Button,
  Input,
  Alert,
} from "native-base";
import { CampChipStatus } from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { ChipStatus } from "component/BeneficiaryStatus";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { MultiCheck, validator } from "component/BaseInput";
import Form from "@rjsf/core";

const columns = (navigate, t, setModal) => [
  {
    name: t("CAMP_ID"),
    selector: (row) => row?.id,
    sortable: true,
    attr: "CAMP_ID",
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.faciltator?.user?.faciltator_id,
    sortable: true,
    attr: "PRERAK_ID",
  },
  {
    name: t("PRERAK"),
    selector: (row) =>
      row?.faciltator?.user?.first_name +
      " " +
      row?.faciltator?.user?.last_name,
    sortable: true,
    attr: "PRERAK",
  },
  {
    name: t("DISTRICT"),
    selector: (row) =>
      row?.properties?.district ? row?.properties?.district : "-",
    sortable: true,
    attr: "DISTRICT",
  },
  {
    name: t("BLOCK"),
    selector: (row) => (row?.properties?.block ? row?.properties?.block : "-"),
    sortable: true,
    attr: "BLOCK",
  },
  {
    name: t("CAMP_STATUS"),
    selector: (row) => <CampChipStatus status={row?.group?.status} />,
    sortable: true,
    wrap: true,
    attr: "CAMP_STATUS",
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

export default function AgAdminProfile({ footerLinks, userTokenInfo }) {
  const { id, user_id } = useParams();
  const [data, setData] = React.useState();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();
  const [filter, setFilter] = React.useState({ limit: 10 });
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [campData, setCampData] = React.useState();
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const [modal, setModal] = React.useState();
  const toast = useToast();

  React.useEffect(async () => {
    let newFilter = filter;
    const result = await benificiaryRegistoryService.getOne(user_id);
    setData(result?.result);
    const qData = await campService.getCampList(newFilter);
    const filtered = qData?.camps?.filter((item) => `${item?.id}` !== `${id}`);
    setCampData(filtered);
    setPaginationTotalRows(qData?.totalCount ? qData?.totalCount : 0);
    setLoading(false);
  }, [filter]);

  const reassignCamp = async () => {
    const obj = {
      learner_id: parseInt(user_id),
      camp_id: modal?.id,
    };
    const result = await campService.reassignCamp(obj);
    if (result?.status !== 200) {
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
      setModal("");
      navigate(-1);
    }
  };
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
            <AdminTypo.H1 color="Activatedcolor.400">
              {t("PROFILE")}
            </AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />

            <AdminTypo.H1
              color="textGreyColor.800"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {data?.program_beneficiaries?.status === "enrolled_ip_verified"
                ? `${
                    data?.program_beneficiaries?.enrollment_first_name ?? "-"
                  } ${data?.program_beneficiaries?.enrollment_last_name ?? "-"}`
                : `${data?.first_name ?? "-"} ${data?.last_name ?? "-"}`}
            </AdminTypo.H1>
          </HStack>
          <HStack p="5" justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <ChipStatus status={data?.program_beneficiaries?.status} />
              <HStack
                bg="badgeColor.400"
                rounded={"md"}
                p="2"
                alignItems="center"
                space="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="MapPinLineIcon"
                  color="textGreyColor.300"
                />
                <AdminTypo.H6 color="textGreyColor.600" bold>
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
                bg="badgeColor.400"
                rounded={"md"}
                p="2"
                alignItems="center"
                space="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="Cake2LineIcon"
                  color="textGreyColor.300"
                />
                <AdminTypo.H6 color="textGreyColor.600" bold>
                  {data?.program_beneficiaries?.status ===
                  "enrolled_ip_verified"
                    ? data?.program_beneficiaries?.enrollment_dob
                    : data?.dob ?? "-"}
                </AdminTypo.H6>
              </HStack>

              <HStack
                bg="badgeColor.400"
                rounded={"md"}
                alignItems="center"
                p="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="CellphoneLineIcon"
                  color="textGreyColor.300"
                />
                <AdminTypo.H6 color="textGreyColor.600" bold>
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
        </Box>
        <HStack>
          <Filter {...{ filter, setFilter, t }} />
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
          >
            <DataTable
              filter={filter}
              setFilter={(e) => {
                setFilter(e);
                setQueryParameters(e);
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
              data={campData}
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
            <FrontEndTypo.H1>{t("REASSIGN_CAMP")}</FrontEndTypo.H1>
          </Modal.Header>
          <Modal.Body p="5">
            <VStack>
              <AdminTypo.H4>
                {t("CAMP_ID")}: {modal?.id}
              </AdminTypo.H4>
              <AdminTypo.H4>
                {t("CAMP_NAME")}: {modal?.group?.name}
              </AdminTypo.H4>
              <AdminTypo.H4>
                {t("PRERAK_NAME")}:
                {modal?.faciltator?.user?.first_name +
                  " " +
                  modal?.faciltator?.user?.last_name}
              </AdminTypo.H4>
              <AdminTypo.H4>
                {t("ADDRESS")}:
                {`${modal?.properties?.district}, ${modal?.properties?.block}`}
              </AdminTypo.H4>
              <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                <HStack alignItems="center" space="2" color>
                  <Alert.Icon />
                  <BodyMedium>{t("REASSIGN_MSG")}</BodyMedium>
                </HStack>
              </Alert>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-between"}>
            <FrontEndTypo.Secondarybutton onPress={(e) => setModal()}>
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton onPress={() => reassignCamp()}>
              {t("CONFIRM")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

export const Filter = ({ filter, setFilter, t }) => {
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
  const [getBlocksAll, setGetBlocksAll] = React.useState();
  const [facilitatorFilter, setFacilitatorFilter] = React.useState({});
  const [facilitator, setFacilitator] = React.useState([]);

  const setFilterObject = (data) => {
    if (data?.district) {
      const { district, block } = data;
      setFacilitatorFilter({ ...facilitatorFilter, district, block });
    }
    setFilter(data);
    setQueryParameters(data);
  };

  const schema = {
    type: "object",
    properties: {
      district: {
        type: "array",
        title: t("DISTRICT"),
        grid: 1,
        _hstack: { maxH: 135, overflowY: "scroll" },
        items: {
          type: "string",
          enum: getDistrictsAll?.map((item, i) => item?.district_name),
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
        },
        items: {
          type: "string",
          enumNames: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
          enum: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
        },
        uniqueItems: true,
      },
    },
  };

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
  React.useEffect(async () => {
    let name = "RAJASTHAN";
    const getDistricts = await geolocationRegistryService.getDistricts({
      name,
    });
    setgetDistrictsAll(getDistricts?.districts);
  }, []);

  React.useEffect(async () => {
    let blockData = [];
    if (filter?.district?.length > 0) {
      blockData = await geolocationRegistryService.getMultipleBlocks({
        districts: filter?.district,
      });
    }
    setGetBlocksAll(blockData);
  }, [filter?.district]);

  const onChange = async (data) => {
    const { district: newDistrict, block: newBlock } = data?.formData || {};
    const { district, block, ...remainData } = filter;
    setFilterObject({
      ...remainData,
      ...(newDistrict?.length > 0
        ? {
            district: newDistrict,
            ...(newBlock?.length > 0 ? { block: newBlock } : {}),
          }
        : {}),
    });
  };

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
    setFacilitatorFilter({});
  };
  React.useEffect(async () => {
    const { error, ...result } = await facilitatorRegistryService.searchByCamp(
      facilitatorFilter
    );

    if (!error) {
      let newData;
      if (result) {
        newData = result?.users?.map((e) => ({
          value: e?.id,
          label: `${e?.first_name} ${e?.last_name ? e?.last_name : ""}`,
        }));
      }
      setFacilitator(newData);
    }
  }, [facilitatorFilter, filter]);

  return (
    <VStack space={3}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth="2"
        borderColor="#eee"
        flexWrap="wrap"
        Width
      >
        <HStack>
          <IconByName isDisabled name="FilterLineIcon" />
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
      <AdminTypo.H5>{t("PRERAK")}</AdminTypo.H5>
      <Input
        w="100%"
        height="32px"
        placeholder={t("SEARCH")}
        variant="outline"
        onChange={(e) => {
          debounce(
            setFacilitatorFilter({
              ...facilitatorFilter,
              search: e.nativeEvent.text,
              page: 1,
            }),
            3000
          );
        }}
      />
      <MultiCheck
        value={filter?.facilitator ? filter?.facilitator : []}
        onChange={(e) => {
          setFilterObject({ ...filter, facilitator: e });
        }}
        schema={{
          grid: 1,
          _hstack: {
            maxH: 130,
            overflowY: "scroll",
          },
        }}
        options={{
          enumOptions: facilitator,
        }}
      />
    </VStack>
  );
};
