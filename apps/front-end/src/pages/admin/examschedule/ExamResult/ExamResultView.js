import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  Breadcrumb,
  AdminLayout as Layout,
  useWindowSize,
  CardComponent,
  IconByName,
  PoAdminLayout,
  cohortService,
  enumRegistryService,
  getSelectedProgramId,
  organisationService,
  setSelectedProgramId,
  ImageView,
} from "@shiksha/common-lib";
import {
  HStack,
  Progress,
  Radio,
  ScrollView,
  Select,
  Stack,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TextBox from "./TextBox";
import ManualResultView from "./ManualResultView";

const ExamResultView = (footerLinks) => {
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [fileType, setfileType] = useState("pdf");

  const receiptUrl = {
    key: "dummy1714383633910.pdf",
    fileUrl:
      "https://eg-dev-1.s3.ap-south-1.amazonaws.com/dummy1714383633910.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5CBNW7QSEUPAGE7O%2F20240429%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240429T094236Z&X-Amz-Expires=3600&X-Amz-Signature=6363c48b473df271679e66b43284696d6f89cbe100e02ffbd5a963f46435f25a&X-Amz-SignedHeaders=host&x-id=GetObject",
    documentData: {
      id: 3287,
      name: "dummy1714383633910.pdf",
      doument_type: "enrollment_receipt",
      document_sub_type: "",
      path: "/user/docs",
      provider: "s3",
      context: null,
      context_id: null,
    },
  };
  return (
    <Layout
      w={Width}
      h={Height}
      getRefAppBar={(e) => setRefAppBar(e)}
      refAppBar={refAppBar}
      _sidebar={footerLinks}
    >
      <Stack p={4} space={4}>
        <HStack justifyContent={"space-between"}>
          <Breadcrumb
            _hstack={{ alignItems: "center" }}
            drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
            data={[
              {
                title: (
                  <HStack alignItems={"center"} space={2}>
                    <IconByName name="Home4LineIcon" size="md" />
                    <AdminTypo.H4 bold color="Activatedcolor.400">
                      {t("HOME")}
                    </AdminTypo.H4>
                  </HStack>
                ),
                link: "/",
                icon: "GroupLineIcon",
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {t("LEARNER_EXAM_RESULT")}
                  </AdminTypo.H4>
                ),
                link: "/admin/exams/list",
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {"learner Name"}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </HStack>

        <HStack justifyContent={"space-between"}>
          <VStack width={"100%"} height={"1000px"} space={4}>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("ENROLLMENT_NO")} : 123456789
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("BOARD")} : NIOS
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("FATHER_NAME")} : RAVINDRA
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("MOTHER_NAME")} : SANGITA
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("DOB")} : 03-05-1995
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("CLASS")} : 10
            </AdminTypo.H6>
            {fileType !== "pdf" ? (
              <ImageView
                frameborder="0"
                _box={{ flex: 1 }}
                width="100%"
                height="100%"
                urlObject={receiptUrl}
                alt="aadhaar_front"
              />
            ) : (
              <ManualResultView />
            )}
          </VStack>
        </HStack>
      </Stack>
    </Layout>
  );
};

export default ExamResultView;
