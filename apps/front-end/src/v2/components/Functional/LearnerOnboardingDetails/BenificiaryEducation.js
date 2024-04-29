import React from "react";
import { HStack, VStack, Box, Progress } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  Layout,
  enumRegistryService,
  GetEnumValue,
  getUniqueArray,
  CardComponent,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import Chip from "component/Chip";
import { useTranslation } from "react-i18next";

const GetOptions = ({ array, enumType, enumApiData }) => {
  const { t } = useTranslation();
  return (
    <VStack>
      {getUniqueArray(array)?.map((item, index) => (
        <Chip
          textAlign="center"
          lineHeight="14px"
          bg="gray.100"
          label={
            <GetEnumValue
              fontSize="14px"
              key={index}
              t={t}
              enumOptionValue={item}
              {...{ enumType, enumApiData }}
            />
          }
        />
      ))}
    </VStack>
  );
};

export default function BenificiaryEducation() {
  const params = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [userId, setUserId] = React.useState(params?.id);
  const [enumOptions, setEnumOptions] = React.useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requestData, setRequestData] = React.useState([]);

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(userId);

    setbenificiary(result?.result);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: userId,
    };
    const result = await benificiaryRegistoryService.getEditRequest(obj);
    if (result?.data.length > 0) {
      const fieldData = JSON.parse(result?.data[0]?.fields);
      setRequestData(fieldData);
    }
  }, [benificiary]);

  const isEducationalDetailsEdit = () => {
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        requestData.includes("educational_details")) ||
      requestData.includes("type_of_learner") ||
      requestData.includes("last_standard_of_education") ||
      requestData.includes("last_standard_of_education_year") ||
      requestData.includes("previous_school_type") ||
      requestData.includes("reason_of_leaving_education") ||
      requestData.includes("learning_level")
    );
  };
  return (
    <Layout
      _appBar={{
        name: t("EDUCATION_DETAILS"),
        onlyIconsShow: ["langBtn", "backBtn"],
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${userId}`);
        },
      }}
    >
      <VStack bg="white" px="5" py="3">
        <CardComponent
          _vstack={{ space: 0 }}
          _hstack={{ borderBottomWidth: 0 }}
          title={t("EDUCATION_DETAILS")}
          label={[
            "TYPE_OF_LEARNER",
            "REASON_FOR_LEAVING",
            benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) &&
              "LAST_STANDARD_OF_EDUCATION",
            benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) &&
              "LAST_YEAR_OF_EDUCATION",
            "PREVIOUS_SCHOOL_TYPE",
            "REASON_OF_LEAVING_EDUCATION",
            benificiary?.core_beneficiaries?.type_of_learner &&
              ["already_open_school_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) &&
              "REGISTERED_IN_TENTH_DATE",
            benificiary?.core_beneficiaries?.type_of_learner &&
              ["already_open_school_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) &&
              "IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM",
          ].filter(Boolean)}
          item={{
            type_of_learner: benificiary?.core_beneficiaries
              ?.type_of_learner && (
              <GetEnumValue
                t={t}
                enumType={"TYPE_OF_LEARNER"}
                enumOptionValue={
                  benificiary?.core_beneficiaries?.type_of_learner
                }
                enumApiData={enumOptions}
              />
            ),
            reason_of_leaving_education: benificiary?.core_beneficiaries
              ?.reason_of_leaving_education && (
              <GetEnumValue
                t={t}
                enumType={"REASON_OF_LEAVING_EDUCATION"}
                enumOptionValue={
                  benificiary?.core_beneficiaries?.reason_of_leaving_education
                }
                enumApiData={enumOptions}
              />
            ),
            ...(benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) && {
                last_standard_of_education: (
                  <GetEnumValue
                    t={t}
                    enumType={"LAST_STANDARD_OF_EDUCATION"}
                    enumOptionValue={
                      benificiary?.core_beneficiaries
                        ?.last_standard_of_education
                    }
                    enumApiData={enumOptions}
                  />
                ),
                LAST_YEAR_OF_EDUCATION: (
                  <GetEnumValue
                    t={t}
                    enumType={"LAST_YEAR_OF_EDUCATION"}
                    enumOptionValue={
                      benificiary?.core_beneficiaries?.last_year_of_education
                    }
                    enumApiData={enumOptions}
                  />
                ),
                previous_school_type: (
                  <GetEnumValue
                    t={t}
                    enumType={"PREVIOUS_SCHOOL_TYPE"}
                    enumOptionValue={
                      benificiary?.core_beneficiaries?.previous_school_type
                    }
                    enumApiData={enumOptions}
                  />
                ),
                education_10th_date:
                  benificiary?.core_beneficiaries?.type_of_learner ===
                  "already_open_school_syc"
                    ? benificiary?.core_beneficiaries?.education_10th_date ||
                      "-"
                    : undefined,
                education_10th_exam_year:
                  benificiary?.core_beneficiaries?.type_of_learner ===
                  "already_open_school_syc"
                    ? benificiary?.core_beneficiaries
                        ?.education_10th_exam_year || "-"
                    : undefined,
              }),
          }}
          arr={(() => {
            const arr = [];
            if (
              benificiary?.core_beneficiaries?.type_of_learner ||
              benificiary?.core_beneficiaries?.reason_of_leaving_education
            ) {
              arr.push("type_of_learner");
              arr.push(" reason_of_leaving_education");
              if (
                [
                  "school_dropout",
                  "already_open_school_syc",
                  "already_enrolled_in_open_school",
                ].includes(benificiary?.core_beneficiaries?.type_of_learner)
              ) {
                arr.push(
                  "last_standard_of_education",
                  "last_standard_of_education_year",
                  "previous_school_type"
                );
              }
              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "already_open_school_syc"
              ) {
                arr.push("education_10th_date", "education_10th_exam_year");
              }
            }
            return arr;
          })()}
          onEdit={(e) => {
            navigate(`/beneficiary/edit/${userId}/education`);
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
              learning_motivation: (
                <GetOptions
                  array={
                    benificiary?.program_beneficiaries?.learning_motivation
                  }
                  enumApiData={enumOptions}
                  enumType={"LEARNING_MOTIVATION"}
                />
              ),

              type_of_support_needed: (
                <GetOptions
                  array={
                    benificiary?.program_beneficiaries?.type_of_support_needed
                  }
                  enumApiData={enumOptions}
                  enumType={"TYPE_OF_SUPPORT_NEEDED"}
                />
              ),

              parent_support:
                benificiary?.core_beneficiaries?.parent_support ?? "-",

              career_aspiration: (
                <GetEnumValue
                  t={t}
                  enumOptionValue={
                    benificiary?.core_beneficiaries?.career_aspiration
                  }
                  enumApiData={enumOptions}
                  enumType={"CAREER_ASPIRATION"}
                />
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
              navigate(`/beneficiary/edit/${userId}/future-education`);
            }}
          />
        </VStack>

        {/* <VStack>
          <VStack
            px="5"
            py="4"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack
              space={2}
              justifyContent={"space-between"}
              alignItems="Center"
            >
              <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
                {t("EDUCATION_DETAILS")}
              </FrontEndTypo.H3>
              {isEducationalDetailsEdit() && (
                <IconByName
                  name="EditBoxLineIcon"
                  _icon={{ size: "20" }}
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`/beneficiary/edit/${userId}/education`);
                  }}
                />
              )}
            </HStack>
            <Box paddingTop="2">
              {console.log(benificiary?.core_beneficiaries)}
              <Progress
                value={arrList(benificiary?.core_beneficiaries, [
                  "last_standard_of_education",
                  "last_standard_of_education_year",
                  "previous_school_type",
                  "reason_of_leaving_education",
                ])}
                size="xs"
                colorScheme="textMaroonColor"
              />
            </Box>
            <VStack space="2" paddingTop="5">
              <HStack
                space={2}
                alignItems="Center"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="3"
                  pb="2"
                >
                  {t("TYPE_OF_LEARNER")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {/* {benificiary?.core_beneficiaries?.last_standard_of_education
                    ? benificiary?.core_beneficiaries
                        ?.last_standard_of_education
                    : "-"} */}
        {/* {benificiary?.core_beneficiaries?.type_of_learner ? (
                    <GetEnumValue
                      t={t}
                      enumType={"TYPE_OF_LEARNER"}
                      enumOptionValue={
                        benificiary?.core_beneficiaries?.type_of_learner
                      }
                      enumApiData={enumOptions}
                    />
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack> */}
        {/* {["school_dropout", "already_enrolled_in_open_school"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) && (
                <HStack
                  space={2}
                  alignItems="Center"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="3"
                    pb="2"
                  >
                    {t("LAST_STANDARD_OF_EDUCATION")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="4"
                  >
                    {benificiary?.core_beneficiaries
                      ?.last_standard_of_education ? (
                      <GetEnumValue
                        t={t}
                        enumType={"LAST_STANDARD_OF_EDUCATION"}
                        enumOptionValue={
                          benificiary?.core_beneficiaries
                            ?.last_standard_of_education
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </FrontEndTypo.H3>
                </HStack>
              )}

              {["school_dropout", "already_enrolled_in_open_school"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) && (
                <HStack
                  space={2}
                  alignItems="Center"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="3"
                    pb="2"
                  >
                    {t("LAST_YEAR_OF_EDUCATION")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="4"
                  >
                    {benificiary?.core_beneficiaries
                      ?.last_standard_of_education_year
                      ? benificiary?.core_beneficiaries
                          ?.last_standard_of_education_year
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              )}

              {[
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) && (
                <HStack
                  space={2}
                  alignItems="Center"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3 color="textGreyColor.50" flex="3" pb="2">
                    {t("PREVIOUS_SCHOOL_TYPE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3 color="textGreyColor.800" flex="4">
                    {benificiary?.core_beneficiaries?.previous_school_type ? (
                      <GetEnumValue
                        t={t}
                        enumType={"PREVIOUS_SCHOOL_TYPE"}
                        enumOptionValue={
                          benificiary?.core_beneficiaries?.previous_school_type
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </FrontEndTypo.H3>
                </HStack>
              )}

              <HStack
                space={2}
                alignItems="Center"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
                paddingBottom={4}
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="3">
                  {t("REASON_FOR_LEAVING")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.core_beneficiaries
                    ?.reason_of_leaving_education ? (
                    <GetEnumValue
                      t={t}
                      enumType={"REASON_OF_LEAVING_EDUCATION"}
                      enumOptionValue={
                        benificiary?.core_beneficiaries
                          ?.reason_of_leaving_education
                      }
                      enumApiData={enumOptions}
                    />
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>

              {["already_open_school_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) && (
                <HStack space={2} alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.50" flex="3">
                    {t("REGISTERED_IN_TENTH_DATE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="4"
                  >
                    {benificiary?.core_beneficiaries?.education_10th_date
                      ? benificiary?.core_beneficiaries?.education_10th_date
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              )}

              {["stream_2_mainstream_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) && (
                <HStack space={2} alignItems="Center">
                  <FrontEndTypo.H3 color="textGreyColor.50" flex="3">
                    {t("IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="4"
                  >
                    {benificiary?.core_beneficiaries?.education_10th_exam_year
                      ? benificiary?.core_beneficiaries
                          ?.education_10th_exam_year
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              )} */}
        {/* </VStack>
          </VStack>
        </VStack> */}
      </VStack>
    </Layout>
  );
}
