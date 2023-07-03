import React from "react";
import { HStack, VStack, Box, Progress, Text, Alert } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function BenificiaryJourney() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [source, setsource] = React.useState();
  // const [subject, setSubject] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});

  const navigate = useNavigate();

  React.useEffect(() => {
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
    setsource({
      document_id:
        result?.result?.program_beneficiaries?.payment_receipt_document_id,
    });
  };

  //   React.useEffect(async () => {
  //     const data = await enumRegistryService.listOfEnum();
  //     setEnumOptions(data?.data ? data?.data : {});
  //   }, [benificiary]);
  return (
    <Layout
      _appBar={{ name: t("JOURNEY_IN_PROJECT_PRAGATI"), onPressBackButton }}
    >
      <HStack alignItems={"center"} mt={5} ml={5}>
        {benificiary?.profile_photo_1?.id ? (
          <ImageView
            source={{
              document_id: benificiary?.profile_photo_1?.id,
            }}
            // alt="Alternate Text"
            width={"80px"}
            height={"80px"}
          />
        ) : (
          <IconByName
            isDisabled
            name="AccountCircleLineIcon"
            color="gray.300"
            _icon={{ size: "80px" }}
          />
        )}
        <FrontEndTypo.H2 bold color="textMaroonColor.400" marginLeft={"5px"}>
          {t("STATUS_FLOW_OF")}
          <br />
          <Text>
            {benificiary?.first_name}
            {benificiary?.middle_name &&
              benificiary?.middle_name !== "null" &&
              ` ${benificiary.middle_name}`}
            {benificiary?.last_name &&
              benificiary?.last_name !== "null" &&
              ` ${benificiary?.last_name}`}
          </Text>
        </FrontEndTypo.H2>
      </HStack>
      <HStack mt={5} left={"30px"} width={"80%"}>
        <VStack width={"100%"}>
          <HStack alignItems={"center"}>
            <Text mr={"20px"}>30</Text>
            <FrontEndTypo.Timeline status="rejoined">
              <FrontEndTypo.H2 color="blueText.400" bold>
                Rejoined
              </FrontEndTypo.H2>
              <FrontEndTypo.H4>by Rachana Wagh</FrontEndTypo.H4>
            </FrontEndTypo.Timeline>
          </HStack>
          <HStack alignItems={"center"}>
            <Text mr={"20px"}>30</Text>
            <FrontEndTypo.Timeline status="approved">
              <FrontEndTypo.H2 color="blueText.400" bold>
                approved
              </FrontEndTypo.H2>
              <FrontEndTypo.H4>by Rachana Wagh</FrontEndTypo.H4>
            </FrontEndTypo.Timeline>
          </HStack>
          <HStack alignItems={"center"}>
            <Text mr={"20px"}>30</Text>
            <FrontEndTypo.Timeline status="rejected">
              <FrontEndTypo.H2 color="blueText.400" bold>
                rejected
              </FrontEndTypo.H2>
              <FrontEndTypo.H4>by Rachana Wagh</FrontEndTypo.H4>
            </FrontEndTypo.Timeline>
          </HStack>
        </VStack>
      </HStack>
    </Layout>
  );
}
