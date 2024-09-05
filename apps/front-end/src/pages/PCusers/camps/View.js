import {
  Breadcrumb,
  FrontEndTypo,
  IconByName,
  ImageView,
  PCusers_layout as Layout,
  campService,
} from "@shiksha/common-lib";
import Menu from "component/Beneficiary/Menu";
import Chip, { CampChipStatus, ChipStatus } from "component/Chip";
import { HStack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function CampProfileView({ userTokenInfo }) {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [prerakProfile, setPrerakProfile] = useState();
  const location = useLocation();
  const [campData, setCampData] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    getPrerakCampProfile();
  }, []);

  const getPrerakCampProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
      };
      const result = await campService.getPrerakCampProfile(id, payload);
      setPrerakProfile(result?.faciltator[0]);
      setCampData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const navigateOnClick = (path) => {
    if (path) {
      navigate(path, {
        state: {
          academic_year_id: location.state?.academic_year_id,
          program_id: location.state?.program_id,
          user_id: location.state?.user_id,
        },
      });
    }
  };

  return (
    <Layout
      _appBar={{
        name: t("CAMP_DETAILS"),
        onPressBackButton: () => {
          navigate("/camps");
        },
      }}
      loading={loading}
      analyticsPageTitle={"CAMP_DETAILS"}
      pageTitle={t("CAMP_DETAILS")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <VStack p="4">
        <VStack alignItems={"center"} flexWrap="wrap" space={2}>
          <HStack flex="0.5" justifyContent="center">
            {prerakProfile?.profile_photo_1?.name ? (
              <ImageView
                source={{
                  uri: prerakProfile?.profile_photo_1?.name,
                }}
                alt="profile photo"
                width={"150px"}
                height={"150px"}
              />
            ) : (
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="textGreyColor.300"
                _icon={{ size: "150px" }}
              />
            )}
          </HStack>
          <Breadcrumb
            _hstack={{ flexWrap: "wrap", px: 1, space: 1 }}
            drawer={":"}
            data={[
              <FrontEndTypo.H3 key="1-b">{t("CAMP")}</FrontEndTypo.H3>,
              <Chip key="2-b" py="0" px="2" _text={{ fontSize: "12px" }}>
                {id}
              </Chip>,
              <CampChipStatus
                py="1"
                px="2"
                key="3-b"
                status={campData?.group?.status}
              />,
            ]}
          />
          <Breadcrumb
            _hstack={{ flexWrap: "wrap", px: 1 }}
            drawer={":"}
            data={[
              <FrontEndTypo.H3 key="1-b">{t("PRERAK")}</FrontEndTypo.H3>,
              <Chip key="2-b" py="0" px="2" _text={{ fontSize: "12px" }}>
                {prerakProfile?.id}
              </Chip>,
              <ChipStatus
                key="3-b"
                m="0"
                py="1"
                px="2"
                w="fit-content"
                status={prerakProfile?.program_faciltators?.[0]?.status}
                is_duplicate={prerakProfile?.is_duplicate}
                is_deactivated={prerakProfile?.is_deactivated}
                rounded={"sm"}
              />,
            ]}
          />
          <FrontEndTypo.H2 bold>
            {[prerakProfile?.first_name, prerakProfile?.last_name]
              .filter(Boolean)
              .join(" ")}
          </FrontEndTypo.H2>

          <HStack alignItems={"center"}>
            <IconByName _icon={{ size: "20px" }} name="CellphoneLineIcon" />
            <FrontEndTypo.H3> {prerakProfile?.mobile}</FrontEndTypo.H3>
          </HStack>

          <HStack rounded={"md"} p="2" alignItems="center" space="2">
            <IconByName
              isDisabled
              _icon={{ size: "20px" }}
              name="MapPinLineIcon"
            />
            <FrontEndTypo.H3>
              {[
                prerakProfile?.state,
                prerakProfile?.district,
                prerakProfile?.block,
                prerakProfile?.village,
                prerakProfile?.grampanchayat,
              ]
                .filter((e) => e)
                .join(",")}
            </FrontEndTypo.H3>
          </HStack>
        </VStack>

        <VStack space={"4"}>
          <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
            {t("CAMP_DETAILS")}
          </FrontEndTypo.H3>
          <Menu
            menus={[
              {
                title: "BASIC_DETAILS",
                onPress: () => navigateOnClick(`/camps/basic-details/${id}`),
              },
              {
                title: "KIT_DETAILS",
                onPress: () => navigateOnClick(`/camps/${id}/edit_kit_details`),
              },
              {
                title: "CAMP_FACILITIES",
                onPress: () =>
                  navigateOnClick(`/camps/${id}/edit_property_facilities`),
              },
            ]}
          />

          <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
            {t("OTHER_DETAILS")}
          </FrontEndTypo.H3>
          <Menu
            menus={[
              {
                title: "LEARNERS_DETAILS",
                onPress: () => navigateOnClick(`/camps/learners/${id}`),
              },
            ]}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

CampProfileView.propTypes = {
  userTokenInfo: PropTypes.object,
};
