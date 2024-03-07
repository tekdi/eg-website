import React, { useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  BoxBlue,
  IconByName,
  PoAdminLayout,
  setSelectedOrgId,
  setSelectedAcademicYear,
  setSelectedProgramId,
  cohortService,
  getSelectedAcademicYear,
} from "@shiksha/common-lib";
import {
  HStack,
  Pressable,
  VStack,
  Select,
  Modal,
  CheckIcon,
} from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { uniqBy } from "lodash";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // cohort modal
  const [modal, setModal] = useState(true);
  const [orgData, setOrgData] = useState();
  const [cohortData, setCohortData] = useState();
  const [academicData, setAcademicData] = useState();
  const [programData, setProgramData] = useState();
  const [cohortValue, setCohortValue] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let academic_Id = await getSelectedAcademicYear();
      if (academic_Id) {
        setModal(false);
      }
    };
    fetchData();
  }, []);

  const getCohortData = useCallback(async () => {
    setLoading(true);
    const result = await cohortService.getOrganisationId();
    setOrgData(result?.data);
    setLoading(false);
  }, [modal]);

  useEffect(() => {
    getCohortData();
  }, [modal]);

  const handleOrgChange = async (itemValue) => {
    setCohortValue({ ...cohortValue, org_id: itemValue });
    const data = await cohortService.getPoAcademicYear({
      organisation_id: itemValue,
    });
    setCohortData(data?.data);
    const uData = uniqBy(data?.data || [], (e) => e.academic_year_id);
    setAcademicData(uData);
  };

  const handleAcademicYearChange = async (itemValue) => {
    setCohortValue({ ...cohortValue, academic_year_id: itemValue });
    const uData = uniqBy(cohortData || [], (e) => e.program_id);
    setProgramData(uData);
  };

  const handleProgramChange = (itemValue) => {
    const data = JSON.parse(itemValue);
    setCohortValue({ ...cohortValue, data });
  };

  const handleCohortSubmit = () => {
    setSelectedAcademicYear({
      academic_year_id: cohortValue?.academic_year_id,
    });
    setSelectedProgramId({
      ...cohortValue?.data,
      program_id: cohortValue?.data?.program_id,
    });
    setSelectedOrgId({ org_id: cohortValue?.org_id });
    setModal(false);
  };
  return (
    <PoAdminLayout>
      <VStack
        flex={1}
        direction={["column", "column", "row"]}
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <HStack direction={["column", "column", "row"]} space={8}>
          <Pressable
            onPress={() => {
              navigate("/poadmin/facilitators");
            }}
          >
            <BoxBlue
              width={"250px"}
              height={"200px"}
              justifyContent="center"
              pl="3"
            >
              <VStack alignItems={"center"}>
                <IconByName name="GroupLineIcon" />
                <AdminTypo.H6 bold pt="4">
                  {t("PRERAK")}
                </AdminTypo.H6>
              </VStack>
            </BoxBlue>
          </Pressable>
          <Pressable
            onPress={() => {
              navigate("/poadmin/learners");
            }}
          >
            <BoxBlue
              width={"250px"}
              height={"200px"}
              justifyContent="center"
              pl="3"
            >
              <VStack alignItems={"center"}>
                <IconByName name="GraduationCap" />
                <AdminTypo.H6 bold pt="4">
                  {t("LEARNERS")}
                </AdminTypo.H6>
              </VStack>
            </BoxBlue>
          </Pressable>
          <Pressable
            onPress={() => {
              navigate("/poadmin/camps");
            }}
          >
            <BoxBlue
              width={"250px"}
              height={"200px"}
              justifyContent="center"
              pl="3"
            >
              <VStack alignItems={"center"}>
                <IconByName name="CommunityLineIcon" />
                <AdminTypo.H6 bold pt="4">
                  {t("CAMPS")}
                </AdminTypo.H6>
              </VStack>
            </BoxBlue>
          </Pressable>
        </HStack>
      </VStack>
      <Modal isOpen={modal} safeAreaTop={true} size="xl">
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <AdminTypo.H3 textAlign="center" color="black">
              {t("SELECT_YOUR_COHORT")}
            </AdminTypo.H3>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("ORGANISATION")}</AdminTypo.H4>
                <Select
                  selectedValue={cohortValue?.org_id}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleOrgChange(itemValue)}
                >
                  {orgData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.name}
                        value={`${item?.id}`}
                      />
                    );
                  })}
                </Select>
              </HStack>
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("ACADEMIC_YEAR")}</AdminTypo.H4>

                <Select
                  selectedValue={cohortValue?.academic_year_id}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    handleAcademicYearChange(itemValue)
                  }
                >
                  {academicData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.academic_year?.name}
                        value={`${item?.academic_year_id}`}
                        // value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("STATE")}</AdminTypo.H4>
                <Select
                  selectedValue={cohortValue?.program_id}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleProgramChange(itemValue)}
                >
                  {programData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.program?.state?.state_name}
                        value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              {cohortValue?.data?.program_id && (
                <VStack alignItems={"center"}>
                  <AdminTypo.Dangerbutton onPress={handleCohortSubmit}>
                    {t("CONTINUE")}
                  </AdminTypo.Dangerbutton>
                </VStack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </PoAdminLayout>
  );
}

export default Home;
