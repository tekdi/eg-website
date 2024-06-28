import React, { useEffect, useState } from "react";
import { HStack, VStack, Box, Progress, Text } from "native-base";
import {
  arrList,
  FrontEndTypo,
  PCusers_layout as Layout,
} from "@shiksha/common-lib";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BenificiaryAddress() {
  const params = useParams();
  const [benificiary, setBenificiary] = useState();
  const [userId] = useState(params?.id);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    setBenificiary(location?.state);
  }, []);

  const onPressBackButton = async () => {
    navigate(`/learner/learnerListView/${userId}`);
  };

  return (
    <Layout
      _appBar={{ name: t("ADDRESS_DETAILS"), onPressBackButton }}
      analyticsPageTitle={"BENEFICIARY_ADDRESS_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ADDRESS_DETAILS")}
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
              justifyContent={"space-between"}
              space={2}
              alignItems="Center"
            >
              <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
                {t("ADDRESS_DETAILS")}
              </FrontEndTypo.H3>
            </HStack>
            <Box paddingTop="2">
              <Progress
                value={arrList(benificiary, [
                  "address",
                  "state",
                  "district",
                  "block",
                  "village",
                  "grampanchayat",
                  "pincode",
                ])}
                size="xs"
                colorScheme="red"
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
                  {t("ADDRESS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.address ? (
                    <Text>{benificiary?.address}</Text>
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
                  {t("STATE")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.state ? <Text>{benificiary?.state}</Text> : "-"}
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
                  {t("DISTRICT")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.district ? (
                    <Text>{benificiary?.district}</Text>
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
                  {t("BLOCKS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="4">
                  {benificiary?.block ? <Text>{benificiary?.block}</Text> : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack
                space={2}
                alignItems="Center"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" pb="2" flex="3">
                  {t("VILLAGE_WARD")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.village ? (
                    <Text>{benificiary?.village}</Text>
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
                <FrontEndTypo.H3 color="textGreyColor.50" flex="3">
                  {t("GRAMPANCHAYAT")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.grampanchayat ? (
                    <Text>{benificiary?.grampanchayat}</Text>
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>
              <HStack space={2} alignItems="Center">
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="3"
                  pb="2"
                >
                  {t("PINCODE")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="4"
                >
                  {benificiary?.pincode ? (
                    <Text>{benificiary?.pincode}</Text>
                  ) : (
                    "-"
                  )}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
