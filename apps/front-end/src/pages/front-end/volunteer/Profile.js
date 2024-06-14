import { CardComponent, FrontEndTypo, IconByName } from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import Layout from "onest/Layout";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import schema from "./registration/schema";
import ProfilePhoto from "v2/components/Functional/ProfilePhoto/ProfilePhoto";
import moment from "moment";

export default function Profile({ userTokenInfo: { authUser } }) {
  const [facilitator, setFacilitator] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      setFacilitator(authUser);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      // _footer={{ menues: footerLinks }}
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
            <HStack space={4} alignItems={"center"}>
              <VStack>
                <ProfilePhoto
                  profile_photo_1={facilitator?.profile_photo_1}
                  profile_photo_2={facilitator?.profile_photo_2}
                  profile_photo_3={facilitator?.profile_photo_3}
                  isProfileEdit={false}
                />
              </VStack>
              <VStack>
                <HStack justifyContent="space-between" alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.200" fontWeight="700">
                    {`${
                      facilitator?.first_name ? facilitator?.first_name : ""
                    } ${
                      facilitator?.middle_name ? facilitator?.middle_name : ""
                    } ${facilitator?.last_name ? facilitator?.last_name : ""}`}
                  </FrontEndTypo.H3>

                  {/* {isNameEdit() && (
                      <IconByName
                        name="PencilLineIcon"
                        color="iconColor.200"
                        _icon={{ size: "20" }}
                        onPress={(e) => {
                          navigate(`/profile/edit/basic_details`);
                        }}
                      />
                    )} */}
                </HStack>
                <HStack alignItems="Center">
                  {/* <IconByName name="Cake2LineIcon" color="iconColor.300" /> */}
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    {facilitator?.dob &&
                    moment(facilitator?.dob, "YYYY-MM-DD", true).isValid()
                      ? moment(facilitator?.dob).format("DD/MM/YYYY")
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </HStack>
          </HStack>

          {Object.keys(schema?.properties || {})?.map((item) => (
            <CardComponent
              grid={2}
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
              onEdit={(e) => navigate(`/profile/${item}/edit`)}
              item={{
                ...facilitator,
                qualification:
                  facilitator?.qualifications?.qualification_master?.name ||
                  "-",
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
