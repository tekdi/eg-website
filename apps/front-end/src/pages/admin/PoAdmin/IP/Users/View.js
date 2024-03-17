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
  const { id } = useParams();
  const [user, setUser] = useState();
  const [organisation, setOrganisation] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(async () => {
    const result = await organisationService.userDetails({
      id,
    });
    const reData = result?.data?.[0];
    setUser(reData);

    if (reData.program_users?.[0].organisation_id) {
      setOrganisation({
        name: reData.program_users?.[0].organisations?.name,
        id: reData.program_users?.[0].organisation_id,
      });
    }
  }, []);

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
            {organisation?.name}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/poadmin/ips/${organisation?.id}`)}
          />
          <Chip textAlign="center" lineHeight="15px" label={id} />
        </HStack>
        <VStack p={4}>
          <CardComponent
            _body={{ bg: "light.100" }}
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            item={{
              ...user,
              id: organisation?.id,
              role: user?.program_users?.[0]?.role_slug,
              state: user?.program_users?.[0]?.programs?.state?.state_name,
            }}
            title={t("BASIC_DETAILS")}
            label={[
              "IP_ID",
              "FIRST_NAME",
              "LAST_NAME",
              "USERNAME",
              "ROLE",
              "STATE",
              "MOBILE_NUMBER",
            ]}
            arr={[
              "id",
              "first_name",
              "last_name",
              "username",
              "role",
              "state",
              "mobile",
            ]}
          />
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}

View.propTypes = {};

export default View;
