import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  t,
  AdminTypo,
  facilitatorRegistryService,
  CampService,
  FrontEndTypo,
  CardComponent,
  MapComponent,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Checkbox, HStack, Stack, Text, VStack } from "native-base";

export default function View({ footerLinks }) {
  const navigate = useNavigate();
  const [data, setDataa] = React.useState([]);
  const { id } = useParams();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await CampService.getFacilatorAdminCampList({ id });
      setDataa(result?.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

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
          ></AdminTypo.H1>
        </HStack>
        <HStack flexWrap="wrap">
          <VStack space="4" flexWrap="wrap">
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
              <AdminTypo.H6 color="textGreyColor.600" bold></AdminTypo.H6>
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
              <AdminTypo.H6 color="textGreyColor.600" bold></AdminTypo.H6>
            </HStack>
          </VStack>
          <HStack>
            {/* <IconByName
              isDisabled
              name="AccountCircleLineIcon"
              color="textGreyColor.300"
              _icon={{ size: "100px" }}
            /> */}
          </HStack>
          <Stack flex={4} style={{ marginLeft: "50%" }}>
            <MapComponent
              latitude={data?.camp?.properties?.lat}
              longitude={data?.camp?.properties?.long}
            ></MapComponent>
          </Stack>
        </HStack>
        <HStack justifyContent="space-between">
          <VStack
            borderWidth={"1px"}
            borderColor={"primary.200"}
            borderStyle={"solid"}
            space={"5"}
            w={"33%"}
            bg="light.100"
            p="6"
            rounded="xl"
          >
            <AdminTypo.H5 color="textGreyColor" bold>
              {t("Learner Details & Family Consent Letters")}
            </AdminTypo.H5>
            {data?.camp?.beneficiaries?.length > 0 ? (
              data?.camp?.beneficiaries.map((learner, index) => {
                console.log({ learner });
                return (
                  <CardComponent
                    key={learner?.id}
                    format={{ doc_id: "file" }}
                    item={{
                      ...(learner?.user || {}),
                      doc_id: "",
                    }}
                    bg={"light.100"}
                    isHideProgressBar={true}
                    _vstack={{ space: 0 }}
                    _hstack={{ borderBottomWidth: 0 }}
                    title={t("LEARNER") + ` ${learner?.user?.id}`}
                    label={["First Name", "Last Name"]}
                    arr={["first_name", "last_name", "doc_id"]}
                  />
                );
              })
            ) : (
              <p>No data available</p>
            )}
          </VStack>{" "}
          <VStack
            borderWidth={"1px"}
            borderColor={"primary.200"}
            borderStyle={"solid"}
            space={"5"}
            w={"33%"}
            bg="light.100"
            p="6"
            rounded="xl"
          >
            <AdminTypo.H5 color="textGreyColor" bold>
              {t("Property and Facility Details")}
            </AdminTypo.H5>
            <CardComponent
              item={data?.camp?.properties}
              bg={"light.100"}
              isHideProgressBar={true}
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("Property and Facility Details")}
              label={[
                "Block",
                "District",
                "Grampanchayat",
                "State",
                "Street",
                "Village",
              ]}
              arr={[
                "block",
                "district",
                "grampanchayat",
                "state",
                "street",
                "village",
              ]}
            />
          </VStack>
          <VStack
            borderWidth={"1px"}
            borderColor={"primary.200"}
            borderStyle={"solid"}
            space={"5"}
            w={"33%"}
            bg="light.100"
            p="6"
            rounded="xl"
          ></VStack>
        </HStack>
      </VStack>
    </Layout>
  );
}
