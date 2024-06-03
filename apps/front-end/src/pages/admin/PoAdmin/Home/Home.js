import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  BoxBlue,
  IconByName,
  PoAdminLayout,
  setSelectedAcademicYear,
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

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // cohort modal
  const [modal, setModal] = useState(true);
  const [academicYearData, setAcademicYearData] = useState();
  const [cohortValue, setCohortValue] = useState();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let academic_Id = await getSelectedAcademicYear();
      if (academic_Id) {
        setModal(false);
      }
    };
    fetchData();
  }, []);

  const handleCohortSubmit = () => {
    setSelectedAcademicYear(cohortValue);
    setModal(false);
  };

  const handleAcademicYearData = async (itemValue) => {
    const data = academicYearData.find((e) => e?.id == itemValue);
    const newData = {
      ...cohortValue,
      academic_year_id: data?.id,
      academic_year_name: data?.name,
    };
    console.log(newData);
    setCohortValue(newData);
  };

  useEffect(async () => {
    const data = await cohortService.getUpdatedAcademicYearList();
    setAcademicYearData(data?.data);
  }, []);

  return (
    <PoAdminLayout getMenus={(e) => setMenus(e)}>
      <HStack pt={8} pl={6} space={5} alignItems={"center"}>
        <IconByName name="Home" />
        <AdminTypo.H1>{t("HOME")}</AdminTypo.H1>
      </HStack>
      <VStack justifyContent="center" alignItems="center" p={4} space={4}>
        <HStack flexWrap={"wrap"}>
          {menus
            .filter((e) => e.title.toLowerCase() !== "home")
            .map((item) => (
              <Pressable
                p="4"
                key={item?.title}
                onPress={() => {
                  navigate(item?.route);
                }}
              >
                {item?.route !== "/poadmin/reports" && (
                  <BoxBlue
                    width={"200px"}
                    height={"150px"}
                    justifyContent="center"
                    // pl="3"
                  >
                    <VStack alignItems={"center"}>
                      <IconByName name={item?.icon} _icon={{ size: 35 }} />
                      <AdminTypo.H6 bold pt="4">
                        {t(item?.title)}
                      </AdminTypo.H6>
                    </VStack>
                  </BoxBlue>
                )}
              </Pressable>
            ))}
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
                  onValueChange={handleAcademicYearData}
                >
                  {academicYearData?.map((item) => (
                    <Select.Item
                      key={item.id}
                      label={item?.name}
                      value={item?.id}
                    />
                  ))}
                </Select>
              </HStack>
              {cohortValue?.academic_year_id && (
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
