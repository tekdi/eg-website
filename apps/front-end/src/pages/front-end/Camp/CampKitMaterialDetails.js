import {
  AdminTypo,
  FrontEndTypo,
  Layout,
  benificiaryRegistoryService,
  campService,
  enumRegistryService,
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

const columns = (handleCheckboxChange, kitFeadback, t) => [
  {
    name: t("TITLE"),
    cell: (row) => t(row?.title),
    wrap: true,
    sortable: true,
  },
  {
    name: t("subTitle"),
    cell: (row) => t(row?.subTitle),
    wrap: true,
    sortable: true,
  },
  {
    name: t("COMPLETE"),
    selector: "complete",
    sortable: true,
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "complete"}
        onChange={() => handleCheckboxChange(row.value, "complete")}
        name={`status-${row.value}`}
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
        checked={kitFeadback[row.value] === "partially"}
        onChange={() => handleCheckboxChange(row.value, "partially")}
        name={`status-${row.value}`}
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
        checked={kitFeadback[row.value] === "incomplete"}
        onChange={() => handleCheckboxChange(row.value, "incomplete")}
        name={`status-${row.value}`}
      />
    ),
  },
];

export default function CampKitMaterialDetails({ footerLinks }) {
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(true);
  const [kitFeadback, setKitFeadback] = React.useState({});
  const [tableData, setTableData] = React.useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const onPressBackButton = () => {
    navigate(`/camps/${id}`);
  };

  React.useEffect(async (e) => {
    // enum api all
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.KIT_MATERIALS_CHECKLISTS;
    console.log("tt", list);
    setTableData(list);
    const result = await campService.campMaterialKit({
      id,
    });
    console.log(result);
  }, []);

  const handleCheckboxChange = (item, columnName) => {
    setKitFeadback({ ...kitFeadback, [item]: columnName });
  };

  const isSaveDisabled = !tableData?.every((row) => kitFeadback[row.value]);
  const handleSave = async () => {
    console.log("Data saved:", kitFeadback);
    const result = await campService.campMaterialKitUpdate({
      camp_id: id,
      date: kitFeadback,
    });
    console.log(result);
    // if (tableData?.[0]) {
    //   navigate(`/camps/${id}`);
    // }
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
          columns={columns(handleCheckboxChange, kitFeadback, t)}
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
