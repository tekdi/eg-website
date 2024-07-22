import { CustomAlert, FrontEndTypo } from "@shiksha/common-lib";
import { VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function VolunteerHome({
  userTokenInfo: { authUser },
  footerLinks,
}) {
  // add user info for drawer
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Layout
      _footer={{ menues: footerLinks }}
      _appBar={{ _backBtn: { style: { visibility: "hidden" } } }}
      userAccess
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      analyticsPageTitle={"VOLUNTEER_HOME"}
      pageTitle={t("VOLUNTEER_HOME")}
      loading={loading}
    >
      <VStack p="4" space={5}>
        <FrontEndTypo.H1 color="textGreyColor.900" pl="1">
          {t("HELLO_HOME")}, {authUser?.first_name}!
        </FrontEndTypo.H1>
        <VStack
          space={4}
          borderRadius={"10px"}
          borderBottomWidth={"1px"}
          borderBottomColor={"#dcdcdc"}
          pb="10"
        >
          <FrontEndTypo.H3 color="textGreyColor.900" pt="2">
            {t("HOME")}
          </FrontEndTypo.H3>
          {authUser?.user_roles?.[0]?.status !== "approved" && (
            <CustomAlert
              title={t("VOLUNTEER_MESSAGE_NOT_APPROVED")}
              status={"info"}
            />
          )}

          {authUser?.user_roles?.[0]?.status !== "approved" ? (
            <VStack space={4}>
              <FrontEndTypo.H3 color="textGreyColor.900" py="2">
                {t("MY_PROFILE")}
              </FrontEndTypo.H3>
              <FrontEndTypo.H3 color="textGreyColor.900" py="2">
                {t("ACCESS_ALL_INFORMATION_OF_YOUR_LEARNERS_STATUS")}
              </FrontEndTypo.H3>
              <FrontEndTypo.Secondarybutton
                onPress={(e) => navigate("/profile")}
              >
                {t("VOUNTEER_UPDATE_MY_PROFILE")}
              </FrontEndTypo.Secondarybutton>
            </VStack>
          ) : (
            <FrontEndTypo.Secondarybutton onPress={(e) => navigate("/onest")}>
              {t("STARTS_YOUR_DAY")}
            </FrontEndTypo.Secondarybutton>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}
