import {
  CardComponent,
  FrontEndTypo,
  Layout,
  Loading,
  campService,
} from "@shiksha/common-lib";
import { HStack, Pressable, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function CampSubjectsList({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const params = useParams();
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();

  const programDetails = JSON.parse(localStorage.getItem("program"));

  const getSubjectsData = async () => {
    if (programDetails?.program_id) {
      try {
        const result = await campService.getSubjectsList({
          program_id: programDetails?.program_id,
        });
        setSubjectsList(result?.data);
      } catch (error) {
        console.error("Error fetching subjects list:", error);
      }
    }
  };

  const assessmentTitle =
    params.type === "formative-assessment-1"
      ? t("PCR_EVALUATION_1")
      : t("PCR_EVALUATION_2");

  useEffect(async () => {
    await getSubjectsData();
    if (userTokenInfo) {
      const IpUserInfo = await getIpUserInfo(fa_id);
      let ipUserData = IpUserInfo;
      if (!IpUserInfo) {
        ipUserData = await setIpUserInfo(fa_id);
      }

      setFacilitator(ipUserData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      // _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {`${assessmentTitle} ${t("SUBJECTS")}`}
        </FrontEndTypo.H2>
        {subjectsList?.map((item, i) => (
          <CardComponent
            _vstack={{
              flex: 1,
              borderColor: "greenIconColor",
            }}
            _body={{ pt: 4 }}
            key={i}
          >
            <Pressable
              onPress={() =>
                navigate(`/camps/${params?.id}/${params?.type}/${item?.name}`)
              }
            >
              <HStack space={3}>
                <FrontEndTypo.H2 color="textMaroonColor.400">
                  {item?.name}
                </FrontEndTypo.H2>
              </HStack>
            </Pressable>
          </CardComponent>
        ))}
      </VStack>
    </Layout>
  );
}
