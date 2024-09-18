import React, { useEffect, useState } from "react";
import {
  CardComponent,
  FrontEndTypo,
  Layout,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function BenificiaryAddress({ userTokenInfo }) {
  const params = useParams();
  const [benificiary, setBenificiary] = useState();
  const [userId] = useState(params?.id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(async () => {
    const data = await benificiaryRegistoryService.getOne(userId);
    setBenificiary(data?.result);
  }, []);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${userId}`);
  };

  return (
    <Layout
      _appBar={{
        name: t("ADDRESS_DETAILS"),
        onPressBackButton,
        profile_url: userTokenInfo?.authUser?.profile_photo_1?.name,
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser || {}}
      analyticsPageTitle={"BENEFICIARY_ADDRESS_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ADDRESS_DETAILS")}
    >
      <VStack bg="white" p={"11px"}>
        <FrontEndTypo.H1 fontWeight="600" mb="3" mt="3">
          {t("ADDRESS_DETAILS")}
        </FrontEndTypo.H1>
        <CardComponent
          _vstack={{ space: 0 }}
          _hstack={{ borderBottomWidth: 0 }}
          title={t("ADDRESS_DETAILS")}
          label={[
            "ADDRESS",
            "STATE",
            "DISTRICT",
            "BLOCKS",
            "VILLAGE_WARD",
            "GRAMPANCHAYAT",
            "PINCODE",
          ]}
          item={benificiary}
          arr={[
            "address",
            "state",
            "district",
            "block",
            "village",
            "grampanchayat",
            "pincode",
          ]}
          onEdit={(e) => {
            navigate(`/beneficiary/edit/${userId}/address`);
          }}
        />
      </VStack>
    </Layout>
  );
}

BenificiaryAddress.propTypes = {
  userTokenInfo: PropTypes.object,
};
