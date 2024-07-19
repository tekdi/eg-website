import React, { useEffect } from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ImageView,
  Loading,
  t,
  AdminTypo,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useNavigate } from "react-router-dom";

export default function App({ footerLinks, userTokenInfo }) {
  const [data, setData] = React.useState();
  const navigate = useNavigate();

  useEffect(async () => {
    setData(userTokenInfo?.authUser);
  }, [userTokenInfo?.authUser]);

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data)) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName name="UserLineIcon" size="md" />
            <AdminTypo.H1 color="Activatedcolor.400">
              {t("PROFILE")}
            </AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <AdminTypo.H1
              color="textGreyColor.800"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {data?.first_name} {data?.last_name}
            </AdminTypo.H1>
          </HStack>
          <HStack p="5" justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                alignItems="center"
                p="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="CellphoneLineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {data?.mobile}
                </AdminTypo.H6>
              </HStack>
              <HStack
                bg="textMaroonColor.600"
                rounded={"md"}
                p="2"
                alignItems="center"
                space="2"
              >
                <IconByName
                  isDisabled
                  _icon={{ size: "20px" }}
                  name="MapPinLineIcon"
                  color="white"
                />
                <AdminTypo.H6 color="white" bold>
                  {[
                    data?.state,
                    data?.district,
                    data?.block,
                    data?.village,
                    data?.grampanchayat,
                  ]
                    .filter((e) => e)
                    .join(",")}
                </AdminTypo.H6>
              </HStack>
            </VStack>
            <HStack flex="0.5" mt={"-5"} justifyContent="center">
              {data?.profile_photo_1?.name ? (
                <ImageView
                  source={{
                    uri: data?.profile_photo_1?.name,
                  }}
                  // alt="Alternate Text"
                  width={"180px"}
                  height={"180px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="white"
                  _icon={{ size: "180px" }}
                />
              )}
            </HStack>
          </HStack>
          <VStack space={"5"} p="5" mt="6">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS")}
            </AdminTypo.H4>
            <HStack justifyContent="space-between">
              <VStack space={"5"} w="50%" bg="light.100" p="6" rounded="xl">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("BASIC_DETAILS")}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("FIRST_NAME")}:{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.first_name}
                  </AdminTypo.H5>
                </HStack>

                <HStack>
                  <AdminTypo.H5 color="textGreyColor.550">
                    {t("LAST_NAME")}:{" "}
                  </AdminTypo.H5>
                  <AdminTypo.H5 color="textGreyColor.800" bold>
                    {" "}
                    {data?.last_name}
                  </AdminTypo.H5>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </Layout>
  );
}
