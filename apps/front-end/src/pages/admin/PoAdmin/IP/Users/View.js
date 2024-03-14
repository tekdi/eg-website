import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AdminTypo,
  CardComponent,
  IconByName,
  PoAdminLayout,
  organisationService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";

function View(props) {
  const { userId } = useParams();
  const { id } = useParams();
  const [useDetails, setUserDetails] = useState();
  const [orgDetails, setOrgDetails] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(async () => {
    const result = await organisationService.userDetails({
      id: userId,
    });
    setUserDetails(result?.data?.[0]);
  }, []);

  useEffect(async () => {
    const data = await organisationService.getDetailsOfIP({ id });
    setOrgDetails(data?.data?.[0]);
  }, [id]);

  const localData = JSON.parse(localStorage.getItem("program"));

  console.log({ orgDetails });
  return (
    <PoAdminLayout>
      <VStack flex={1} space={"5"} p="2">
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="GroupLineIcon" size="md" />
          <AdminTypo.H4
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            bold
          >
            {orgDetails?.first_name} {orgDetails?.last_name}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/poadmin/ips/${id}`)}
          />
          <Chip textAlign="center" lineHeight="15px" label={orgDetails?.id} />
        </HStack>
        <VStack p={4}>
          <CardComponent
            _body={{ bg: "light.100" }}
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            item={{
              ...useDetails,
              role: useDetails?.program_users?.[0]?.role_slug,
              state: localData?.program?.state?.state_name,
            }}
            title={t("BASIC_DETAILS")}
            label={[
              "IP_ID",
              "FIRST_NAME",
              "LAST_NAME",
              "ROLE",
              "STATE",
              "MOBILE_NUMBER",
            ]}
            arr={["id", "first_name", "last_name", "role", "state", "mobile"]}
          />
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}

View.propTypes = {};

export default View;
