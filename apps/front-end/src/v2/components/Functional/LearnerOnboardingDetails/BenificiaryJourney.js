import React, { useEffect, useState } from "react";
import {
  benificiaryRegistoryService,
  enumRegistryService,
  FrontEndTypo,
  GetEnumValue,
  IconByName,
  ImageView,
  Layout,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, Text, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function BenificiaryJourney({ userTokenInfo }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [benificiary, setBenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [contextId, setContextId] = useState();
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditMonth, setAuditMonth] = useState([]);
  const [auditYear, setAuditYear] = useState([]);

  useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    setContextId(result?.result?.program_beneficiaries?.id);
  };

  const getAuditData = async () => {
    const result = await benificiaryRegistoryService.getAuditLogs(contextId);
    if (result && result.length > 0) {
      const uniqueDates = result.reduce(
        (acc, item) => {
          const parsedDate = moment(item?.created_at);
          const date = parsedDate.format("DD");
          const month = parsedDate.format("MMMM");
          const year = parsedDate.format("YYYY");
          setAuditLogs((prevState) => [
            ...prevState,
            {
              status: JSON.parse(item?.new_data),
              first_name: item?.user?.first_name,
              middle_name: item?.user?.middle_name,
              last_name: item.user?.last_name,
              date: date,
            },
          ]);

          if (!acc.months.includes(month)) {
            acc.months.push(month);
          }

          if (!acc.years.includes(year)) {
            acc.years.push(year);
          }

          return acc;
        },
        { dates: [], months: [], years: [] },
      );
      setAuditMonth(uniqueDates.months);
      setAuditYear(uniqueDates.years);
    }
  };

  useEffect(() => {
    getAuditData();
  }, [contextId]);

  return (
    <Layout
      _appBar={{
        name: t("JOURNEY_IN_PROJECT_PRAGATI"),
        onPressBackButton,
        profile_url: userTokenInfo?.authUser?.profile_photo_1?.name,
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser || {}}
      analyticsPageTitle={"BENEFICIARY_JOURNEY"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("JOURNEY")}
    >
      <HStack alignItems={"center"} mt={5} ml={5}>
        {benificiary?.profile_photo_1?.id ? (
          <ImageView
            source={{
              document_id: benificiary?.profile_photo_1?.id,
            }}
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
        </FrontEndTypo.H2>
        <HStack marginLeft={"5px"}>
          <FrontEndTypo.H2 bold color="textMaroonColor.400">
            {benificiary?.first_name}
            {benificiary?.middle_name &&
              benificiary?.middle_name !== "null" &&
              ` ${benificiary.middle_name}`}
            {benificiary?.last_name &&
              benificiary?.last_name !== "null" &&
              ` ${benificiary?.last_name}`}
          </FrontEndTypo.H2>
        </HStack>
      </HStack>
      <HStack mt={5} left={"30px"}>
        <VStack width={"100%"}>
          {auditYear.map((item, i) => {
            return (
              <React.Fragment key={item}>
                <HStack alignItems={"center"}>
                  <Text width={"50px"}>{JSON.parse(item)}</Text>
                  <HStack
                    height="50px"
                    borderColor="Disablecolor.400"
                    borderLeftWidth="2px"
                    mr="5"
                    alignItems="center"
                  ></HStack>
                </HStack>
                {auditMonth.map((month, i) => {
                  return (
                    <React.Fragment key={month}>
                      <HStack alignItems={"center"}>
                        <Text width={"50px"}>{month}</Text>
                        <HStack
                          height="25px"
                          borderColor="Disablecolor.400"
                          borderLeftWidth="2px"
                          mr="5"
                          alignItems="center"
                        ></HStack>
                      </HStack>
                      {auditLogs.map((logs, i) => {
                        return (
                          <React.Fragment key={logs}>
                            <HStack alignItems={"center"}>
                              <Text width={"50px"}>{logs?.date}</Text>;
                              <FrontEndTypo.Timeline
                                status={logs?.status?.status}
                              >
                                <FrontEndTypo.H2
                                  color="blueText.400"
                                  bold
                                ></FrontEndTypo.H2>
                                <GetEnumValue
                                  t={t}
                                  enumType={"BENEFICIARY_STATUS"}
                                  enumOptionValue={logs?.status?.status}
                                  enumApiData={enumOptions}
                                />
                                <FrontEndTypo.H4>
                                  <Text>By &nbsp;</Text>
                                  {logs?.first_name}&nbsp;
                                  {logs?.middle_name}&nbsp;
                                  {logs?.last_name}
                                </FrontEndTypo.H4>
                              </FrontEndTypo.Timeline>
                            </HStack>
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </VStack>
      </HStack>
    </Layout>
  );
}

BenificiaryJourney.propTypes = {
  userTokenInfo: PropTypes.any,
};
