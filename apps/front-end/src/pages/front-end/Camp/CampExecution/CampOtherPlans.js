import React from "react";
import {
  FrontEndTypo,
  Layout,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { RadioBtn } from "component/BaseInput";

const CampOtherPlans = React.memo(({ footerLinks, userTokenInfo }) => {
  const { t } = useTranslation();
  const [error, setError] = React.useState(false);
  const { id } = useParams();
  const [reasonData, setReasonData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [reason, setReason] = React.useState();
  const navigate = useNavigate();

  const enumData = React.useCallback(async () => {
    const listOfEnum = await enumRegistryService.listOfEnum();
    const absentReasons = listOfEnum?.data?.CAMP_ABSENT_REASONS;
    const transformedAbsentReasons = absentReasons.map((reason) => ({
      label: reason.title,
      value: reason.value,
    }));
    setReasonData(transformedAbsentReasons);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    enumData();
  }, [enumData]);

  const submitReason = React.useCallback(async () => {
    const payLoad = {
      camp_id: id,
      camp_day_happening: "no",
      camp_day_not_happening_reason: reason,
    };
    if (reason) {
      await campService.campActivity(payLoad);
      navigate(`/camps`);
    } else {
      setError(true);
    }
  }, [id, reason, navigate]);

  return (
    <Layout
      _appBar={{
        name: t("CAMP_OTHER_PLANS"),
        onPressBackButton: () => navigate(`/camps/${id}/campexecution`),
      }}
      facilitator={userTokenInfo?.authUser || {}}
      loading={loading}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"CAMP_OTHERPLANS"}
      pageTitle={t("CAMP_OTHER_PLANS")}
    >
      <VStack space={2} padding={5}>
        <FrontEndTypo.H1>{t("CAMP_EXECUTION")}</FrontEndTypo.H1>
        <FrontEndTypo.H3 color={"textGreyColor.750"}>
          {t("CAMP_OTHER_PLAN")}
        </FrontEndTypo.H3>
        <VStack pt={5} space={4}>
          <FrontEndTypo.H2 color={"textGreyColor.750"}>
            {t("WHATS_YOUR_PLAN_TODAY")}
          </FrontEndTypo.H2>
          <RadioBtn
            directionColumn={"column"}
            value={reason || []}
            onChange={(e) => {
              setReason(e);
              setError(false);
            }}
            schema={{
              grid: 1,
              _hstack: {
                maxH: 130,
                overflowY: "scroll",
              },
            }}
            options={{
              enumOptions: reasonData,
            }}
          />
          {error && (
            <FrontEndTypo.H3 alignSelf={"start"} color={"textMaroonColor.400"}>
              {t("SELECT_MESSAGE")}
            </FrontEndTypo.H3>
          )}
          <FrontEndTypo.Secondarybutton px={5} onPress={submitReason}>
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
});

export default CampOtherPlans;
