import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PoAdminLayout as Layout,
  getSelectedAcademicYear,
  getSelectedProgramId,
  setSelectedProgramId,
  useWindowSize,
  cohortService,
  AdminTypo,
} from "@shiksha/common-lib";
import PropTypes from "prop-types";
import { VStack, Select, HStack } from "native-base";
import { report } from "./ReportJson";
import { useTranslation } from "react-i18next";

export default function Reports({ footerLinks }) {
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [localAcademicData, setLocalAcademicData] = useState();
  const [localProgramData, setLocalProgramData] = useState(null);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [programList, setProgramList] = useState();
  const [data, setData] = useState();

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  useEffect(() => {
    const fetchData = async () => {
      const localAcademic = await getSelectedAcademicYear();
      setLocalAcademicData(localAcademic);

      const localProgram = await getSelectedProgramId();
      setLocalProgramData(localProgram);

      const data = await cohortService.getPrograms(
        localAcademic?.academic_year_id
      );
      setProgramList(data?.data);
      if (
        (localProgram === null || isEmptyObject(localProgram)) &&
        data?.data?.length > 0
      ) {
        const obj = data?.data[0];
        const defaultData = {
          program_id: obj.program_id,
          program_name: obj.program_name,
          state_name: obj?.state_name,
          state_id: obj?.state_id,
        };
        await setSelectedProgramId(defaultData);
        setFilter((prevFilter) => ({
          ...prevFilter,
          program_id: obj.program_id,
        }));
      } else {
        setFilter((prevFilter) => ({
          ...prevFilter,
          program_id: localProgram?.program_id,
        }));
      }
    };

    fetchData();
  }, [filter?.program_id]);

  const name = useParams();
  const id = localStorage.getItem("id");

  useEffect(() => {
    if (localProgramData && localAcademicData) {
      const ipId1Data = report?.[`ip-id-${id}`];
      const reportName = `${name?.name}-report-${localProgramData?.program_id}-${localAcademicData?.academic_year_id}`;
      const data = ipId1Data?.[reportName];
      setData(data);
    }
  }, [localProgramData, localAcademicData, filter?.program_id, name]);

  const handleProgramChange = async (selectedItem) => {
    const data = programList.find((e) => e.program_id == selectedItem);
    await setSelectedProgramId({
      program_id: data?.program_id,
      program_name: data?.program_name,
      state_name: data?.state_name,
    });
    setFilter((prevFilter) => ({ ...prevFilter, program_id: selectedItem }));
  };
  return (
    <Layout
      w={Width}
      h={Height}
      getRefAppBar={(e) => setRefAppBar(e)}
      refAppBar={refAppBar}
      _sidebar={footerLinks}
    >
      <HStack justifyContent={"space-between"}>
        <Select
          minH="40px"
          maxH="40px"
          m={4}
          selectedValue={`${filter?.program_id}`}
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder={t("SELECT")}
          onValueChange={handleProgramChange}
        >
          {programList?.map((item) => (
            <Select.Item
              key={item?.program_id}
              label={item?.state_name}
              value={`${item?.program_id}`}
            />
          ))}
        </Select>
      </HStack>
      {data !== null ? (
        <VStack>
          <iframe
            title="reports"
            src={data}
            frameBorder="0"
            width="100%"
            height="900"
          />
        </VStack>
      ) : (
        <VStack alignSelf={"center"}>
          <AdminTypo.H1>{t("DATA_NOT_FOUND")}</AdminTypo.H1>
        </VStack>
      )}
    </Layout>
  );
}

Reports.propTypes = {
  footerLinks: PropTypes.any,
};
