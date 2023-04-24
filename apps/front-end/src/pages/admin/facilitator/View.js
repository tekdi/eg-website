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
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
  Box,
} from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import NotFound from "../../NotFound";
import StatusButton from "./view/StatusButton";

export default function FacilitatorView({ footerLinks }) {
  const { id } = useParams();
  const [data, setData] = React.useState();
  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
  }, []);

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data)) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }

  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
      }}
      _sidebar={footerLinks}
    >
      <HStack>
        <VStack flex={0.82} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="3" pt="3">
            <IconByName size="sm" name="ArrowLeftSLineIcon" isDisabled />
            <H3>Prerak Bio</H3>
          </HStack>
          <HStack alignItems={Center} space="9" pt="5">
            <VStack flex={0.3} space="5">
              <HStack space="5">
                <VStack alignItems={"center"}>
                  <IconByName
                    _icon={{ size: "100px" }}
                    color="#888"
                    name="AccountCircleLineIcon"
                    isDisabled
                  />
                  {data?.status ? (
                    <ChipStatus status={data?.status} />
                  ) : (
                    <React.Fragment />
                  )}
                </VStack>
                <VStack space={"3"}>
                  <H1>
                    {data?.first_name} {data?.last_name}
                  </H1>
                  <VStack space={"1"}>
                    <HStack>
                      <IconByName
                        isDisabled
                        _icon={{ size: "20px" }}
                        name="CellphoneLineIcon"
                        color="#888"
                      />
                      <Text fontSize="18px"> {data?.mobile}</Text>
                    </HStack>
                    <HStack>
                      <IconByName
                        isDisabled
                        _icon={{ size: "20px" }}
                        name="MapPinLineIcon"
                        color="#888"
                      />
                      <Text fontSize="18px"> {data?.address}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
              <Button
                variant="outlinePrimary"
                leftIcon={<IconByName isDisabled name="MessageLineIcon" />}
              >
                Send message
              </Button>
            </VStack>
            <VStack flex={0.7} space="3">
              <H2> Eligibility Criteria</H2>
              <HStack width={"100%"}>
                <IconByName
                  flex={0.3}
                  name="DonutChartLineIcon"
                  isDisabled
                  color="#888"
                  _icon={{ size: "100px" }}
                />
                <VStack flex={0.7} space="2">
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>Qualification</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        {
                          value: 135,
                          color: "gray.500",
                        },
                        { value: 80, color: "gray.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>Work Experience</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "gray.500" },
                        { value: 75, color: "gray.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>Voulinteer Experience</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "gray.500" },
                        { value: 75, color: "gray.300" },
                      ]}
                    />
                  </HStack>
                  <HStack alignItems={"center"} space={"2"}>
                    <BodySmall>Availability</BodySmall>
                    <ProgressBar
                      flex="1"
                      isLabelCountHide
                      data={[
                        { value: 25, color: "gray.500" },
                        { value: 75, color: "gray.300" },
                      ]}
                    />
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </HStack>

          <VStack space={"5"} borderWidth="1" borderColor="gray.400" p="5">
            <H3>Application Form</H3>
            <HStack justifyContent="space-between">
              <VStack space={"5"}>
                <Heading fontSize="16px">Basic Details</Heading>
                <VStack>
                  <Text color="#AFB1B6">First Name</Text>
                  <Text>{data?.first_name}</Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Last Name</Text>
                  <Text>{data?.last_name}</Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Mobile No</Text>
                  <Text>{data?.mobile}</Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Date of Birth</Text>
                  <Text>{data?.dob}</Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Gender</Text>
                  <Text>{data?.gender}</Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Address</Text>
                  <Text>{data?.address}</Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Aadhar No</Text>
                  <Text>{data?.aadhar_token}</Text>
                </VStack>
              </VStack>
              <VStack display="Flex" flexDirection="column" space="20px">
                <Heading fontSize="16px">Education </Heading>

                <VStack>
                  <Text color="#AFB1B6">Qualification</Text>
                  <Text>
                    {data?.qualifications?.map((qua, key) => {
                      return (
                        <Text key={key}>{qua?.qualification_master?.name}</Text>
                      );
                    })}
                  </Text>
                </VStack>

                <VStack>
                  <Text color="#AFB1B6">Work Experience</Text>
                  <VStack space={5}>
                    {data?.experience?.map((obj, key) => {
                      return (
                        <VStack key={key}>
                          {obj?.role_title ? (
                            <Text>Role : {obj?.role_title}</Text>
                          ) : (
                            <React.Fragment />
                          )}
                          {obj?.experience_in_years ? (
                            <Text>yeas of ex : {obj?.experience_in_years}</Text>
                          ) : (
                            <React.Fragment />
                          )}
                          {obj?.description ? (
                            <Text>description : {obj?.description}</Text>
                          ) : (
                            <React.Fragment />
                          )}
                        </VStack>
                      );
                    })}
                  </VStack>
                </VStack>
              </VStack>
              <VStack display="Flex" flexDirection="column" space="20px">
                <Heading fontSize="16px">Other Details</Heading>
                <VStack>
                  <Text color="#AFB1B6">Availability</Text>
                  <Text>
                    {data?.program_faciltators?.map((avai, key) => (
                      <Text key={key}>{avai?.avaibility}</Text>
                    ))}
                  </Text>
                </VStack>
                <VStack>
                  <Text color="#AFB1B6">Device Ownership</Text>
                  <Text>{data?.device_ownership}</Text>
                </VStack>
                <VStack>
                  <Text color="#AFB1B6">Type of Device</Text>
                  <Text>{data?.device_type}</Text>
                </VStack>
              </VStack>
            </HStack>
            <StatusButton {...{ data, setData }} />
          </VStack>
        </VStack>
        <VStack flex={0.18} bg="gray.300" px="3" py="5" space={"5"}>
          <HStack justifyContent="space-between" alignItems={"center"}>
            <IconByName isDisabled name="EditBoxLineIcon" />
            <H3>Comment Section</H3>
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
                  <IconByName
                    isDisabled
                    color="#888"
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
        </VStack>
      </HStack>
    </Layout>
  );
}
