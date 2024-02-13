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
          label={
            <GetEnumValue
              fontSize="10px"
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
      <VStack bg="bgGreyColor.200">
        <VStack px="5" pt="3">
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
                  {benificiary?.core_beneficiaries?.type_of_learner ? (
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
              </HStack>
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

              <HStack space={2} alignItems="Center">
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
            </VStack>
          </VStack>
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
                {t("LEARNER_ASPIRATION")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${userId}/future-education`);
                }}
              />
            </HStack>
            <Box paddingTop="2">
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
                <FrontEndTypo.H3 color="textGreyColor.50" flex="3" pb="2">
                  {t("MOTIVATION_TO_PASS_10TH")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="4">
                  {benificiary?.program_beneficiaries?.learning_motivation ? (
                    <GetOptions
                      array={
                        benificiary?.program_beneficiaries?.learning_motivation
                      }
                      enumApiData={enumOptions}
                      enumType={"LEARNING_MOTIVATION"}
                    />
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>

              <HStack
                space={2}
                alignItems="Center"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="3" pb="2">
                  {t("SUPPORT_FROM_PRAGATI")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.program_beneficiaries
                    ?.type_of_support_needed ? (
                    <GetOptions
                      array={
                        benificiary?.program_beneficiaries
                          ?.type_of_support_needed
                      }
                      enumApiData={enumOptions}
                      enumType={"TYPE_OF_SUPPORT_NEEDED"}
                    />
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>
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
                  {t("CAREER_ASPIRATION")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="4">
                  {benificiary?.core_beneficiaries?.career_aspiration ? (
                    <GetEnumValue
                      t={t}
                      enumOptionValue={
                        benificiary?.core_beneficiaries?.career_aspiration
                      }
                      enumApiData={enumOptions}
                      enumType={"CAREER_ASPIRATION"}
                    />
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" space={2}>
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="3"
                  pb="2"
                >
                  {t("REMARKS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.core_beneficiaries?.career_aspiration_details
                    ? benificiary?.core_beneficiaries?.career_aspiration_details
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
