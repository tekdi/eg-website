import React from "react";
import { HStack, VStack } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  benificiaryRegistoryService,
  t,
  Layout,
  enumRegistryService,
  GetEnumValue,
  CardComponent,
} from "@shiksha/common-lib";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import ProfilePhoto from "./facilitator/ProfilePhoto";

export default function BenificiaryBasicDetails() {
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [requestData, setRequestData] = React.useState([]);
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const resultData = await benificiaryRegistoryService.getEditRequest(obj);
    if (resultData?.data.length > 0) {
      const fieldData = JSON.parse(resultData?.data[0]?.fields);
      setRequestData(fieldData);
    }
  }, []);

  const edit = `/beneficiary/${benificiary?.id}/upload/1`;

  const isFamilyDetailsEdit = () => {
    const data = requestData.filter((e) =>
      [
        "father_first_name",
        "father_middle_name",
        "father_last_name",
        "mother_first_name",
        "mother_middle_name",
        "mother_last_name",
      ].includes(e)
    );
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        data.length > 0)
    );
  };
  const isPersonalDetailsEdit = () => {
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        requestData.filter((e) =>
          ["social_category", "marital_status"].includes(e)
        ).length > 0)
    );
  };
  return (
    <Layout _appBar={{ name: t("BASIC_DETAILS"), onPressBackButton }}>
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack px="16px" space="24px">
          <ProfilePhoto
            isProfileEdit={true}
            editLink={edit}
            profile_photo_1={benificiary?.profile_photo_1}
            profile_photo_2={benificiary?.profile_photo_2}
            profile_photo_3={benificiary?.profile_photo_3}
          />
          <VStack>
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H1 color="textMaroonColor.400" bold pl="2">
                {benificiary?.first_name ? benificiary?.first_name : "-"}
                &nbsp;
                {benificiary?.middle_name?.trim() === "null"
                  ? ""
                  : benificiary?.middle_name}
                &nbsp;
                {benificiary?.last_name == "null" ? "" : benificiary?.last_name}
              </FrontEndTypo.H1>
              {benificiary?.program_beneficiaries?.status ===
              "enrolled_ip_verified" ? (
                <></>
              ) : (
                <IconByName
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={(e) => {
                    navigate(`/beneficiary/edit/${id}/basic-info`);
                  }}
                />
              )}
            </HStack>
            <HStack alignItems="Center">
              <IconByName name="Cake2LineIcon" color="iconColor.300" />
              <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                {moment(benificiary?.dob).format("DD/MM/YYYY")
                  ? moment(benificiary?.dob).format("DD/MM/YYYY")
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>
          </VStack>

          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("CONTACT_DETAILS")}
            label={["SELF", "ALTERNATIVE_NUMBER", "EMAIL"]}
            item={benificiary}
            arr={["mobile", "alternative_mobile_number", "email_id"]}
            onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("FAMILY_DETAILS")}
            label={["FATHER", "MOTHER"]}
            item={benificiary?.core_beneficiaries}
            arr={["father_first_name", "mother_first_name"]}
            onEdit={
              isFamilyDetailsEdit()
                ? (e) => navigate(`/beneficiary/edit/${id}/family-details`)
                : false
            }
          />

          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("PERSONAL_DETAILS")}
            label={["SOCIAL", "MARITAL"]}
            item={{
              ...benificiary?.extended_users,
              marital_status: benificiary?.extended_users?.marital_status ? (
                <GetEnumValue
                  t={t}
                  enumType={"MARITAL_STATUS"}
                  enumOptionValue={benificiary?.extended_users?.marital_status}
                  enumApiData={enumOptions}
                />
              ) : (
                "-"
              ),
              social_category: benificiary?.extended_users?.social_category ? (
                <GetEnumValue
                  t={t}
                  enumType={"BENEFICIARY_SOCIAL_STATUS"}
                  enumOptionValue={benificiary?.extended_users?.social_category}
                  enumApiData={enumOptions}
                />
              ) : (
                "-"
              ),
            }}
            arr={["social_category", "marital_status"]}
            onEdit={
              isPersonalDetailsEdit()
                ? (e) => navigate(`/beneficiary/edit/${id}/personal-details`)
                : false
            }
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("REFERENCE_DETAILS")}
            label={["NAME", "RELATION", "CONTACT"]}
            item={benificiary?.references[0]}
            arr={["first_name", "relation", "contact_number"]}
            onEdit={(e) =>
              navigate(`/beneficiary/edit/${id}/reference-details`)
            }
          />
        </VStack>
      </VStack>
    </Layout>
  );
}
