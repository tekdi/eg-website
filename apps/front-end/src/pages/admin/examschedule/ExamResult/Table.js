import {
  IconByName,
  AdminTypo,
  tableCustomStyles,
  uploadRegistryService,
  ImageView,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import { ExamChipStatus } from "component/Chip";
import { HStack, VStack, Pressable, Menu, Modal } from "native-base";

import React, { memo, useCallback, useState, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const dropDown = (triggerProps, t) => {
  return (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
      <HStack
        space={1}
        alignItems={"center"}
        divider={<div style={{ background: "#333", padding: "0.5px" }} />}
        my="1"
        h="8"
        p={2}
        rounded={"full"}
        shadow="BlueOutlineShadow"
        borderWidth="1px"
      >
        {t("ACTION")}
        <IconByName name="ArrowDownSLineIcon" isDisabled={true} />
      </HStack>
    </Pressable>
  );
};
const pagination = [10, 15, 25, 50, 100];

// Table component
function Table({
  filter,
  setFilter,
  paginationTotalRows,
  data,
  loading,
  setLoading,
  height,
  setErrorMsg,
  errorMsg,
}) {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState();
  const navigate = useNavigate();
  const uplodInputRef = useRef();
  const [openView, setOpenView] = useState();

  const handleFileInputChange = (e) => {
    const resultfile = e.target.files[0];
    if (resultfile && resultfile.size <= 1024 * 1024 * 9.5) {
      if (resultfile.type === "application/pdf") {
        uploadProfile(resultfile);
      }
    }
  };

  const openFileUploadDialog = (row) => {
    setSelectedRow(row);
    uplodInputRef.current.click();
  };

  const uploadProfile = async (resultfile) => {
    setLoading(true);
    const form_data = new FormData();
    const item = {
      resultfile,
      board_name: selectedRow?.bordID?.name,
      board_id: selectedRow?.bordID?.id,
      enrollment: selectedRow?.enrollment_number,
      user_id: selectedRow?.beneficiary_user?.beneficiary_id, // localStorage id of the logged-in user
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const result = await uploadRegistryService.uploadExamResult(form_data);
    if (!result?.data) {
      setErrorMsg("ENROLLMENT_NOT_MATCH");
    }
    setLoading(false);
  };

  const columns = (t, navigate) => [
    {
      name: t("LEARNERS_ID"),
      selector: (row) => row?.beneficiary_user?.beneficiary_id,
      sortable: true,
      attr: "id",
      wrap: true,
      width: "100px",
      compact: true,
    },
    {
      name: t("LEARNERS_NAME"),
      selector: (row) => (
        <HStack display="inline-block" width={"100%"}>
          <AdminTypo.H6 bold word-wrap="break-word">
            {`${row?.beneficiary_user?.first_name} ${
              row?.beneficiary_user?.last_name || ""
            }`}
          </AdminTypo.H6>
          {/* </HStack> */}
        </HStack>
      ),
      attr: "learner_name",
      width: "150px",
      wrap: true,
      left: true,
      compact: true,
    },
    {
      name: t("PRERAK_ID"),
      selector: (row) => row?.facilitator_id || "-",
      attr: "prerak_id",
      compact: true,
    },
    {
      name: t("PRERAK_NAME"),
      selector: (row) => (
        <HStack display="inline-block" width={"100%"}>
          <AdminTypo.H6 bold word-wrap="break-word">
            {`${row?.facilitator_user?.first_name} ${
              row?.facilitator_user?.last_name || ""
            }`}
          </AdminTypo.H6>
        </HStack>
      ),
      attr: "prerak_name",
      wrap: true,
      compact: true,
    },
    {
      name: t("ENROLLMENT_ID"),
      selector: (row) => row?.enrollment_number || "-",
      attr: "enrollment_id",
      wrap: true,
      compact: true,
    },
    {
      name: t("RESULT"),
      selector: (row) =>
        row?.result_upload_status === "uploaded" ? (
          <ExamChipStatus
            status={row?.beneficiary_user?.exam_results?.[0]?.final_result}
          />
        ) : (
          <ExamChipStatus status={"yet_to_upload"} />
        ),
      attr: "enrollment_id",
      wrap: true,
    },
    {
      name: t("STATUS"),
      selector: (row) => <ChipStatus status={row?.status || "-"} />,
      attr: "enrollment_id",
      wrap: true,
    },
    {
      minWidth: "140px",
      name: t("ACTION"),
      selector: (row) => (
        <Menu
          w="190"
          placement="bottom right"
          trigger={(triggerProps) => dropDown(triggerProps, t)}
        >
          {row?.beneficiary_user?.exam_results?.length > 0 ? (
            <Menu.Item>
              <Pressable
                px="20px"
                _text={{
                  color: "blueText.400",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
                onPress={() => {
                  navigate(
                    `/admin/exams/list/result/${row?.beneficiary_user?.beneficiary_id}`,
                    { state: { row } },
                  );
                }}
              >
                <AdminTypo.H5>{t("VIEW")}</AdminTypo.H5>
              </Pressable>
            </Menu.Item>
          ) : (
            <>
              <Menu.Item>
                <Pressable
                  onPress={() => {
                    openFileUploadDialog(row);
                  }}
                >
                  <AdminTypo.H5>{t("UPLOAD_PDF")}</AdminTypo.H5>
                </Pressable>
              </Menu.Item>
              <Menu.Item
                onPress={() => {
                  navigate(
                    `/admin/exams/list/${row?.beneficiary_user?.beneficiary_id}`,
                  );
                }}
              >
                <AdminTypo.H5>{t("MANUAL_UPLOAD")}</AdminTypo.H5>
              </Menu.Item>
            </>
          )}

          {(row?.beneficiary_user?.exam_results?.[0]?.document_id ||
            row?.beneficiary_user?.exam_result_document?.[0]?.id) && (
            <Menu.Item
              onPress={() =>
                setOpenView(
                  row?.beneficiary_user?.exam_results?.[0]?.document_id
                    ? row?.beneficiary_user?.exam_results?.[0]
                    : row?.beneficiary_user?.exam_result_document?.[0],
                )
              }
            >
              {t("VIEW_DOCUMENT")}
            </Menu.Item>
          )}
        </Menu>
      ),
      center: true,
    },
  ];

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack>
      <VStack p={2} pt="0">
        <AdminTypo.H5 underline bold color="textMaroonColor.600">
          {t("ALL") + `(${paginationTotalRows})`}
        </AdminTypo.H5>
        <input
          accept="application/pdf"
          type="file"
          style={{ display: "none" }}
          ref={uplodInputRef}
          onChange={handleFileInputChange}
        />
      </VStack>
      <DataTable
        fixedHeader={true}
        fixedHeaderScrollHeight={`${height - 160}px`}
        customStyles={{
          ...tableCustomStyles,
          rows: {
            style: {
              minHeight: "20px", // override the row height
              cursor: "pointer",
            },
          },
          pagination: { style: { margin: "5px 0 5px 0" } },
        }}
        columns={columnsMemoized}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={pagination}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={filter?.page || 1}
        highlightOnHover
        onChangeRowsPerPage={useCallback(
          (e) => {
            setFilter({ ...filter, limit: e, page: 1 });
          },
          [setFilter, filter],
        )}
        onChangePage={useCallback(
          (e) => {
            setFilter({ ...filter, page: e });
          },
          [setFilter, filter],
        )}
      />

      <Modal isOpen={openView} size="xl" onClose={() => setOpenView()}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body>
            <ImageView
              source={{ document_id: openView?.document_id || openView?.id }}
              alt="Result"
              width="100%"
              height="300"
              borderRadius="5px"
              borderWidth="1px"
              borderColor="worksheetBoxText.100"
              alignSelf="Center"
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </VStack>
  );
}

export default memo(Table);

Table.propTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.any,
  paginationTotalRows: PropTypes.any,
  data: PropTypes.any,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  height: PropTypes.any,
  setErrorMsg: PropTypes.func,
  errorMsg: PropTypes.any,
};
