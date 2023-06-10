import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
  ImageView,
  Loading,
  t,
  AdminTypo,
} from "@shiksha/common-lib";
import { Heading, HStack, Text, VStack, Box, Image } from "native-base";
import Chip from "component/Chip";
import { useNavigate } from "react-router-dom";
import Steper from "component/Steper";

export default function App({ footerLinks, userTokenInfo }) {
  const [data, setData] = React.useState();
  const navigate = useNavigate();

  React.useEffect(async () => {
    // const result = await facilitatorRegistryService.getOne({ id });
    setData(userTokenInfo?.authUser);
  }, []);

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data)) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
          
            <Image
              source={{
                uri: "/profile.svg",
              }}
              alt=""
              size={"29px"}
              resizeMode="contain"
              color="Activatedcolor.400"
            />
            <AdminTypo.H1 color="Activatedcolor.400">
              {" "}
              {t("PRERAK_BIO")}
            </AdminTypo.H1>
              <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <AdminTypo.H1
                  color="textGreyColor.800"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {data?.first_name} {data?.last_name}
                </AdminTypo.H1>
          </HStack>
          <HStack alignItems="center" flexWrap="wrap">
            <VStack flex="0.6">
              <HStack alignItems="center" mb="6" space="4" flexWrap="wrap">
               
                <Box>
                  {data?.status ? (
                    <Chip>{data?.status}</Chip>
                  ) : (
                    <React.Fragment />
                  )}
                </Box>
                <HStack bg="badgeColor.400" rounded={"md"} ml="4" py="1" px="1">
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="CellphoneLineIcon"
                    color="textGreyColor.300"
                    pt="1"
                  />
                  <AdminTypo.H6 color="textGreyColor.600" bold>
                    {data?.mobile}
                  </AdminTypo.H6>
                </HStack>
                <HStack bg="badgeColor.400" rounded={"md"} ml="4" py="1" px="1">
                  <IconByName
                    isDisabled
                    _icon={{ size: "20px" }}
                    name="MapPinLineIcon"
                    color="textGreyColor.300"
                  />
                  <AdminTypo.H6 color="textGreyColor.600" bold>
                    {data?.address}
                  </AdminTypo.H6>
                </HStack>
              </HStack>
              <AdminTypo.H4 color="textGreyColor.800" pb="2" bold>
                {" "}
                {t("ELIGIBILITY_CRITERIA").toUpperCase()}
              </AdminTypo.H4>
              <HStack width={"100%"}>
                <Box flex={0.3}>
                  <Steper size={100} type="circle" progress={75} bg="white" />
                </Box>
                <VStack flex={0.7} space="2">
                  <HStack alignItems={"center"} space={"2"}>
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("QUALIFICATION")}
                    </AdminTypo.H7>
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
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("WORK_EXPERIENCE")}
                    </AdminTypo.H7>
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
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("VOLUNTEER_EXPERIENCE")}
                    </AdminTypo.H7>
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
                    <AdminTypo.H7 color="textGreyColor.500" bold>
                      {t("AVAILABILITY")}
                    </AdminTypo.H7>
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
            <HStack flex="0.4" pl="5">
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
                  color="gray.300"
                  _icon={{ size: "190px" }}
                />
              )}
            </HStack>
          </HStack>

          <VStack space={"5"} p="5" mt="6">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS")}
            </AdminTypo.H4>
            <HStack justifyContent="space-between">
              <VStack space={"5"} w="50%" bg="light.100" p="6" rounded="xl">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("BASIC_DETAILS")}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("FIRST_NAME")} :
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.first_name}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("LAST_NAME")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.last_name}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("MOBILE_NO")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {data?.mobile}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("DATE_OF_BIRTH")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.dob}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("GENDER")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.gender}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("ADDRESS")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
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
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("AADHAAR_NO")}{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.aadhar_token}
                  </AdminTypo.H5>
                </HStack>
              </VStack>
              <VStack
                space={"5"}
                w="50%"
                bg="light.100"
                p="6"
                rounded="xl"
                ml="3"
              >
                <HStack bg="light.100" p="1" mx="1" rounded="xl">
                  <VStack space="20px" w="100%">
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      borderColor="light.400"
                      pb="1"
                      borderBottomWidth="1"
                    >
                      <AdminTypo.H5 color="textGreyColor" bold>
                        {t("EDUCATION")}{" "}
                      </AdminTypo.H5>
                    </HStack>
                    <HStack>
                      <AdminTypo.H5 color="textGreyColor.550">
                        {t("QUALIFICATION")}{" "}
                      </AdminTypo.H5>
                      <AdminTypo.H5 color="textGreyColor.800" bold>
                        {data?.qualifications
                          ?.filter(
                            (e) =>
                              e?.qualification_master?.type === "qualification"
                          )
                          ?.map((qua, key) => {
                            return (
                              <AdminTypo.H5
                                color="textGreyColor.800"
                                bold
                                key={key}
                              >
                                {qua?.qualification_master?.name}
                              </AdminTypo.H5>
                            );
                          })}
                      </AdminTypo.H5>
                      <HStack space="2">
                        <AdminTypo.H5 color="textGreyColor.550">
                          {t("TEACHING_QUALIFICATION")}{" "}
                        </AdminTypo.H5>
                        {data?.qualifications ? (
                          data?.qualifications
                            ?.filter(
                              (e) =>
                                e?.qualification_master?.type === "teaching"
                            )
                            ?.map((qua, key) => {
                              return (
                                <AdminTypo.H5
                                  color="textGreyColor.800"
                                  bold
                                  key={key}
                                >
                                  {qua?.qualification_master?.name}
                                </AdminTypo.H5>
                              );
                            })
                        ) : (
                          <Text>{"-"}</Text>
                        )}
                      </HStack>
                    </HStack>

                    <VStack space="4">
                      <HStack space="2">
                        <AdminTypo.H5 color="textGreyColor.550">
                          {t("WORK_EXPERIENCE")}{" "}
                        </AdminTypo.H5>
                        <VStack space={5}  width="70%">
                          {data?.experience ? (
                            data?.experience?.map((e, key) => (
                              <Experience key={key} {...e} />
                            ))
                          ) : (
                            <AdminTypo.H5 color="textGreyColor.800" bold>
                              {"-"}
                            </AdminTypo.H5>
                          )}
                        </VStack>
                      </HStack>
                      <HStack space="2">
                        <AdminTypo.H5 color="textGreyColor.550">
                          {t("VOLUNTEER_EXPERIENCE")}
                        </AdminTypo.H5>
                        <VStack space={5}  width="70%">
                          {data?.vo_experience ? (
                            data?.vo_experience?.map((e, key) => (
                              <Experience key={key} {...e} />
                            ))
                          ) : (
                            <AdminTypo.H5 color="textGreyColor.800" bold>
                              {"-"}
                            </AdminTypo.H5>
                          )}
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </HStack>
                <VStack space="20px" w="100%" p="6" mt="3" rounded="xl">
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="light.400"
                    pb="1"
                    borderBottomWidth="1"
                  >
                    <AdminTypo.H5 color="textGreyColor" bold>
                      {t("OTHER_DETAILS")}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 color="textGreyColor.550">
                      {t("AVAILABILITY")}{" "}
                    </AdminTypo.H5>
                    <AdminTypo.H5 color="textGreyColor.800" bold>
                      {data?.program_faciltators?.availability?.replaceAll(
                        "_",
                        " "
                      )}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 color="textGreyColor.550">
                      {t("DEVICE_OWNERSHIP")}{" "}
                    </AdminTypo.H5>
                    <AdminTypo.H5 color="textGreyColor.800" bold>
                      {" "}
                      {data?.device_ownership}
                    </AdminTypo.H5>
                  </HStack>
                  <HStack>
                    <AdminTypo.H5 color="textGreyColor.550">
                      {t("TYPE_OF_DEVICE")}{" "}
                    </AdminTypo.H5>
                    <AdminTypo.H5 color="textGreyColor.800" bold>
                      {" "}
                      {data?.device_type}
                    </AdminTypo.H5>
                  </HStack>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
        {/* <VStack flex={0.18} bg="white.300" px="3" py="5" space={"5"} borderColor="light.400" pb="1" borderLeftWidth="1">
          <HStack justifyContent="space-between" alignItems={"center"}>
            <IconByName isDisabled name="EditBoxLineIcon" />
            <H3>{t("COMMENT_SECTION")}</H3>
            <IconByName isDisabled name="ArrowRightSLineIcon" />
          </HStack>
          <VStack space={"3"}>
            {[
              { name: "you", message: "Profile needs to be completed" },
              {
                name: "Manoj",
                message: "Profile needs to be completed before onboarding",
              },
            ].map((item, key) => (
              <VStack key={key} space={"1"}>
                <HStack space={"3"}>
                  {item?.profile_url ? (
                    <Avatar
                      source={{
                        uri: item?.profile_url,
                      }}
                      // alt="Alternate Text"
                      width={"24px"}
                      height={"24px"}
                    />
                  ) : (
                    <IconByName
                      isDisabled
                      name="AccountCircleLineIcon"
                      color="gray.300"
                      _icon={{ size: "24px" }}
                    />
                  )}
                  <BodyLarge>{item.name}</BodyLarge>
                </HStack>
                <Box bg="gray.200" p="4">
                  <BodySmall>{item.message}</BodySmall>
                </Box>
              </VStack>
            ))}
          </VStack>
        </VStack> */}
      </HStack>
    </Layout>
  );
}
