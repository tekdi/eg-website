import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AdminTypo,
  PoAdminLayout,
  CardComponent,
  IconByName,
  organisationService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

function View(props) {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(async () => {
    const data = await organisationService.getDetailsOfOrg({ id });
    setData(data?.data?.[0]);
  }, []);

  const handleButtonClick = () => {
    navigate(`/poadmin/ips/${id}/list`), {};
  };

  return (
    <PoAdminLayout>
      <VStack flex={1} space={"5"} p="2">
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="UserLineIcon" size="md" />
          <AdminTypo.H4 bold color="Activatedcolor.400">
            {t("ALL_IPS")}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/poadmin/ips`)}
          />
          <AdminTypo.H4
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            bold
          >
            {data?.name}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(-1)}
          />
          <Chip textAlign="center" lineHeight="15px" label={data?.id} />
        </HStack>
        <VStack>
          <HStack justifyContent="space-between">
            <VStack w="100%" pl={2} pr={4}>
              <CardComponent
                _body={{ bg: "light.100" }}
                _header={{ bg: "light.100" }}
                _vstack={{ space: 0 }}
                _hstack={{ borderBottomWidth: 0, p: 1 }}
                item={data}
                title={t("BASIC_DETAILS")}
                label={["NAME", "MOBILE_NO", "CONTACT_PERSON"]}
                arr={["name", "mobile", "contact_person"]}
                buttonText={<AdminTypo.H5>User list</AdminTypo.H5>}
                _buttonStyle={{ py: "2" }}
                onButtonClick={handleButtonClick}
              />
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}

View.propTypes = {};

export default View;
