import {
  AdminTypo,
  FrontEndTypo,
  Layout,
  campService,
  t,
} from "@shiksha/common-lib";
import { Alert, Box, HStack, VStack } from "native-base";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const customStyles = {
  header: {
    style: {
      minHeight: "72px",
      cursor: "pointer",
      borderColor: "black",
      justifyContent: "center",
    },
  },
  headRow: {
    style: {
      size: "16px",
      justifyContent: "center",
      border: "0.1px solid black",
    },
  },
  headCells: {
    style: {
      background: "#E0E0E0",
      size: "16px",
      justifyContent: "center",
      border: "0.1px solid black",
    },
  },
  cells: {
    style: {
      justifyContent: "center",
      border: "0.1px solid black", // Add border style for all cells
    },
  },
};
export default function CampKitMaterialDetails({ footerLinks }) {
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const onPressBackButton = () => {
    navigate(`/camps/${id}`);
  };

  const data = [
    t("KIT_MATERIAL_SATRA_YOJANA"),
    t("KIT_MATERIAL_MIND_MAPS"),
    t("KIT_MATERIAL_MOCK_TEST_QUESTION_PAPERS"),
    t("KIT_MATERIAL_ANSWER_KEYS"),
    t("KIT_MATERIAL_YPP_CPP_POSH"),
    t("KIT_MATERIAL_PASS_BOOKS"),
    t("KIT_MATERIAL_ONE_WEEK_SERIES"),
    t("KIT_MATERIAL_BANNER_AND_POSTER"),
    t("KIT_MATERIAL_PRERAK_HAND_BOOK"),
    t("KIT_MATERIAL_TEXT_BOOK"),
    t("KIT_MATERIAL_GOVERNMENT_CONSENT_LETTER_FOR_CAMP"),
  ];
  const quantity = [
    `1 ${t("SET")}`,
    `1-1-1 ${t("SET")}`,
    `3-3-3 ${t("SET")}`,
    `3-3-3 ${t("SET")}`,
    "1",
    `1-1-1-1 ${t("SET")}`,
    `1-1-1-1 ${t("SET")}`,
    `${t("BANNER")} - 1, ${t("POSTER")}- 4`,
    "1",
    "1-1-1-1",
    `3 ${t("SET")}`,
  ];
  const initialData = data.map((item, index) => ({
    indexId: index,
    item,
    quantity: quantity[index],
    complete: false,
    partially: false,
    incomplete: false,
  }));

  const [tableData, setTableData] = useState(initialData);

  const columns = [
    {
      name: t("ITEM"),
      selector: "item",
      wrap: true,
      sortable: true,
    },
    {
      name: t("QUANTITY"),
      wrap: true,
      selector: "quantity",
      sortable: true,
    },
    {
      name: t("COMPLETE"),
      selector: "complete",
      sortable: true,
      cell: (row) => (
        <input
          type="radio"
          checked={row.complete}
          onChange={() => handleCheckboxChange(row.indexId, "complete")}
          name={`status-${row.indexId}`}
        />
      ),
    },
    {
      name: t("PARTIALLY"),
      selector: "partially",
      sortable: true,
      cell: (row) => (
        <input
          type="radio"
          checked={row.partially}
          onChange={() => handleCheckboxChange(row.indexId, "partially")}
          name={`status-${row.indexId}`}
        />
      ),
    },
    {
      name: t("INCOMPLETE"),
      selector: "incomplete",
      sortable: true,
      cell: (row) => (
        <input
          type="radio"
          checked={row.incomplete}
          onChange={() => handleCheckboxChange(row.indexId, "incomplete")}
          name={`status-${row.indexId}`}
        />
      ),
    },
  ];
  const handleCheckboxChange = (item, columnName) => {
    setTableData((prevData) => {
      return prevData.map((row) => {
        if (row.indexId === item) {
          return { ...row, [columnName]: !row[columnName] };
        } else {
          return row;
        }
      });
    });
  };

  const isSaveDisabled = !tableData.every(
    (row) => row.complete || row.partially || row.incomplete
  );
  const handleSave = () => {
    console.log("Data saved:", tableData);
    if (tableData?.[0]) {
      navigate(`/camps/${id}`);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: (
          <FrontEndTypo.H2>{t("CAMP_KIT_MATERIAL_DETAILS")}</FrontEndTypo.H2>
        ),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
      //   loading={loading}
    >
      <VStack p={"4"} space={"4"}>
        <DataTable
          title={t("CAMP_KIT_MATERIAL_DETAILS")}
          customStyles={customStyles}
          columns={columns}
          data={tableData}
          persistTableHead
        />
        <Box>
          {isSaveDisabled && (
            <Alert status="warning" alignItems={"start"}>
              <HStack alignItems="center" space="2">
                <Alert.Icon />
                {t("PLEASE_SELECT_ALL_ITEMS_MESSAGE")}
              </HStack>
            </Alert>
          )}
          <FrontEndTypo.Primarybutton
            // isLoading={loading}
            p="4"
            mt="4"
            isDisabled={isSaveDisabled}
            onPress={handleSave}
          >
            {t("SAVE_AND_CAMP_PROFILE")}
          </FrontEndTypo.Primarybutton>
        </Box>
      </VStack>
    </Layout>
  );
}
