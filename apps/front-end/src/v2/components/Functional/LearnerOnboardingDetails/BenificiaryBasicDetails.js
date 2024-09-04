import React, { useEffect, useState } from "react";
import {
  CardComponent,
  FrontEndTypo,
  GetEnumValue,
  IconByName,
  ImageView,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function BenificiaryBasicDetails({ userTokenInfo }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [requestData, setRequestData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const resultData = await benificiaryRegistoryService.getEditRequest(obj);
    if (resultData?.data?.length > 0) {
      const fieldData = JSON.parse(resultData?.data?.[0]?.fields);
      setRequestData(fieldData);
    }
    setLoading(false);
  }, []);

  const isFamilyDetailsEdit = () => {
    const data = requestData.filter((e) =>
      [
        "father_first_name",
        "father_middle_name",
        "father_last_name",
        "mother_first_name",
        "mother_middle_name",
        "mother_last_name",
      ].includes(e),
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
          ["social_category", "marital_status"].includes(e),
        ).length > 0)
    );
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("BASIC_DETAILS"),
        onPressBackButton,
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser}
      analyticsPageTitle={"BENEFICIARY_BASIC_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("BASIC_DETAILS")}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
    >
      <VStack paddingBottom="64px">
        <FrontEndTypo.H1 fontWeight="600" mx="4" mt="6">
          {t("BASIC_DETAILS")}
        </FrontEndTypo.H1>
        <VStack px="16px" space="24px">
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            space={4}
          >
            <HStack space={4} alignItems={"center"}>
              {/* <VStack>
                <ProfilePhoto
                  isProfileEdit={true}
                  editLink={edit}
                  profile_photo_1={benificiary?.profile_photo_1}
                  profile_photo_2={benificiary?.profile_photo_2}
                  profile_photo_3={benificiary?.profile_photo_3}
                />
              </VStack> */}
              <HStack alignContent={"center"} alignItems={"center"} space={2}>
                {benificiary?.profile_photo_1?.id ? (
                  <ImageView
                    source={{
                      document_id: benificiary?.profile_photo_1?.id,
                    }}
                    width={"64px"}
                    height={"64px"}
                    borderRadius="50%"
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name="AccountCircleLineIcon"
                    color="gray.300"
                    _icon={{ size: "120px" }}
                  />
                )}

                <IconByName
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={() => navigate(`/beneficiary/${id}/upload/1`)}
                />
              </HStack>
              <VStack>
                <HStack justifyContent="space-between" alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.750" bold>
                    {benificiary?.first_name ? benificiary?.first_name : "-"}
                    &nbsp;
                    {benificiary?.middle_name?.trim() === "null"
                      ? ""
                      : benificiary?.middle_name}
                    &nbsp;
                    {benificiary?.last_name == "null"
                      ? ""
                      : benificiary?.last_name}
                  </FrontEndTypo.H3>
                  {/* {benificiary?.program_beneficiaries?.status ===
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
                  )} */}
                </HStack>
                <HStack alignItems="Center">
                  {/* <IconByName name="Cake2LineIcon" color="iconColor.300" /> */}
                  <FrontEndTypo.H3 color="textGreyColor.750" fontWeight="500">
                    {moment(benificiary?.dob).format("DD/MM/YYYY")
                      ? moment(benificiary?.dob).format("DD/MM/YYYY")
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <IconByName
                name="PencilLineIcon"
                color="iconColor.200"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/basic-info`);
                }}
              />
            </HStack>
          </HStack>
          {benificiary?.profile_photo_1?.id && (
            <HStack justifyContent="space-between">
              <HStack alignItems="center" space="6">
                {[
                  benificiary?.profile_photo_1,
                  benificiary?.profile_photo_2,
                  benificiary?.profile_photo_3,
                ].map(
                  (photo) =>
                    photo?.id && (
                      <ImageView
                        key={photo?.id}
                        source={{
                          document_id: photo?.id,
                        }}
                        width={"36px"}
                        height={"36px"}
                        borderRadius="50%"
                      />
                    ),
                )}
              </HStack>
              <HStack>
                <IconByName
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={() => navigate(`/beneficiary/${id}/upload/1`)}
                />
              </HStack>
            </HStack>
          )}
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("CONTACT_DETAILS")}
            label={[
              "MOBILE_NUMBER",
              "MARK_AS_WHATSAPP_REGISTER",
              "TYPE_OF_MOBILE_PHONE",
              "MARK_OWNERSHIP",
              "ALTERNATIVE_NUMBER",
              "EMAIL",
            ]}
            item={{
              ...benificiary,
              mark_as_whatsapp_number:
                benificiary?.core_beneficiaries?.mark_as_whatsapp_number,

              device_type: benificiary?.core_beneficiaries?.device_type,
              device_ownership:
                benificiary?.core_beneficiaries?.device_ownership,
            }}
            arr={[
              "mobile",
              "mark_as_whatsapp_number",
              "device_type",
              "device_ownership",
              "alternative_mobile_number",
              "email_id",
            ]}
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

BenificiaryBasicDetails.propTypes = {
  userTokenInfo: PropTypes.object,
};
