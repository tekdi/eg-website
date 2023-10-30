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
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { Box, HStack, Modal, VStack, ScrollView, useToast } from "native-base";
import { CampChipStatus, ChipStatus } from "component/Chip";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

const columns = (navigate, t, setModal) => [
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
    name: t("LEARNER_COUNT"),
    selector: (row) => <>0</>,
    sortable: true,
    wrap: true,
    attr: "LEARNER_COUNT",
  },
  {
    name: t("CAMP_COUNT"),
    selector: (row) => <>0</>,
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
    const id = user_id;
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
    const qData = await campService.getCampList(newFilter);
    setCampData(qData?.camps);
    setPaginationTotalRows(qData?.totalCount ? qData?.totalCount : 0);
    setLoading(false);
  }, []);

  const reassignCamp = async () => {
    const obj = {
      learner_id: parseInt(user_id),
      camp_id: id,
    };
    const result = await campService.reassignCamp(obj);
    if (result) {
      setModal("");
      navigate(-1);
    } else {
      toast.show({
        description: "Hello world",
      });
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
              <ChipStatus status={data?.status} />
              {console.log("data", data)}
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
          {/* <HStack mt="6" justifyContent={"space-between"}>
              <AdminTypo.Secondarybutton
                rightIcon={<IconByName name="MessageLineIcon" />}
              >
                {t("Add Comment For Prerak")}
              </AdminTypo.Secondarybutton>
              <Button rounded={"full"}>{t("Assign to Other Prerak")}</Button>
            </HStack> */}
        </Box>
        <ScrollView
          maxH={Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)}
        >
          {console.log("campData", campData)}
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
