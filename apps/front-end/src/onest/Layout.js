import React from "react";
import PropTypes from "prop-types";
import { FrontEndTypo, Layout, Loading } from "@shiksha/common-lib";
import { Alert, HStack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// add userAccess
export default function App({
  children,
  checkUserAccess,
  _appBar,
  _drawer,
  ...props
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userDetails = JSON.parse(localStorage.getItem("userData"));
  if (userDetails?.user_id || !checkUserAccess) {
    return (
      <Layout
        allowRoles={["facilitator", "volunteer", "beneficiary"]}
        _appBar={{
          onlyIconsShow: ["loginBtn", "backBtn", "userInfo", "langBtn"],
          ..._appBar,
        }}
        _drawer={{
          isHideProgress: true,
          exceptIconsShow: ["resultsBtn"],
          ...(_drawer || {}),
        }}
        {...props}
      >
        {children}
      </Layout>
    );
  } else {
    return (
      <Loading
        customComponent={
          <VStack alignItems={"conter"} space={4}>
            <Alert w="100%" status={"warning"}>
              <VStack w="100%">
                <HStack space={2} alignItems={"center"}>
                  <Alert.Icon color={"warning"} />
                  <FrontEndTypo.H3>{t("PAGE_NOT_ACCESSABLE")}</FrontEndTypo.H3>
                </HStack>
              </VStack>
            </Alert>

            <FrontEndTypo.Primarybutton onPress={() => navigate(-1)}>
              {t("BACK")}
            </FrontEndTypo.Primarybutton>
          </VStack>
        }
      />
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
};
