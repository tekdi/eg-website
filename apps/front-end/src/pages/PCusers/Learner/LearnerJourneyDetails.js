import React, { useState, useEffect } from "react";
import { HStack, VStack, Text } from "native-base";
import {
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  PCusers_layout as Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function BenificiaryJourney({ userTokenInfo }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [benificiary, setBenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [contextId, setContextId] = useState();
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditMonth, setAuditMonth] = useState([]);
  const [auditYear, setAuditYear] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/learners/list-view/${id}`);
  };

  const agDetails = async () => {
    setBenificiary(location?.state);
    setContextId(location?.state?.program_beneficiaries?.id);
  };

  const getAuditData = async () => {
    const result = await benificiaryRegistoryService.getAuditLogs(contextId);
    if (result && result.length > 0) {
      const uniqueDates = result.reduce(
        (acc, item) => {
          const parsedDate = moment(item?.created_at);
          const year = parsedDate.format("YYYY");
          const month = parsedDate.format("MMMM");
          const date = parsedDate.format("DD");
          setAuditLogs((prevState) => [
            ...prevState,
            {
              date: date,
              status: JSON.parse(item?.new_data),
              first_name: item?.user?.first_name,
              middle_name: item?.user?.middle_name,
              last_name: item.user?.last_name,
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
      _appBar={{ name: t("JOURNEY_IN_PROJECT_PRAGATI"), onPressBackButton }}
      analyticsPageTitle={"BENEFICIARY_JOURNEY"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("JOURNEY")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <HStack mt={5} ml={5} alignItems={"center"}>
        {benificiary?.profile_photo_1?.id ? (
          <ImageView
            height={"80px"}
            width={"80px"}
            source={{
              document_id: benificiary?.profile_photo_1?.id,
            }}
          />
        ) : (
          <IconByName
            name="AccountCircleLineIcon"
            color="gray.300"
            isDisabled
            _icon={{ size: "80px" }}
          />
        )}
        <FrontEndTypo.H2 color="textMaroonColor.400" bold marginLeft={"5px"}>
          {t("STATUS_FLOW_OF")}
        </FrontEndTypo.H2>
        <HStack ml={5}>
          <FrontEndTypo.H2 bold color="textMaroonColor.400">
            {[
              benificiary?.first_name,
              benificiary?.middle_name,
              benificiary?.last_name,
            ]
              .filter(Boolean)
              .join(" ")}
          </FrontEndTypo.H2>
        </HStack>
      </HStack>
      <HStack left={"30px"} mt={5}>
        <VStack width={"100%"}>
          {auditYear.map((item, i) => {
            return (
              <React.Fragment key={i + 1}>
                <HStack alignItems={"center"}>
                  <Text width={"50px"}>{JSON.parse(item)}</Text>
                  <HStack
                    borderColor="Disablecolor.400"
                    borderLeftWidth="2px"
                    height="50px"
                    alignItems="center"
                    mr="5"
                  ></HStack>
                </HStack>
                {auditMonth.map((month, j) => {
                  return (
                    <React.Fragment key={j + 1}>
                      <HStack alignItems={"center"}>
                        <Text width={"50px"}>{month}</Text>
                        <HStack
                          borderColor="Disablecolor.400"
                          height="25px"
                          mr="5"
                          alignItems="center"
                          borderLeftWidth="2px"
                        ></HStack>
                      </HStack>
                      {auditLogs.map((logs, k) => {
                        return (
                          <React.Fragment key={k + 1}>
                            <HStack alignItems={"center"}>
                              <Text width={"50px"}>{logs?.date}</Text>;
                              <FrontEndTypo.Timeline
                                status={logs?.status?.status}
                              >
                                <FrontEndTypo.H2
                                  bold
                                  color="blueText.400"
                                ></FrontEndTypo.H2>
                                <GetEnumValue
                                  enumOptionValue={logs?.status?.status}
                                  t={t}
                                  enumType={"BENEFICIARY_STATUS"}
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
