import React from "react";
import { HStack, VStack, Box, Progress, Text } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  Layout,
  CardComponent,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BenificiaryAddress() {
  const params = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [userId] = React.useState(params?.id);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requestData, setRequestData] = React.useState([]);

  React.useEffect(async () => {
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: userId,
    };
    const result = await benificiaryRegistoryService.getEditRequest(obj);
    if (result?.data?.length > 0) {
      const fieldData = JSON.parse(result?.data?.[0]?.fields);
      setRequestData(fieldData);
    }
    const data = await benificiaryRegistoryService.getOne(userId);
    setbenificiary(data?.result);
  }, []);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${userId}`);
  };

  const isAddressDetailsEdit = () => {
    const data = requestData.filter((e) =>
      [
        "lat",
        "long",
        "address",
        "street",
        "district",
        "block",
        "village",
        "grampanchayat",
        "pincode",
      ].includes(e)
    );
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        data.length > 0)
    );
  };

  return (
    <Layout _appBar={{ name: t("ADDRESS_DETAILS"), onPressBackButton }}>
      <VStack bg="white" p={"11px"}>
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
          arr={["address", "state", "district", "block", "village", "pincode"]}
          onEdit={(e) => {
            navigate(`/beneficiary/edit/${userId}/address`);
          }}
        />
      </VStack>
    </Layout>
  );
}
