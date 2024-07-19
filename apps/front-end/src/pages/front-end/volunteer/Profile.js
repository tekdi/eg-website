import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  ImageView,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import Layout from "onest/Layout";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import schema from "./registration/schema";
import moment from "moment";

export default function Profile() {
  const [volunteer, setVolunteer] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      const user = await facilitatorRegistryService.getInfo();
      setVolunteer(user);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout
      userAccess
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
        profile_url: volunteer?.profile_photo_1?.name,
        name: [volunteer?.first_name, volunteer?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      volunteer={volunteer}
      analyticsPageTitle={"VOLUNTEER_PROFILE"}
      pageTitle={t("VOLUNTEER")}
      stepTitle={t("PROFILE")}
    >
      <VStack pb="10">
        <VStack paddingLeft="16px" pt={4} paddingRight="16px" space="24px">
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            space={4}
          >
            <HStack space={6} alignItems={"center"}>
              <HStack position="relative" p={2}>
                {volunteer?.profile_photo_1?.id ? (
                  <ImageView
                    source={{ document_id: volunteer?.profile_photo_1?.id }}
                    width={"64px"}
                    height={"64px"}
                  />
                ) : (
                  <IconByName
                    name="AccountCircleLineIcon"
                    color="textGreyColor.300"
                    _icon={{ size: "64px" }}
                  />
                )}

                {volunteer?.user_roles?.[0]?.status !== "approved" && (
                  <IconByName
                    p="0"
                    position="absolute"
                    top="-5"
                    right="-10"
                    name="PencilLineIcon"
                    color="iconColor.200"
                    _icon={{ size: "20" }}
                    onPress={(e) => navigate(`/profile/photo`)}
                  />
                )}
              </HStack>
              <VStack position="relative" p="2">
                <HStack justifyContent="space-between" alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.200" fontWeight="700">
                    {`${volunteer?.first_name ? volunteer?.first_name : ""} ${
                      volunteer?.middle_name ? volunteer?.middle_name : ""
                    } ${volunteer?.last_name ? volunteer?.last_name : ""}`}
                  </FrontEndTypo.H3>
                </HStack>
                <HStack alignItems="Center">
                  {/* <IconByName name="Cake2LineIcon" color="iconColor.300" /> */}
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    {volunteer?.dob &&
                    moment(volunteer?.dob, "YYYY-MM-DD", true).isValid()
                      ? moment(volunteer?.dob).format("DD/MM/YYYY")
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
                {volunteer?.user_roles?.[0]?.status !== "approved" && (
                  <IconByName
                    p="0"
                    position="absolute"
                    top="-5"
                    right="-15"
                    name="PencilLineIcon"
                    color="iconColor.200"
                    _icon={{ size: "20" }}
                    onPress={(e) => {
                      navigate(`/profile/1/edit`);
                    }}
                  />
                )}
              </VStack>
            </HStack>
          </HStack>

          {Object.keys(schema?.properties || {})?.map((item) => (
            <CardComponent
              key={item}
              title={
                item == 1
                  ? t("BASIC_DETAILS")
                  : item == 2
                  ? t("ADDRESS_DETAILS")
                  : item == 3
                  ? t("QUALIFICATION")
                  : item == 4
                  ? t("CONTACT_DETAILS")
                  : ""
              }
              {...(volunteer?.user_roles?.[0]?.status !== "approved"
                ? { onEdit: (e) => navigate(`/profile/${item}/edit`) }
                : {})}
              item={{
                ...volunteer,
                qualification:
                  volunteer?.qualifications?.qualification_master?.name || "-",
              }}
              label={Object.values(schema?.properties?.[item].properties || {})}
              arr={Object.keys(schema?.properties?.[item].properties || {})}
            />
          ))}
        </VStack>
      </VStack>
    </Layout>
  );
}
