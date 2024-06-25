import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  Breadcrumb,
  CardComponent,
  IconByName,
  PoAdminLayout,
  organisationService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";

function View(props) {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [organisation, setOrganisation] = useState();
  const { t } = useTranslation();

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
      <VStack flex={1} pt="3" space={"5"} p="2">
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            {
              title: (
                <HStack>
                  <IconByName name="GroupLineIcon" size="md" />
                  <AdminTypo.H4 bold color="Activatedcolor.400">
                    {t("ALL_IPS")}
                  </AdminTypo.H4>
                </HStack>
              ),
              link: "/poadmin/ips",
              icon: "GroupLineIcon",
            },
            {
              title: (
                <Chip
                  textAlign="center"
                  lineHeight="15px"
                  label={organisation?.id}
                />
              ),
              link: `/poadmin/ips/${organisation?.id}`,
            },
            {
              title: (
                <AdminTypo.H4
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  bold
                >
                  {t("USER")}
                </AdminTypo.H4>
              ),
              link: `/poadmin/ips/${organisation?.id}`,
            },
            {
              title: (
                <Chip textAlign="center" lineHeight="15px" label={user?.id} />
              ),
            },
          ]}
        />

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

export default View;
