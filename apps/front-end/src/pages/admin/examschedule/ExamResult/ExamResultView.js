import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  Breadcrumb,
  AdminLayout as Layout,
  useWindowSize,
  IconByName,
  organisationService,
  ImageView,
} from "@shiksha/common-lib";
import { HStack, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ManualResultView from "./ManualResultView";

const ExamResultView = (footerLinks) => {
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [data, setData] = useState();
  const location = useLocation();
  const userData = location?.state?.row;

  useEffect(() => {
    const fetchData = async () => {
      const obj = {
        board_id: userData?.bordID?.id,
        user_id: userData?.beneficiary_user?.beneficiary_id,
        enrollment: userData?.enrollment_number,
      };
      const data = await organisationService.resultView(obj);
      setData(data?.data?.[0]);
    };

    fetchData();
  }, []);

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
              {t("ENROLLMENT_NO")} : {data?.enrollment}
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("BOARD")} : {userData?.bordID?.name}
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("FATHER_NAME")} : {data?.father || "-"}
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("MOTHER_NAME")} : {data?.mother || "-"}
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("DOB")} : {data?.dob || "-"}
            </AdminTypo.H6>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("CLASS")} : {data?.course_class || "-"}
            </AdminTypo.H6>

            {data?.document_id ? (
              <ImageView
                frameborder="0"
                _box={{ flex: 1 }}
                width="100%"
                height="100%"
                source={{ document_id: data?.document_id }}
                alt="result"
              />
            ) : (
              <ManualResultView data={data} />
            )}
          </VStack>
        </HStack>
      </Stack>
    </Layout>
  );
};

export default ExamResultView;
