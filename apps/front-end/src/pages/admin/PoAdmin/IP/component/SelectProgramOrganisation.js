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
import PropTypes from "prop-types";

function SelectProgramOrganisation({ _hstack, getValue }) {
  const { t } = useTranslation();
  const [programList, setProgramList] = useState();
  const [organisations, setOrganisations] = useState();
  const [cohortValue, setCohortValue] = useState();

  const setCohort = (data) => {
    setCohortValue(data);
    if (getValue) getValue(data);
  };

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
      setCohort({ ...cohortValue, program_id: obj?.id });
    } else {
      setCohort({ ...cohortValue, program_id: localData?.program_id });
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
          org_id: obj?.id,
          name: obj?.name,
        };
        await setSelectedOrgId(defaultData);
        setCohort({ ...cohortValue, org_id: obj?.id });
      } else {
        setCohort({ ...cohortValue, org_id: selectOrgId?.org_id });
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
    setCohort({ ...cohortValue, program_id: selectedItem });
  };

  const handleOrgListData = async (selectedItem) => {
    await setSelectedOrgId({
      org_id: selectedItem,
    });
    setCohort({ ...cohortValue, org_id: selectedItem });
  };

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

SelectProgramOrganisation.PropTypes = {
  _hstack: PropTypes.any,
  getValue: PropTypes.any,
};

export default memo(SelectProgramOrganisation);
