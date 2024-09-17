import React, { useEffect, useState } from "react";
import {
  CardComponent,
  FrontEndTypo,
  GetEnumValue,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  getUniqueArray,
} from "@shiksha/common-lib";
import { Text, VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const GetOptions = ({ array, enumType, enumApiData }) => {
  const { t } = useTranslation();
  return (
    <VStack>
      {getUniqueArray(array)?.map((item, index) => (
        <Text
          fontSize="14px"
          fontWeight="400"
          lineHeight="24px"
          color={"inputValueColor"}
        >
          <GetEnumValue
            fontSize="14px"
            key={index}
            t={t}
            enumOptionValue={item}
            {...{ enumType, enumApiData }}
          />
        </Text>
      ))}
    </VStack>
  );
};

GetOptions.propTypes = {
  array: PropTypes.array,
  enumType: PropTypes.string,
  enumApiData: PropTypes.object,
};

export default function BenificiaryEducation({ userTokenInfo }) {
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
  };

  useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("EDUCATION_DETAILS"),
        onlyIconsShow: ["langBtn", "backBtn"],
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${id}`);
        },
        profile_url: userTokenInfo?.authUser?.profile_photo_1?.name,
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser || {}}
      analyticsPageTitle={"BENEFICIARY_EDUCATION_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("EDUCATION_DETAILS")}
    >
      <VStack bg="white" px="5" py="3">
        <FrontEndTypo.H1 fontWeight="600" mb="3" mt="3">
          {t("EDUCATION_DETAILS")}
        </FrontEndTypo.H1>
        <CardComponent
          _vstack={{ space: 0 }}
          _hstack={{ borderBottomWidth: 0 }}
          title={t("EDUCATION_DETAILS")}
          label={[
            "TYPE_OF_LEARNER",
            ...(benificiary?.core_beneficiaries?.type_of_learner &&
            ["school_dropout", "already_enrolled_in_open_school"].includes(
              benificiary?.core_beneficiaries?.type_of_learner,
            )
              ? [
                  "LAST_STANDARD_OF_EDUCATION",
                  "LAST_YEAR_OF_EDUCATION",
                  "PREVIOUS_SCHOOL_TYPE",
                  "REASON_FOR_LEAVING",
                  "LEARNER_LEARNING_LEVEL",
                ]
              : []),

            ...(benificiary?.core_beneficiaries?.type_of_learner &&
            ["never_enrolled"].includes(
              benificiary?.core_beneficiaries?.type_of_learner,
            )
              ? ["REASON_FOR_LEAVING", "LEARNER_LEARNING_LEVEL"]
              : []),

            ...(benificiary?.core_beneficiaries?.type_of_learner &&
            ["already_open_school_syc"].includes(
              benificiary?.core_beneficiaries?.type_of_learner,
            )
              ? [
                  "PREVIOUS_SCHOOL_TYPE",
                  "REASON_FOR_LEAVING",
                  "REGISTERED_IN_TENTH_DATE",
                  "LEARNER_LEARNING_LEVEL",
                ]
              : []),

            ...(benificiary?.core_beneficiaries?.type_of_learner &&
            ["stream_2_mainstream_syc"].includes(
              benificiary?.core_beneficiaries?.type_of_learner,
            )
              ? [
                  "REASON_FOR_LEAVING",
                  "IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM",
                  "LEARNER_LEARNING_LEVEL",
                ]
              : []),
          ].filter(Boolean)}
          item={{
            type_of_learner: benificiary?.core_beneficiaries
              ?.type_of_learner ? (
              <GetEnumValue
                t={t}
                enumType={"TYPE_OF_LEARNER"}
                enumOptionValue={benificiary.core_beneficiaries.type_of_learner}
                enumApiData={enumOptions}
              />
            ) : (
              "-"
            ),

            reason_of_leaving_education: benificiary?.core_beneficiaries
              ?.reason_of_leaving_education ? (
              <GetEnumValue
                t={t}
                enumType={"REASON_OF_LEAVING_EDUCATION"}
                enumOptionValue={
                  benificiary.core_beneficiaries.reason_of_leaving_education
                }
                enumApiData={enumOptions}
              />
            ) : (
              "-"
            ),

            learning_level: benificiary?.program_beneficiaries
              ?.learning_level ? (
              <GetEnumValue
                t={t}
                enumType={"BENEFICIARY_LEARNING_LEVEL"}
                enumOptionValue={
                  benificiary.program_beneficiaries.learning_level
                }
                enumApiData={enumOptions}
              />
            ) : (
              "-"
            ),

            education_10th_exam_year:
              benificiary?.core_beneficiaries?.type_of_learner ===
              "stream_2_mainstream_syc"
                ? benificiary?.core_beneficiaries?.education_10th_exam_year
                : "-",

            ...(benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) && {
                last_standard_of_education: benificiary?.core_beneficiaries
                  ?.last_standard_of_education ? (
                  <GetEnumValue
                    t={t}
                    enumType={"LAST_STANDARD_OF_EDUCATION"}
                    enumOptionValue={
                      benificiary.core_beneficiaries.last_standard_of_education
                    }
                    enumApiData={enumOptions}
                  />
                ) : (
                  "-"
                ),

                last_standard_of_education_year: benificiary?.core_beneficiaries
                  ?.last_standard_of_education_year
                  ? benificiary?.core_beneficiaries
                      ?.last_standard_of_education_year
                  : "-",

                previous_school_type: benificiary?.core_beneficiaries
                  ?.previous_school_type ? (
                  <GetEnumValue
                    t={t}
                    enumType={"PREVIOUS_SCHOOL_TYPE"}
                    enumOptionValue={
                      benificiary.core_beneficiaries.previous_school_type
                    }
                    enumApiData={enumOptions}
                  />
                ) : (
                  "-"
                ),

                education_10th_date:
                  benificiary?.core_beneficiaries?.type_of_learner ===
                  "already_open_school_syc"
                    ? benificiary?.core_beneficiaries?.education_10th_date
                    : "-",
                education_10th_exam_year:
                  benificiary?.core_beneficiaries?.type_of_learner ===
                  "stream_2_mainstream_syc"
                    ? benificiary?.core_beneficiaries?.education_10th_exam_year
                    : "-",
              }),
          }}
          arr={(() => {
            let arr = [];
            if (
              benificiary?.core_beneficiaries?.type_of_learner ||
              benificiary?.core_beneficiaries?.reason_of_leaving_education ||
              benificiary?.program_beneficiaries?.learning_level
            ) {
              if (
                ["school_dropout", "already_enrolled_in_open_school"].includes(
                  benificiary?.core_beneficiaries?.type_of_learner,
                )
              ) {
                arr = [
                  ...arr,
                  "type_of_learner",
                  "last_standard_of_education",
                  "last_standard_of_education_year",
                  "previous_school_type",
                  "reason_of_leaving_education",
                  "learning_level",
                ];
              }

              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "never_enrolled"
              ) {
                arr = [
                  ...arr,
                  "type_of_learner",
                  "reason_of_leaving_education",
                  "learning_level",
                ];
              }

              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "already_open_school_syc"
              ) {
                arr = [
                  ...arr,
                  "type_of_learner",
                  "previous_school_type",
                  "reason_of_leaving_education",
                  "education_10th_date",
                  "learning_level",
                ];
              }

              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "stream_2_mainstream_syc"
              ) {
                arr = [
                  ...arr,
                  "type_of_learner",
                  "reason_of_leaving_education",
                  "education_10th_exam_year",
                  "learning_level",
                ];
              }
            }

            return arr;
          })()}
          onEdit={(e) => {
            navigate(`/beneficiary/edit/${id}/education`);
          }}
        />

        <VStack mt={6} mb={2}>
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("LEARNER_ASPIRATION")}
            label={[
              "MOTIVATION_TO_PASS_10TH",
              "SUPPORT_FROM_PRAGATI",
              "WILL_YOUR_PARENTS_SUPPORT_YOUR_STUDIES",
              "CAREER_ASPIRATION",
              "REMARKS",
            ]}
            item={{
              learning_motivation:
                benificiary?.program_beneficiaries?.learning_motivation &&
                benificiary.program_beneficiaries.learning_motivation.length >
                  0 ? (
                  <GetOptions
                    array={
                      benificiary.program_beneficiaries.learning_motivation
                    }
                    enumApiData={enumOptions}
                    enumType={"LEARNING_MOTIVATION"}
                  />
                ) : (
                  "-"
                ),

              type_of_support_needed:
                benificiary?.program_beneficiaries?.type_of_support_needed &&
                benificiary.program_beneficiaries.type_of_support_needed
                  .length > 0 ? (
                  <GetOptions
                    array={
                      benificiary.program_beneficiaries.type_of_support_needed
                    }
                    enumApiData={enumOptions}
                    enumType={"TYPE_OF_SUPPORT_NEEDED"}
                  />
                ) : (
                  "-"
                ),

              parent_support:
                benificiary?.core_beneficiaries?.parent_support ?? "-",

              career_aspiration: benificiary?.core_beneficiaries
                ?.career_aspiration ? (
                <GetEnumValue
                  t={t}
                  enumOptionValue={
                    benificiary.core_beneficiaries.career_aspiration
                  }
                  enumApiData={enumOptions}
                  enumType={"CAREER_ASPIRATION"}
                />
              ) : (
                "-"
              ),

              career_aspiration_details:
                benificiary?.core_beneficiaries?.career_aspiration_details ||
                "-",
            }}
            arr={[
              "learning_motivation",
              "type_of_support_needed",
              "parent_support",
              "career_aspiration",
              "education_10th_exam_year",
            ]}
            onEdit={(e) => {
              navigate(`/beneficiary/edit/${id}/future-education`);
            }}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

BenificiaryEducation.propTypes = {
  userTokenInfo: PropTypes.object,
};
