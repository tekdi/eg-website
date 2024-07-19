import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  BoxBlue,
  IconByName,
  setSelectedAcademicYear,
  cohortService,
  getSelectedAcademicYear,
  VolunteerAdminLayout,
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

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);

  return (
    <VolunteerAdminLayout getMenus={(e) => setMenus(e)}>
      <HStack pt={8} pl={6} space={5} alignItems={"center"}>
        <IconByName name="Home" />
        <AdminTypo.H1>{t("HOME")}</AdminTypo.H1>
      </HStack>
      <VStack justifyContent="center" alignItems="center" p={4} space={4}>
        <HStack flexWrap={"wrap"}>
          {menus
            .filter((e) => e.title.toLowerCase() !== "home" && !e?.subMenu)
            .map((item) => (
              <Pressable
                p="4"
                key={item?.title}
                onPress={() => {
                  navigate(item?.route);
                }}
              >
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
              </Pressable>
            ))}
        </HStack>
      </VStack>
    </VolunteerAdminLayout>
  );
}

export default Dashboard;
