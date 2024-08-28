import React, { useEffect, useState } from "react";
import { HStack, VStack } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  t,
  PCusers_layout as Layout,
  GetEnumValue,
  CardComponent,
  enumRegistryService,
  ImageView,
} from "@shiksha/common-lib";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import ProfilePhoto from "../../../v2/components/Functional/ProfilePhoto/ProfilePhoto";
import PropTypes from "prop-types";

export default function LearnerBasicDetails({ userTokenInfo }) {
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState();
  const [enumOptions, setEnumOptions] = React.useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${id}`);
  };

  useEffect(async () => {
    setBenificiary(location?.state);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, []);

  return (
    <Layout
      _appBar={{ name: t("BASIC_DETAILS"), onPressBackButton }}
      analyticsPageTitle={"BENEFICIARY_BASIC_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("BASIC_DETAILS")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack px="16px" space="24px">
          <VStack alignItems={"center"}>
            {benificiary?.profile_photo_1?.id ? (
              <ImageView
                source={{
                  document_id: benificiary?.profile_photo_1?.id,
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
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("FAMILY_DETAILS")}
            label={["FATHER", "MOTHER"]}
            item={benificiary?.core_beneficiaries}
            arr={["father_first_name", "mother_first_name"]}
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
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("REFERENCE_DETAILS")}
            label={["NAME", "RELATION", "CONTACT"]}
            item={benificiary?.references[0]}
            arr={["first_name", "relation", "contact_number"]}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

LearnerBasicDetails.propTypes = {
  userTokenInfo: PropTypes.any,
};
