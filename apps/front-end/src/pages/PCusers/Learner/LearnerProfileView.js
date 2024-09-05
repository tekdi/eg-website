import {
  FrontEndTypo,
  IconByName,
  ImageView,
  PCusers_layout as Layout,
  PcuserService,
} from "@shiksha/common-lib";
import Menu from "component/Beneficiary/Menu";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import { Stack, VStack } from "native-base";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
            width="fit-content"
            status={beneficiary?.program_beneficiaries?.status}
            is_duplicate={beneficiary?.is_duplicate}
            is_deactivated={beneficiary?.is_deactivated}
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
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
                }),
            },
            {
              title: "ADDRESS_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerAddAddress`, {
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
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
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
                }),
            },
            {
              title: "EDUCATION_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerEducationDetails`, {
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
                }),
            },
            {
              title: "BENEFICIARY_DISABILITY_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/disability-details`, {
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
                }),
            },
            {
              title: "ENROLLMENT_DETAILS",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerEnrollmentDetails`, {
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
                }),
            },
            {
              title: "JOURNEY_IN_PROJECT_PRAGATI",
              onPress: () =>
                navigate(`/learners/list-view/${id}/learnerJourneyDetails`, {
                  state: {
                    ...beneficiary,
                    filter: location.state?.filter || {},
                  },
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
