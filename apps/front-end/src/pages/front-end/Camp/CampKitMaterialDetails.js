import {
  AdminTypo,
  FrontEndTypo,
  Layout,
  campService,
  t,
} from "@shiksha/common-lib";
import { Box, HStack, VStack } from "native-base";
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
    navigate(`/camps/80`);
  };

  //when tushar completed his apis,Update the apis here:-
  const onClickSubmit = async () => {
    const result = await campService.updateCampDetails({
      id: id,
      edit_page_type: "edit_kit_material_details",
    });
    if (result.success) {
      navigate(`camps/${id}`);
    }
  };
  const data = [
    "Satra Yojana",
    "Mind maps (Home science, Social sciences, ICH)",
    "Mock Test Question Papers (Home science-3 sets, Social sciences-3 sets, ICH-3 sets)",
    "Answer Keys (Home science-3 sets, Social sciences-3 sets, ICH-3 sets)",
    "YPP/CPP/POSH Poster",
    "Pass book- Hindi, Home science, Social sciences, ICH (Indian culture and Heritage)",
    "One-week series: Hindi, Home Sciences, Social sciences, ICH",
    "Banner and Poster (already given)  बैनर व पोस्टर (पहले से मिला)",
    "Prerak hand book",
    "Text books -  Hindi, Home science, Social sciences, ICH",
    "Government consent letter for camp",
  ];
  const quantity = [
    "1 सेट",
    "1-1-1 सेट",
    "3-3-3- सेट",
    "3-3-3 सेट",
    "1",
    "1-1-1-1 सेट",
    "1-1-1-1 सेट",
    "बैनर - 1,पोस्टर - 4",
    "1",
    "1-1-1-1",
    "3 सेट",
  ];
  const initialData = data.map((item, index) => ({
    id: index,
    item,
    quantity: quantity[index],
    complete: false,
    partially: false,
    incomplete: false,
  }));

  const [tableData, setTableData] = useState(initialData);

  const columns = [
    {
      name: "Item",
      selector: "item",
      wrap: true,
      sortable: true,
    },
    {
      name: "Quantity",
      wrap: true,
      selector: "quantity",
      sortable: true,
    },
    {
      name: "Complete",
      selector: "complete",
      sortable: true,
      cell: (row) => (
        <input
          type="radio"
          checked={row.complete}
          onChange={() => handleCheckboxChange(row.id, "complete")}
          name={`status-${row.id}`}
        />
      ),
    },
    {
      name: "Partially",
      selector: "partially",
      sortable: true,
      cell: (row) => (
        <input
          type="radio"
          checked={row.partially}
          onChange={() => handleCheckboxChange(row.id, "partially")}
          name={`status-${row.id}`}
        />
      ),
    },
    {
      name: "Incomplete",
      selector: "incomplete",
      sortable: true,
      cell: (row) => (
        <input
          type="radio"
          checked={row.incomplete}
          onChange={() => handleCheckboxChange(row.id, "incomplete")}
          name={`status-${row.id}`}
        />
      ),
    },
  ];
  const handleCheckboxChange = (item, columnName) => {
    setTableData((prevData) => {
      return prevData.map((row) => {
        if (row.id === item) {
          return { ...row, [columnName]: !row[columnName] };
        } else {
          return row;
        }
      });
    });
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn", "langBtn"],
        leftIcon: (
          <FrontEndTypo.H2>{t("Kit material Details")}</FrontEndTypo.H2>
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
          <FrontEndTypo.Primarybutton
            // isLoading={loading}
            p="4"
            mt="4"
            onPress={() => onClickSubmit()}
          >
            {t("SAVE_AND_CAMP_PROFILE")}
          </FrontEndTypo.Primarybutton>
        </Box>
      </VStack>
    </Layout>
  );
}
