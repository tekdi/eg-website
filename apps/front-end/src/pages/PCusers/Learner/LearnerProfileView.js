import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HStack, VStack, Divider, Stack } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  PCusers_layout as Layout,
  ImageView,
  PcuserService,
} from "@shiksha/common-lib";
import Clipboard from "component/Clipboard";
import { ChipStatus } from "component/BeneficiaryStatus";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function LearnerProfileView({ userTokenInfo }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = React.useState({});

  const location = useLocation();
  const locationData = location?.state?.state;

  const getLearnerInfo = async () => {
    const payload = {
      academic_year_id: locationData?.academic?.academic_year_id,
      program_id: locationData?.program_id,
      id: id,
    };
    const data = await PcuserService.getLearnerDetails(payload);
    setBeneficiary(data?.result);
    setLoading(false);
  };

  useEffect(() => {
    getLearnerInfo();
  }, []);

  return (
    <Layout
      facilitator={userTokenInfo?.authUser}
      _appBar={{
        name: t("LEARNER_PROFILE"),
        onPressBackButton: () => {
          navigate("/learners/list-view", {
            state: location.state?.filter,
          });
        },
      }}
      loading={loading}
      analyticsPageTitle={"LEARNER_PROFILE"}
      pageTitle={t("LEARNER_PROFILE")}
    >
      <VStack p="4" space="6">
        <VStack alignItems="center">
          {beneficiary?.profile_photo_1?.id ? (
            <ImageView
              source={{
                document_id: beneficiary?.profile_photo_1?.id,
              }}
              width="190px"
              height="190px"
            />
          ) : (
            <IconByName
              isDisabled
              name="AccountCircleLineIcon"
              color="gray.300"
              _icon={{ size: "190px" }}
            />
          )}
        </VStack>
        <Stack alignItems={"center"}>
          {![
            "enrolled_ip_verified",
            "registered_in_camp",
            "ineligible_for_pragati_camp",
            "10th_passed",
            "pragati_syc",
          ].includes(beneficiary?.program_beneficiaries?.status) ? (
            <FrontEndTypo.H2 bold color="textMaroonColor.400">
              {[
                beneficiary?.first_name,
                beneficiary?.middle_name,
                beneficiary?.last_name,
              ]
                .filter(Boolean)
                .join(" ")}
            </FrontEndTypo.H2>
          ) : (
            <FrontEndTypo.H2 bold color="textMaroonColor.400">
              {[
                beneficiary?.program_beneficiaries?.first_name,
                beneficiary?.program_beneficiaries?.middle_name,
                beneficiary?.program_beneficiaries?.last_name,
              ]
                .filter(Boolean)
                .join(" ")}
            </FrontEndTypo.H2>
          )}

          <Clipboard text={beneficiary?.id}>
            <FrontEndTypo.H1 bold>{beneficiary?.id}</FrontEndTypo.H1>
          </Clipboard>
          <ChipStatus
            status={beneficiary?.program_beneficiaries?.status}
            rounded={"sm"}
          />
        </Stack>
        <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
          {t("PROFILE_DETAILS")}
        </FrontEndTypo.H3>
        <Menu
          menus={[
            {
              title: "BASIC_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerBasicDetails`, {
                  state: beneficiary,
                }),
            },
            {
              title: "ADD_YOUR_ADDRESS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerAddAddress`, {
                  state: beneficiary,
                }),
            },
          ]}
        />
        <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
          {t("OTHER_DETAILS")}
        </FrontEndTypo.H3>
        <Menu
          menus={[
            {
              title: "DOCUMENT_CHECKLIST",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerDocumentDetails`, {
                  state: beneficiary,
                }),
            },
            {
              title: "EDUCATION_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerEducationDetails`, {
                  state: beneficiary,
                }),
            },
            {
              title: "ENROLLMENT_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerEnrollmentDetails`, {
                  state: beneficiary,
                }),
            },
            {
              title: "JOURNEY_IN_PROJECT_PRAGATI",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerJourneyDetails`, {
                  state: beneficiary,
                }),
            },
          ]}
        />
      </VStack>
    </Layout>
  );
}

LearnerProfileView.PropTypes = {
  userTokenInfo: PropTypes.any,
};

const Menu = ({ menus }) => {
  const { t } = useTranslation();

  return (
    <VStack
      shadow={"LearnerProfileViewShadow"}
      bg="boxBackgroundColour.100"
      borderColor="garyTitleCardBorder"
      borderRadius="5px"
      borderWidth="1px"
      px="4"
      p="2"
      pb="3"
      divider={
        <Divider orientation="horizontal" bg="btnGray.100" thickness="1" />
      }
    >
      {menus?.map((menu) => (
        <HStack
          key={menu}
          alignItems="center"
          justifyContent="space-between"
          p="2"
          pr="0"
        >
          <FrontEndTypo.H3 color="floatingLabelColor.500" fontWeight={"600"}>
            {t(menu?.title)}
          </FrontEndTypo.H3>

          <IconByName
            name="ArrowRightSLineIcon"
            onPress={menu?.onPress || (() => console.log("not onpress"))}
            color="floatingLabelColor.500"
            _icon={{ size: "20" }}
            {...(menu?._icon || {})}
          />
        </HStack>
      ))}
    </VStack>
  );
};

Menu.PropTypes = {
  menus: PropTypes.array,
};
