import {
  FrontEndTypo,
  Layout,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { Alert, Box, HStack, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

const customStyles = {
  header: {
    style: {
      background: "#F4F4F7",
      minHeight: "72px",
      cursor: "pointer",
      justifyContent: "left",
    },
  },
  headRow: {
    style: {
      size: "1px",
      justifyContent: "center",
      fontWeight: "bold",
    },
  },
  headCells: {
    style: {
      background: "#F4F4F7",
      size: "4px",
      justifyContent: "center",
      padding: "0px",
    },
  },
  cells: {
    style: {
      background: "#F4F4F7",
      justifyContent: "center",
      border: "0.1px solid #999",
    },
  },
};

const columns = (handleCheckboxChange, kitFeadback, t) => [
  {
    name: t("KIT_LIST"),
    cell: (row) => t(row?.title),
    wrap: true,
  },
  {
    name: t("QUANTITY"),
    cell: (row) => t(row?.subTitle),
    wrap: true,
  },
  {
    name: t("COMPLETE"),
    selector: "complete",
    minWidth: "50px",
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "complete"}
        onChange={() => handleCheckboxChange(row.value, "complete")}
        name={`status-${row.value}`}
      />
    ),
    width: "65px",
  },
  {
    name: t("PARTIALLY"),
    selector: "partially",
    minWidth: "50px",
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "partially"}
        onChange={() => handleCheckboxChange(row.value, "partially")}
        name={`status-${row.value}`}
      />
    ),
    width: "65px",
  },
  {
    name: t("INCOMPLETE"),
    selector: "incomplete",
    minWidth: "60px",
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "incomplete"}
        onChange={() => handleCheckboxChange(row.value, "incomplete")}
        name={`status-${row.value}`}
      />
    ),
    width: "70px",
  },
];

export default function CampKitMaterialDetails({ footerLinks }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [kitFeadback, setKitFeadback] = useState({});
  const [tableData, setTableData] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const { id } = useParams();
  const navigate = useNavigate();
  const onPressBackButton = () => {
    navigate(`/camps/${id}`);
  };

  useEffect(async (e) => {
    // enum api all
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.KIT_MATERIALS_CHECKLISTS;
    setTableData(list);
    const result = await campService.campMaterialKit({
      id,
    });
    setKitFeadback(result?.kit?.list_of_materials || {});
  }, []);

  useEffect(async () => {
    const isSaveDisabled = !tableData?.every((row) => kitFeadback[row.value]);
    setIsDisable(isSaveDisabled);
  }, [tableData, kitFeadback]);

  const handleCheckboxChange = (item, columnName) => {
    setKitFeadback({ ...kitFeadback, [item]: columnName });
  };

  const handleSave = async () => {
    setIsDisable(true);
    setIsLoading(true);
    const result = await campService.campMaterialKitUpdate({
      camp_id: id,
      list_of_materials: kitFeadback,
    });
    if (result?.data) {
      setIsDisable(false);
      setIsLoading(false);
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
        _box: { bg: "formBg.500", shadow: "appBarShadow" },
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"CAMP_KIT_MATERIAL"}
      pageTitle={t("CAMP")}
      stepTitle={t("CAMP_KIT_MATERIAL_DETAILS")}
    >
      <VStack space={"2"} p={4}>
        <DataTable
          title={t("CAMP_KIT_MATERIAL_DETAILS")}
          customStyles={customStyles}
          columns={columns(handleCheckboxChange, kitFeadback, t)}
          data={tableData}
          persistTableHead
        />
        <Box>
          <Alert status="warning" alignItems={"start"}>
            <HStack alignItems="center" space="2">
              <Alert.Icon />
              {t("PLEASE_SELECT_ALL_ITEMS_MESSAGE")}
            </HStack>
          </Alert>

          <FrontEndTypo.Primarybutton
            p="4"
            mt="4"
            mb="4"
            m="4"
            onPress={handleSave}
            isDisabled={isDisable}
            isLoading={isLoading}
          >
            {t("SAVE_AND_CAMP_PROFILE")}
          </FrontEndTypo.Primarybutton>
        </Box>
      </VStack>
    </Layout>
  );
}

CampKitMaterialDetails.propTypes = {
  footerLinks: PropTypes.any,
};
