import {
  AdminLayout as Layout,
  AdminTypo,
  benificiaryRegistoryService,
  FrontEndTypo,
  tableCustomStyles,
  campService,
  useWindowSize,
  setQueryParameters,
  BodyMedium,
  UserCard,
} from "@shiksha/common-lib";
import {
  HStack,
  Modal,
  VStack,
  ScrollView,
  useToast,
  Alert,
  Stack,
} from "native-base";
import { CampChipStatus } from "component/Chip";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { Filter } from "./CampHome";
import PropTypes from "prop-types";

const columns = (t, setModal) => [
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
const column = (t) => [
  {
    name: "Id",
    selector: (row) => row?.id,
    wrap: true,
  },
  {
    name: t("ENROLLMENT_NO"),
    selector: (row) => row?.program_beneficiaries[0].enrollment_number || "-",
    wrap: true,
  },
  {
    name: t("LEARNERS_NAME"),
    minWidth: "250px",
    selector: (row) => (
      <UserCard
        _hstack={{ borderWidth: 0, p: 1 }}
        key={row}
        title={
          <AdminTypo.H6 bold>
            {[
              row?.program_beneficiaries?.[0]?.enrollment_first_name,
              row?.program_beneficiaries?.[0]?.enrollment_middle_name,
              row?.program_beneficiaries?.[0]?.enrollment_last_name,
            ]
              .filter((e) => e)
              .join(" ")}
          </AdminTypo.H6>
        }
        image={
          row?.profile_photo_1?.id ? { urlObject: row?.profile_photo_1 } : null
        }
      />
    ),
    wrap: true,
  },
];

const tableStyles = {
  table: {
    style: {
      borderCollapse: "collapse",
      jus: "center",
      border: "1px solid #dddddd",
      width: "95%",
      margin: "0 auto",
    },
  },
  rows: {
    style: {
      minHeight: "55px", // override the row height
      cursor: "pointer",
    },
  },
  headCells: {
    style: {
      background: "#ff0000",
      color: "white",
      size: "16px",
      justifyContent: "flex-start",
      height: "50px",
    },
  },
  cells: {
    style: {
      color: "#616161",
      size: "19px",
      justifyContent: "flex-start",
    },
  },
};
export default function ReassignCamp({ footerLinks, userTokenInfo }) {
  const { id, user_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ limit: 10 });
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [campData, setCampData] = useState();
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const [modal, setModal] = useState();
  const toast = useToast();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const { selectedRows } = state || {};

  useEffect(async () => {
    let newFilter = filter;
    await benificiaryRegistoryService.getOne(user_id);
    const qData = await campService.getCampList(newFilter);
    const filtered = qData?.camps?.filter((item) => `${item?.id}` !== `${id}`);
    setCampData(filtered);
    setPaginationTotalRows(qData?.totalCount ? qData?.totalCount : 0);
    setLoading(false);
  }, [filter]);

  const reassignCamp = async () => {
    setIsButtonLoading(true);
    const idsArray = selectedRows.map((row) => row.id);
    const oldCampId = parseInt(id);
    const newCampId = modal?.id;
    const obj = {
      learner_id: idsArray,
      old_camp_id: oldCampId,
      id: newCampId,
    };
    const result = await campService.multipleReassign(obj);
    if (result?.status !== 200) {
      setIsButtonLoading(false);
      toast.show({
        render: () => {
          return (
            <Alert status="warning" alignItems={"start"} mb="3" mt="4">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t("LEARNER_ASSIGNED_FAILED")}</BodyMedium>
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
                <BodyMedium>{t("LEARNER_ASSIGNED_SUCCESSFUL")}</BodyMedium>
              </HStack>
            </Alert>
          );
        },
      });
      setModal("");
      navigate(`/admin/camps/${modal?.id}`);
    }
  };
  return (
    <Layout
      _sidebar={footerLinks}
      loading={loading}
      getRefAppBar={(e) => setRefAppBar(e)}
    >
      <VStack p={"4"} space={"3%"} width={"100%"}>
        <Stack p={2} height={"300px"}>
          <DataTable
            title={t("SELECTED_LEARNER_COUNT") + ` :- ${selectedRows?.length}`}
            customStyles={tableStyles}
            columns={column(t)}
            persistTableHead
            data={selectedRows}
            fixedHeader={true}
            fixedHeaderScrollHeight="250px"
          />
        </Stack>
        <HStack justifyContent={"center"}>
          <Alert status="warning" mb="3" mt="4">
            <HStack space="2" color>
              <Alert.Icon />
              <BodyMedium>{t("CAMP_REASSIGN_WARNING_MESSAGE")}</BodyMedium>
            </HStack>
          </Alert>
        </HStack>
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
              columns={[...columns(t, setModal)]}
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
            <FrontEndTypo.Primarybutton
              isLoading={isButtonLoading}
              onPress={() => reassignCamp()}
            >
              {t("CONFIRM")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

ReassignCamp.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
