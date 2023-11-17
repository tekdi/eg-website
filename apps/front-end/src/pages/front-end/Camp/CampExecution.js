import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  Layout,
} from "@shiksha/common-lib";
import React from "react";
import {
  Actionsheet,
  Box,
  HStack,
  Pressable,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import Drawer from "react-modern-drawer";
import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";

export default function CampExecution({ footerLinks }) {
  // const navigate = useNavigate();
  // const { t } = useTranslation();
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);

  return (
    <Layout
      _appBar={""}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack space="5" pt="5">
        <FrontEndTypo.Primarybutton flex={1}>Yes</FrontEndTypo.Primarybutton>
        <FrontEndTypo.Primarybutton flex={1}>No</FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
}
