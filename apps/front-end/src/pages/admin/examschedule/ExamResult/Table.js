import {
  IconByName,
  AdminTypo,
  tableCustomStyles,
  enumRegistryService,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import { ExamChipStatus } from "component/Chip";
import { HStack, VStack, Pressable, Button, Menu, Modal } from "native-base";

import React, {
  memo,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const dropDown = (triggerProps, t) => {
  return (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
      <IconByName name="ArrowDownSLineIcon" isDisabled={true} px="1.5" />
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
  const [selectedData, setSelectedData] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const navigate = useNavigate();
  const uplodInputRef = useRef();

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
    const result = await uploadRegistryService.uploadExamResult(
      form_data,
      {},
      (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
      }
    );
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
        <Button.Group
          isAttached
          divider={<div style={{ background: "#333", padding: "0.5px" }} />}
          my="1"
          h="6"
          p={4}
          alignItems={"center"}
          rounded={"full"}
          shadow="BlueOutlineShadow"
          borderWidth="1px"
        >
          {row?.beneficiary_user?.exam_results.length > 0 ? (
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
                  { state: { row } }
                );
              }}
            >
              <AdminTypo.H5>{t("VIEW")}</AdminTypo.H5>
            </Pressable>
          ) : (
            <Button.Group>
              <AdminTypo.H5>{t("UPLOAD")}</AdminTypo.H5>
              <Menu
                w="190"
                placement="bottom right"
                trigger={(triggerProps) => dropDown(triggerProps, t)}
              >
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
                      `/admin/exams/list/${row?.beneficiary_user?.beneficiary_id}`
                    );
                  }}
                >
                  <AdminTypo.H5>{t("MANUAL_UPLOAD")}</AdminTypo.H5>
                </Menu.Item>
              </Menu>
            </Button.Group>
          )}
        </Button.Group>
      ),
      center: true,
    },
  ];

  useEffect(() => {
    const getData = async () => {
      const result = await enumRegistryService.statuswiseCount();
      setSelectedData(result);
    };
    getData();
  }, []);

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack>
      <VStack p={2} pt="0">
        <AdminTypo.H5 underline bold color="textMaroonColor.600">
          {filter?.status === undefined || filter?.status?.length === 0 ? (
            t("ALL") + `(${paginationTotalRows})`
          ) : filter?.status?.[0] === "all" ? (
            <AdminTypo.H4 bold>
              {t("ALL") + `(${paginationTotalRows})`}
            </AdminTypo.H4>
          ) : (
            filter?.status
              ?.filter((item) => item)
              .map(
                (item) =>
                  t(item).toLowerCase() +
                  `(${
                    selectedData
                      ? selectedData?.find((e) => item === e.status)?.count
                      : 0
                  })`
              )
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" , ")
          )}
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
          [setFilter, filter]
        )}
        onChangePage={useCallback(
          (e) => {
            setFilter({ ...filter, page: e });
          },
          [setFilter, filter]
        )}
      />
    </VStack>
  );
}

export default memo(Table);
