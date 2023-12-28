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
} from "@shiksha/common-lib";
import {
  Box,
  HStack,
  Modal,
  VStack,
  ScrollView,
  useToast,
  Alert,
} from "native-base";
import { ChipStatus } from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

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

export default function AgAdminProfile({ footerLinks, userTokenInfo }) {
  const { id, user_id } = useParams();
  const [data, setData] = React.useState();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();
  const [filter, setFilter] = React.useState({ limit: 10, page: 1 });
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [prerakData, setPrerakData] = React.useState();
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const [modal, setModal] = React.useState();
  const toast = useToast();
  const [isDisable, setIsDisable] = React.useState(false);

  React.useEffect(async () => {
    const id = user_id;
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
    setLoading(false);
  }, []);

  React.useEffect(async () => {
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
        </Box>
        <ScrollView
          maxH={Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)}
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
            data={prerakData}
            onChangeRowsPerPage={(e) => {
              setFilter({ ...filter, limit: e?.toString() });
            }}
            onChangePage={(e) => {
              setFilter({ ...filter, page: e?.toString() });
            }}
          />
        </ScrollView>
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
