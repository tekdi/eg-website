import React from "react";
import { HStack, VStack, Box, Progress, Text } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  Layout,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BenificiaryAddress() {
  const params = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [userId] = React.useState(params?.id);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requestData, setRequestData] = React.useState([]);

  React.useEffect(async () => {
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: userId,
    };
    const result = await benificiaryRegistoryService.getEditRequest(obj);
    if (result?.data.length > 0) {
      const fieldData = JSON.parse(result?.data[0]?.fields);
      setRequestData(fieldData);
    }
    const data = await benificiaryRegistoryService.getOne(userId);
    setbenificiary(data?.result);
  }, []);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${userId}`);
  };

  const isAddressDetailsEdit = () => {
    const data = requestData.filter((e) =>
      [
        "lat",
        "long",
        "address",
        "street",
        "district",
        "block",
        "village",
        "grampanchayat",
      ].includes(e)
    );
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        data.length > 0)
    );
  };

  return (
    <Layout _appBar={{ name: t("ADDRESS_DETAILS"), onPressBackButton }}>
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
              {/* {isAddressDetailsEdit() && ( */}
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${userId}/address`);
                }}
              />
              {/* )} */}
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
              <HStack space={2} alignItems="Center">
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
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
