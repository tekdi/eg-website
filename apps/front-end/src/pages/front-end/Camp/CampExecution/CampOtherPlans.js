import { FrontEndTypo, Layout } from "@shiksha/common-lib";
import {
  Box,
  HStack,
  Pressable,
  Progress,
  Stack,
  VStack,
  Alert,
  Image,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { RadioBtn } from "component/BaseInput";

export default function CampOtherPlans({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const [error, setError] = React.useState(false);
  const { id } = useParams();
  const [reasonData, setReasonData] = React.useState([
    {
      label: "hii",
      value: "hii",
    },
    {
      label: "sdsds",
      value: "sdsdsdsd",
    },
  ]);

  const [reason, setReason] = React.useState();
  const navigate = useNavigate();

  console.log("reason", reason);

  const submitReason = () => {
    console.log("hii");
    if (reason) {
      console.log("API Call");
    } else {
      setError(true);
    }
  };

  return (
    <Layout
      _appBar={{ name: t("CAMP_EXECUTION") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack space={2} padding={5}>
        <FrontEndTypo.H1 alignSelf={"center"} color={"textMaroonColor.400"}>
          {t("CAMP_OTHER_PLAN")}
        </FrontEndTypo.H1>
        <VStack borderWidth={1} alignItems={"center"} padding={5}>
          <FrontEndTypo.H1 alignSelf={"center"} color={"textMaroonColor.400"}>
            {t("WHATS_YOUR_PLAN_TODAY")}
          </FrontEndTypo.H1>
          <FrontEndTypo.H3 alignSelf={"center"} color={"textMaroonColor.400"}>
            {t("SELECT_MESSAGE")}
          </FrontEndTypo.H3>
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
          <FrontEndTypo.Primarybutton px={5} onPress={submitReason}>
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
}
