import React from "react";
import {
  HStack,
  VStack,
  Text,
  Box,
  Progress,
  Divider,
  Button,
} from "native-base";
import { IconByName, Layout, t, FrontEndTypo, benificiaryRegistoryService } from "@shiksha/common-lib";
import { useParams } from 'react-router-dom';


export default function AgLearnerProfileView() {
  React.useEffect(() => {
    const getData = async () => {
      let data = await benificiaryRegistoryService.getOne(id);
      setBenificiary(data);
    };

    getData();
  }, [])
  const { id } = useParams()
  const [benificiary, setBenificiary] = React.useState({});
  return (
    <Layout _appBar={{ name: t("AG_LEARNER_PROFILE") }}>
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <VStack alignItems="Center">
            <IconByName
              name="AccountCircleLineIcon"
              color="textGreyColor.200"
              _icon={{ size: "60" }}
            />
            <FrontEndTypo.H2 bold color="textMaroonColor.400">
              {benificiary?.result?.first_name}
              {benificiary?.result?.last_name && ` ${benificiary?.result?.last_name}`}
            </FrontEndTypo.H2>
            <Box>{benificiary?.result?.[0]?.status || "unidentified"}</Box>
          </VStack>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <FrontEndTypo.H3 bold
                color="textGreyColor.800">
                {t("PROFILE_DETAILS")}
              </FrontEndTypo.H3>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3>
                      {t("BASIC_DETAILS")}
                    </FrontEndTypo.H3>
                  </HStack>

                  <IconByName name="ArrowRightSLineIcon" color="textMaroonColor.400" />
                </HStack>
                <Divider orientation="horizontal" bg="btnGray.100" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="MapPinLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("ADD_YOUR_ADDRESS")}
                    </FrontEndTypo.H3>
                  </HStack>
                  <IconByName name="ArrowRightSLineIcon" color="textMaroonColor.400" />
                </HStack>
                <Divider orientation="horizontal" bg="btnGray.100" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                    <FrontEndTypo.H3 color="textGreyColor.800">
                      {t("AADHAAR_DETAILS")}
                    </FrontEndTypo.H3>
                  </HStack>

                  <IconByName name="ArrowRightSLineIcon" color="textMaroonColor.400" />
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("DOCUMENT_CHECKLIST")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("ENROLLMENT_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("CAMP_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("JOURNEY_IN_PROJECT_PRAGATI")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  size="sm"
                />
              </HStack>
            </VStack>
          </Box>
          <FrontEndTypo.Secondarybutton leftIcon={<IconByName
                name="UserUnfollowLineIcon"
                color="textMaroonColor.400"
              />}>
              
              {t("MARK_AS_DROPOUT")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
}
