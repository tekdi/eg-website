import {
  cohortService,
  getSelectedOrgId,
  getSelectedProgramId,
  organisationService,
  setSelectedOrgId,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import { HStack, Select } from "native-base";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function SelectProgramOrganisation({ _hstack }) {
  const { t } = useTranslation();
  const [programList, setProgramList] = useState();
  const [organisations, setOrganisations] = useState();
  const [cohortValue, setCohortValue] = useState();

  useEffect(async () => {
    const proData = await cohortService.getProgramList();
    setProgramList(proData?.data);
    const localData = await getSelectedProgramId();
    if (localData === null) {
      const obj = proData?.data?.[0];
      const defaultData = {
        program_id: obj?.id,
        name: obj?.name,
        state_name: obj?.state?.state_name,
      };
      await setSelectedProgramId(defaultData);
      setCohortValue({ ...cohortValue, program_id: obj?.id });
    } else {
      setCohortValue({ ...cohortValue, program_id: localData?.program_id });
    }
  }, []);

  useEffect(async () => {
    if (cohortValue?.program_id) {
      const orgData = await organisationService.getList({
        order_by: { id: "asc" },
        limit: 100,
      });
      setOrganisations(orgData.data);
      const selectOrgId = await getSelectedOrgId();
      if (selectOrgId === null) {
        const obj = orgData?.data?.[0];
        const defaultData = {
          org_id: obj?.org_id,
          name: obj?.name,
          state_name: obj?.state?.state_name,
        };
        await setSelectedOrgId(defaultData);
        setCohortValue({ ...cohortValue, org_id: obj?.id });
      } else {
        setCohortValue({ ...cohortValue, org_id: selectOrgId?.org_id });
      }
    }
  }, [cohortValue?.program_id]);

  const handleProgramListData = async (selectedItem) => {
    const data = programList.find((e) => e.id == selectedItem);
    await setSelectedProgramId({
      program_id: data?.id,
      program_name: data?.name,
      state_name: data?.state?.state_name,
    });
    setCohortValue({ ...cohortValue, program_id: selectedItem });
  };

  const handleOrgListData = async (selectedItem) => {
    await setSelectedOrgId({
      org_id: selectedItem,
    });
    setCohortValue({ ...cohortValue, org_id: selectedItem });
  };
  console.log(cohortValue);
  return (
    <HStack space="4" alignItems="center" {..._hstack}>
      <Select
        minH="40px"
        maxH="40px"
        selectedValue={`${cohortValue?.program_id}`}
        accessibilityLabel="Choose program"
        placeholder={t("SELECT")}
        mt={1}
        onValueChange={handleProgramListData}
      >
        {programList?.map((item) => (
          <Select.Item
            key={item.id}
            label={item?.state?.state_name}
            value={`${item?.id}`}
          />
        ))}
      </Select>
      <Select
        minH="40px"
        maxH="40px"
        selectedValue={`${cohortValue?.org_id}`}
        accessibilityLabel="Choose ip"
        placeholder={t("SELECT")}
        mt={1}
        onValueChange={handleOrgListData}
      >
        {organisations?.map((item) => (
          <Select.Item key={item.id} label={item?.name} value={`${item?.id}`} />
        ))}
      </Select>
    </HStack>
  );
}

export default memo(SelectProgramOrganisation);
