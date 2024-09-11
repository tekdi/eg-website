import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FrontEndTypo,
  Layout,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { VStack, ScrollView } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { RadioBtn } from "component/BaseInput";
import PropTypes from "prop-types";

const CampOtherPlans = memo(({ footerLinks, userTokenInfo }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [reasonData, setReasonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState();
  const [camp, setCamp] = useState({});
  const navigate = useNavigate();
  const refButton = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);

  useEffect(() => {
    const getCampDetails = async () => {
      setLoading(true);
      try {
        const response = await campService.getCampDetails({ id });
        setCamp(response?.data);

        const listOfEnum = await enumRegistryService.listOfEnum();
        let absentReasons = listOfEnum?.data?.CAMP_ABSENT_REASONS;
        if (response?.data?.type == "pcr") {
          absentReasons = listOfEnum?.data?.NEEV_CAMP_ABSENT_REASONS;
        }
        const transformedAbsentReasons = absentReasons?.map((reason) => ({
          label: reason.title,
          value: reason.value,
        }));
        setReasonData(transformedAbsentReasons);
      } catch (error) {
        console.log("Error in fetching camp details", error);
      } finally {
        setLoading(false);
      }
    };
    getCampDetails();
  }, []);

  useEffect(() => {
    if (refButton?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(bodyHeight - refButton?.current?.clientHeight);
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight]);

  const submitReason = useCallback(async () => {
    if (!reason) {
      setError(true);
    }
    const payLoad = {
      camp_id: id,
      camp_day_happening: "no",
      camp_day_not_happening_reason: reason,
      camp_type: camp?.type,
    };
    setLoading(true);
    try {
      await campService.campActivity(payLoad);
      navigate(`/camps`);
    } catch (error) {
      setError(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [id, reason, navigate]);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
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
      <ScrollView maxH={loadingHeight} minH={loadingHeight}>
        <VStack space={3} padding={5}>
          <VStack>
            <FrontEndTypo.H2>{t("CAMP_EXECUTION")}</FrontEndTypo.H2>
            <FrontEndTypo.H4 color={"textGreyColor.750"}>
              {t("CAMP_OTHER_PLAN")}
            </FrontEndTypo.H4>
          </VStack>
          <VStack space={1}>
            <FrontEndTypo.H3 bold color={"textMaroonColor.400"}>
              {t("WHATS_YOUR_PLAN_TODAY")}
            </FrontEndTypo.H3>
            {error && (
              <FrontEndTypo.H3
                alignSelf={"start"}
                color={"textMaroonColor.500"}
              >
                {t("SELECT_MESSAGE")}
              </FrontEndTypo.H3>
            )}
            <RadioBtn
              directionColumn={"column"}
              value={reason || []}
              onChange={(e) => {
                setReason(e);
                setError(false);
              }}
              schema={{
                grid: 1,
              }}
              options={{
                enumOptions: reasonData,
              }}
            />
          </VStack>
        </VStack>
      </ScrollView>
      <VStack
        ref={refButton}
        width={"100%"}
        bg={"white"}
        flex={1}
        safeAreaTop
        position="fixed"
        bottom="70px"
        zIndex={"9999999"}
        alignItems={"center"}
        py="4"
      >
        <FrontEndTypo.Secondarybutton px="5" onPress={submitReason}>
          {t("SAVE_AND_PROFILE")}
        </FrontEndTypo.Secondarybutton>
      </VStack>
    </Layout>
  );
});

export default CampOtherPlans;

CampOtherPlans.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
