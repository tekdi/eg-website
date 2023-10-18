import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  t,
  AdminTypo,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { HStack, VStack } from "native-base";
export default function View({ footerLinks }) {
  const navigate = useNavigate();

  return (
    <Layout _sidebar={footerLinks}>
      <VStack flex={1} space={"5"} p="3" mb="5">
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="UserLineIcon" size="md" />
          <AdminTypo.H1 color="Activatedcolor.400">
            {t("ALL_PRERAK")}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/admin/campHome`)}
          />
          <AdminTypo.H1
            color="textGreyColor.800"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {/* abc{data?.first_name} {data?.last_name} */}
          </AdminTypo.H1>
        </HStack>
        <HStack flexWrap="wrap">
          <VStack space="4" flexWrap="wrap">
            {/* <ChipStatus status={} /> */}
            <HStack
              bg="badgeColor.400"
              rounded={"md"}
              alignItems="center"
              p="2"
            >
              <IconByName
                isDisabled
                _icon={{ size: "20px" }}
                name="CellphoneLineIcon"
                color="textGreyColor.300"
              />
              <AdminTypo.H6 color="textGreyColor.600" bold>
                9999999999
              </AdminTypo.H6>
            </HStack>
            <HStack
              bg="badgeColor.400"
              rounded={"md"}
              p="2"
              alignItems="center"
              space="2"
            >
              <IconByName
                isDisabled
                _icon={{ size: "20px" }}
                name="MapPinLineIcon"
                color="textGreyColor.300"
              />
              <AdminTypo.H6 color="textGreyColor.600" bold>
                acn
              </AdminTypo.H6>
            </HStack>
          </VStack>
          <HStack>
            <IconByName
              isDisabled
              name="AccountCircleLineIcon"
              color="textGreyColor.300"
              _icon={{ size: "150px" }}
            />
          </HStack>
        </HStack>
      </VStack>
    </Layout>
  );
}
