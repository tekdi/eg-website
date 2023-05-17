import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
  facilitatorRegistryService,
  H3,
  H1,
  H2,
  BodyLarge,
  BodySmall,
  Loading,
  t,
  ImageView,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Center, Heading, HStack, Text, VStack } from "native-base";
import { ChipStatus } from "component/Chip";
import NotFound from "../../NotFound";
import StatusButton from "./view/StatusButton";

const Experience = (obj) => {
  return (
    <VStack>
      {obj?.role_title ? (
        <Text>
          {t("ROLE")} : {obj?.role_title}
        </Text>
      ) : (
        <React.Fragment />
      )}
      {obj?.experience_in_years ? (
        <Text>
          {t("YEARS_OF_EX")} : {obj?.experience_in_years}
        </Text>
      ) : (
        <React.Fragment />
      )}
      {obj?.description ? (
        <Text>
          {t("DESCRIPTION")} : {obj?.description}
        </Text>
      ) : (
        <React.Fragment />
      )}
    </VStack>
  );
};

export default function FacilitatorView({ footerLinks }) {
  const { id } = useParams();
  const [data, setData] = React.useState();
  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
  }, []);

  const showData = (item) => (item ? item : "-");

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data) || data.error) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="3" pt="3">
            <IconByName
              size="sm"
              name="ArrowLeftSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <H3> {t("PRERAK_BIO")}</H3>
          </HStack>
          <HStack alignItems="center" flexWrap="wrap">
            <VStack flex="0.7" direction="column">
              <HStack alignItems="center" mb="6" space="4" flexWrap="wrap">
                <H1
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {data?.first_name} {data?.last_name}
                </H1>
                <ChipStatus status={data?.status} />
                <HStack
                  bg="badgeColor.400"
                  rounded={"md"}
                  alignItems="center"
                  p="2"
                >
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="CellphoneLineIcon"
                    color="textGreyColor.300"
                  />
                  <BodyLarge>{data?.mobile}</BodyLarge>
                </HStack>
                <HStack
                  bg="badgeColor.400"
                  rounded={"md"}
                  p="2"
                  alignItems="center"
                  space="2"
                >
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="MapPinLineIcon"
                    color="textGreyColor.300"
                  />
                  <BodySmall>
                    {[
                      data?.state,
                      data?.district,
                      data?.block,
                      data?.village,
                      data?.grampanchayat,
                    ]
                      .filter((e) => e)
                      .join(",")}
                  </BodySmall>
                </HStack>
              </HStack>
              <H2 fontSize="18" pb="2">
                {t("ELIGIBILITY_CRITERIA")}
              </H2>
              <HStack width={"100%"}>
                <IconByName
                  flex={0.3}
                  name="DonutChartLineIcon"
                  isDisabled
                  color="darkBlue.400"
                  _icon={{ size: "100px" }}
                />
                <VStack flex={0.7} space="2">
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall> {t("QUALIFICATION")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        {
                          value: 135,
                          color: "progressBarColor.200",
                        },
                        { value: 80, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>{t("WORK_EXPERIENCE")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "progressBarColor.200" },
                        { value: 75, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>{t("VOLUNTEER_EXPERIENCE")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "progressBarColor.200" },
                        { value: 75, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>{t("AVAILABILITY")}</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "progressBarColor.200" },
                        { value: 75, color: "textGreyColor.300" },
                      ]}
                    />
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
            <HStack flex="0.3" pl="5" justifyContent="center">
              {data?.documents?.[0]?.name ? (
                <ImageView
                  source={{
                    uri: data?.documents?.[0]?.name,
                  }}
                  // alt="Alternate Text"
                  width={"190px"}
                  height={"190px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="textGreyColor.300"
                  _icon={{ size: "190px" }}
                />
              )}
            </HStack>
          </HStack>
          <HStack alignItems={Center} space="9" pt="5">
            <VStack flex={0.3} space="5">
              <Button
                variant="outlinePrimary"
                leftIcon={<IconByName isDisabled name="MessageLineIcon" />}
              >
                {t("SEND_MESSAGE")}
              </Button>
            </VStack>
          </HStack>

          <VStack space={"5"} p="5" mt="6">
            <H3>{t("APPLICATION_FORM")}</H3>
            <HStack flex="1">
              <VStack space="5" flex={1 / 2} bg="light.100" p="6" rounded="xl">
                <Heading
                  fontSize="16px"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  {t("BASIC_DETAILS")}
                </Heading>
                <VStack>
                  <Text color="warmGray.500">{t("FIRST_NAME")} </Text>
                  <Text>{showData(data?.first_name)}</Text>
                </VStack>

                <VStack>
                  <Text color="warmGray.500">{t("LAST_NAME")} </Text>
                  <Text>{showData(data?.last_name)}</Text>
                </VStack>

                <VStack>
                  <Text color="warmGray.500">{t("MOBILE_NO")} </Text>
                  <Text>{showData(data?.mobile)}</Text>
                </VStack>

                <VStack>
                  <Text color="warmGray.500">{t("DATE_OF_BIRTH")} </Text>
                  <Text>{showData(data?.dob)}</Text>
                </VStack>

                <VStack>
                  <Text color="warmGray.500">{t("GENDER")} </Text>
                  <Text>{showData(data?.gender)}</Text>
                </VStack>

                <VStack>
                  <Text color="warmGray.500">{t("ADDRESS")} </Text>
                  <Text>
                    {[
                      data?.state,
                      data?.district,
                      data?.block,
                      data?.village,
                      data?.grampanchayat,
                    ].filter((e) => e).length > 0
                      ? [
                          data?.state,
                          data?.district,
                          data?.block,
                          data?.village,
                          data?.grampanchayat,
                        ]
                          .filter((e) => e)
                          .join(", ")
                      : "-"}
                  </Text>
                </VStack>

                <VStack>
                  <Text color="warmGray.500">{t("AADHAAR_NO")} </Text>
                  <Text>{showData(data?.aadhar_token)}</Text>
                </VStack>
              </VStack>
              <HStack
                space="5"
                flex={1 / 2}
                bg="light.100"
                p="6"
                ml="2"
                rounded="xl"
              >
                <VStack space="5" flex="1">
                  <Heading
                    fontSize="16px"
                    borderColor="light.400"
                    pb="1"
                    borderBottomWidth="1"
                  >
                    {t("EDUCATION")}
                  </Heading>
                  <VStack space="4">
                    <VStack space="2">
                      <Text color="warmGray.500">{t("QUALIFICATION")} </Text>
                      {data?.qualifications ? (
                        data?.qualifications
                          ?.filter(
                            (e) =>
                              e?.qualification_master?.type === "qualification"
                          )
                          ?.map((qua, key) => {
                            return (
                              <Text key={key}>
                                {qua?.qualification_master?.name}
                              </Text>
                            );
                          })
                      ) : (
                        <Text>{"-"}</Text>
                      )}
                    </VStack>
                    <VStack space="2">
                      <Text color="warmGray.500">
                        {t("TEACHING_QUALIFICATION")}{" "}
                      </Text>
                      {data?.qualifications ? (
                        data?.qualifications
                          ?.filter(
                            (e) => e?.qualification_master?.type === "teaching"
                          )
                          ?.map((qua, key) => {
                            return (
                              <Text key={key}>
                                {qua?.qualification_master?.name}
                              </Text>
                            );
                          })
                      ) : (
                        <Text>{"-"}</Text>
                      )}
                    </VStack>
                  </VStack>

                  <VStack space="4">
                    <VStack space="2">
                      <Text color="warmGray.500">{t("WORK_EXPERIENCE")} </Text>
                      <VStack space={5}>
                        {data?.experience ? (
                          data?.experience?.map((e, key) => (
                            <Experience key={key} {...e} />
                          ))
                        ) : (
                          <Text>{"-"}</Text>
                        )}
                      </VStack>
                    </VStack>
                    <VStack space="2">
                      <Text color="warmGray.500">
                        {t("VOLUNTEER_EXPERIENCE")}
                      </Text>
                      <VStack space={5}>
                        {data?.vo_experience ? (
                          data?.vo_experience?.map((e, key) => (
                            <Experience key={key} {...e} />
                          ))
                        ) : (
                          <Text>{"-"}</Text>
                        )}
                      </VStack>
                    </VStack>
                  </VStack>
                  <VStack display="Flex" flexDirection="column" space="20px">
                    <Heading
                      fontSize="16px"
                      borderColor="light.400"
                      pb="1"
                      borderBottomWidth="1"
                    >
                      {t("OTHER_DETAILS")}
                    </Heading>
                    <VStack>
                      <Text color="warmGray.500">{t("AVAILABILITY")} </Text>
                      <Text>
                        {showData(
                          data?.program_faciltators?.availability?.replaceAll(
                            "_",
                            " "
                          )
                        )}
                      </Text>
                    </VStack>
                    <VStack>
                      <Text color="warmGray.500">{t("DEVICE_OWNERSHIP")} </Text>
                      <Text>{showData(data?.device_ownership)}</Text>
                    </VStack>
                    <VStack>
                      <Text color="warmGray.500">{t("TYPE_OF_DEVICE")} </Text>
                      <Text>{showData(data?.device_type)}</Text>
                    </VStack>
                  </VStack>
                </VStack>
              </HStack>
            </HStack>
          </VStack>
          <StatusButton {...{ data, setData }} />
        </VStack>

        {/* <VStack
          flex={0.18}
          bg="white.300"
          px="3"
          py="5"
          space={"5"}
          borderColor="light.400"
          pb="1"
          borderLeftWidth="1"
        >
          <HStack justifyContent="space-between" alignItems={"center"}>
            <IconByName isDisabled name="EditBoxLineIcon" />
            <H3>{t("COMMENT_SECTION")}</H3>
            <IconByName isDisabled name="ArrowRightSLineIcon" />
          </HStack>
          <VStack space={"3"}>
            {[
              { name: t("YOU"), message: t("PROFILE_NEEDS_TO_BE_COMPLETED") },
              {
                name: "Manoj",
                message: t("PROFILE_NEEDS_TO_BE_COMPLETED"),
              },
            ].map((item, key) => (
              <VStack key={key} space={"1"}>
                <HStack space={"3"}>
                  <IconByName
                    isDisabled
                    color="gray.300"
                    _icon={{ size: "24px" }}
                    name="AccountCircleLineIcon"
                  />
                  <BodyLarge>{item?.name}</BodyLarge>
                </HStack>
                <Box bg="gray.200" p="4">
                  <BodySmall>{item?.message}</BodySmall>
                </Box>
              </VStack>
            ))}
          </VStack>
        </VStack> */}
      </HStack>
    </Layout>
  );
}
