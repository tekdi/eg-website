import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  tableCustomStyles,
  BodyMedium,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, VStack, Modal, Alert } from "native-base";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { ChipStatus } from "component/BeneficiaryStatus";

const Name = (row) => {
  return (
    <HStack alignItems={"center"} space="2">
      <AdminTypo.H5>
        {row?.first_name}
        {row?.last_name ? +" " + row?.last_name : ""}
      </AdminTypo.H5>
    </HStack>
  );
};

const PrerakName = (row) => {
  return (
    <HStack alignItems={"center"} space="2">
      <AdminTypo.H5 bold>
        {row?.program_beneficiaries?.facilitator_user?.first_name + " "}
        {row?.program_beneficiaries?.facilitator_user?.last_name
          ? row?.program_beneficiaries?.facilitator_user?.last_name
          : ""}
      </AdminTypo.H5>
    </HStack>
  );
};

const status = (row, index) => {
  return (
    <ChipStatus
      key={index}
      is_duplicate={row?.is_duplicate}
      is_deactivated={row?.is_deactivated}
      status={row?.program_beneficiaries?.status}
    />
  );
};

const action = (row, setViewData, setModalVisible, t) => {
  return (
    <AdminTypo.Secondarybutton
      my="3"
      onPress={() => {
        setModalVisible(true);
        setViewData(row);
      }}
    >
      {t("ASSIGN")}
    </AdminTypo.Secondarybutton>
  );
};

export default function DuplicateView({ footerLinks }) {
  const { t } = useTranslation();
  const { adhaarNo } = useParams();
  const [data, setData] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = React.useState(false);
  const [errormsg, seterrormsg] = React.useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filter, setFilter] = React.useState({
    limit: 10,
    page: 1,
    aadhar_no: adhaarNo,
  });
  const [loading, setLoading] = React.useState(true);
  const [viewData, setViewData] = React.useState();
  const navigate = useNavigate();

  const columns = (e) => [
    {
      name: t("LEARNERS_NAME"),
      selector: (row) => Name(row),
      sortable: true,
      attr: "name",
    },
    {
      name: t("DATE_OF_ENTRY_IN_PMS"),
      selector: (row) => moment(row?.created_at).format("DD/MM/YYYY"),
      sortable: true,
      attr: "name",
    },
    {
      name: t("MOBILE_NUMBER"),
      selector: (row) => row?.mobile,
      sortable: true,
      attr: "email",
    },
    {
      name: t("ADDRESS"),
      selector: (row) =>
        row?.district
          ? `${row?.district}, ${row?.block}, ${row?.village}, ${row?.grampanchayat}`
          : "-",
    },
    {
      name: t("PRERAK_NAME"),
      selector: (row) => PrerakName(row),
      sortable: true,
      attr: "name",
    },
    {
      name: t("PRERAK_NUMBER"),
      selector: (row) => row?.program_beneficiaries?.facilitator_user?.mobile,
      sortable: true,
      attr: "email",
    },
    {
      name: t("REASON_OF_DUPLICATION"),
      selector: (row) => (row?.duplicate_reason ? row?.duplicate_reason : "-"),
      sortable: true,
      attr: "email",
    },
    {
      name: t("STATUS"),
      selector: (row, index) => status(row, index),
      sortable: true,
      attr: "email",
    },
  ];

  React.useEffect(async () => {
    const result =
      await benificiaryRegistoryService?.getDuplicateBeneficiariesListByAadhaar(
        filter
      );
    setPaginationTotalRows(result?.count || 0);
    setData(result?.result);
    setLoading(false);
  }, [filter]);

  const assignToPrerak = async (id) => {
    const activeId = { activeId: id };
    const result = await benificiaryRegistoryService?.deactivateDuplicates(
      activeId
    );
    if (!result?.success) {
      seterrormsg(true);
    }
    setModalVisible(false);
    setModalConfirmVisible(true);
  };

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName
              name="Home4LineIcon"
              alt="Prerak Orientation"
              size="30px"
              resizeMode="contain"
            />

            <AdminTypo.H1 color="Activatedcolor.400">
              {t("DUPLICATE")}
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
              {adhaarNo}
            </AdminTypo.H1>
          </HStack>
          <DataTable
            customStyles={tableCustomStyles}
            columns={[
              ...columns(),
              {
                name: t("ACTION"),
                selector: (row) => action(row, setViewData, setModalVisible, t),
              },
            ]}
            data={data}
            persistTableHead
            progressPending={loading}
            pagination
            paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
            paginationServer
            paginationTotalRows={paginationTotalRows}
            onChangeRowsPerPage={(e) => {
              setFilter({ ...filter, limit: e });
            }}
            onChangePage={(e) => {
              setFilter({ ...filter, page: e });
            }}
          />
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header textAlign={"left"}>
                <HStack alignItems={"center"}>
                  <IconByName
                    isDisabled
                    name="Chat4LineIcon"
                    color="textGreyColor.100"
                    size="xs"
                  />
                  <AdminTypo.H1
                    marginLeft="10px"
                    color="textGreyColor.500"
                  >{`${t("ASSIGN_TO_PRERAK")}`}</AdminTypo.H1>
                </HStack>
              </Modal.Header>
              <Modal.Body>
                <HStack justifyContent="space-between">
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("LEARNERS_NAME")}:`}
                      {viewData?.first_name + " "} {viewData?.last_name}
                    </AdminTypo.H6>
                  </HStack>
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("MOBILE_NUMBER")}:`} {viewData?.mobile}
                    </AdminTypo.H6>
                  </HStack>
                </HStack>
                <HStack mt={3} justifyContent="space-between">
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("PRERAK_NAME")}:`}
                      {viewData?.program_beneficiaries?.facilitator_user
                        ?.first_name + " "}
                      {viewData?.program_beneficiaries?.facilitator_user
                        ?.last_name
                        ? viewData?.program_beneficiaries?.facilitator_user
                            ?.last_name
                        : ""}
                    </AdminTypo.H6>
                  </HStack>
                  <HStack>
                    <IconByName
                      isDisabled
                      name="UserLineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H6 color="textGreyColor.100">
                      {`${t("MOBILE_NUMBER")}:`}
                      {
                        viewData?.program_beneficiaries?.facilitator_user
                          ?.mobile
                      }
                    </AdminTypo.H6>
                  </HStack>
                </HStack>
                <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>{t("DEACTIVATE_MSG")}</BodyMedium>
                  </HStack>
                </Alert>
              </Modal.Body>
              <Modal.Footer>
                <HStack justifyContent="space-between" width="100%">
                  <AdminTypo.Secondarybutton
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    {t("CANCEL")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.PrimaryButton
                    onPress={() => {
                      assignToPrerak(viewData?.id);
                    }}
                  >
                    {t("CONFIRM")}
                  </AdminTypo.PrimaryButton>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <Modal
            isOpen={modalConfirmVisible}
            onClose={() => setModalConfirmVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Body>
                {errormsg ? (
                  <Alert status="danger" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{t("FAILED_TO_ASSIGN")}</BodyMedium>
                    </HStack>
                  </Alert>
                ) : (
                  <Alert status="success" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{t("ASSIGN_SUCCESS")}</BodyMedium>
                    </HStack>
                  </Alert>
                )}
              </Modal.Body>
              <Modal.Footer>
                <HStack justifyContent="center" width="100%">
                  {errormsg ? (
                    <AdminTypo.Secondarybutton
                      onPress={() => {
                        setModalConfirmVisible(false);
                      }}
                    >
                      {t("RETRY")}
                    </AdminTypo.Secondarybutton>
                  ) : (
                    <AdminTypo.Secondarybutton
                      onPress={() => {
                        setModalConfirmVisible(false);
                        navigate("/admin/learner/duplicates");
                      }}
                    >
                      {t("OK")}
                    </AdminTypo.Secondarybutton>
                  )}
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </HStack>
    </Layout>
  );
}
