import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  t,
  AdminTypo,
  facilitatorRegistryService,
  CampService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, VStack } from "native-base";


export default function View({ footerLinks }) {
  const navigate = useNavigate();
  const [data, setDataa] = React.useState([]);
  const { id } = useParams();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await CampService.getFacilatorAdminCampList({id});
      setDataa(result);
      console.log("check response", result);
      alert(JSON.stringify(result))
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
        {/* <HStack alignItems={"center"} space="1" pt="3" bg={"red.300"}></HStack> */}
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
            <HStack
              justifyContent="space-between"
              alignItems="center"
              borderColor="light.400"
              pb="1"
              borderBottomWidth="1"
            >
              <AdminTypo.H5 color="textGreyColor" bold>
                {t("List of Learner")}
              </AdminTypo.H5>
            </HStack>

            <VStack>
              <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                {/* {t("SELF")}: */}
              </AdminTypo.H5>
              <AdminTypo.H5
                flex="1"
                color="textGreyColor.800"
                pl="1"
                bold
              ></AdminTypo.H5>

              <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                {/* {t("ALTERNATIVE_NUMBER")}: */}
              </AdminTypo.H5>
              <AdminTypo.H5
                flex="1"
                color="textGreyColor.800"
                pl="1"
                bold
              ></AdminTypo.H5>

              <AdminTypo.H5 bold flex="0.69" color="textGreyColor.550">
                {/* {t("EMAIL_ID")}: */}
              </AdminTypo.H5>
              <AdminTypo.H5
                flex="1"
                color="textGreyColor.800"
                bold
              ></AdminTypo.H5>
              <HStack alignItems="center">
                <AdminTypo.H5 bold flex="0.67" color="textGreyColor.550">
                  {/* {t("AADHAAR_NO")}: */}
                </AdminTypo.H5>
                <HStack
                  flex="1"
                  alignItems={"center"}
                  space={"4"}
                  justifyContent={"space-between"}
                >
                  <AdminTypo.H5
                    justifyContent={"center"}
                    alignItems={"center"}
                    color="textGreyColor.800"
                    bold
                  ></AdminTypo.H5>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
          <VStack
            space={"5"}
            w={"33%"}
            bg="light.100"
            p="6"
            rounded="xl"
            ml="3"
            borderWidth={"1px"}
            borderColor={"primary.200"}
            borderStyle={"solid"}
          >
            <HStack p="1" mx="1" rounded="xl">
              <VStack space="20px" w="auto">
                <VStack space="20px" w="auto" rounded="xl">
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    borderColor="light.400"
                    pb="1"
                    borderBottomWidth="1"
                  >
                    <AdminTypo.H5 color="textGreyColor" bold>
                      {t("Property and Facility Details")}
                    </AdminTypo.H5>
                  </HStack>
                  <VStack>
                    <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                      {/* {t("FATHER_NAME")}: */}
                    </AdminTypo.H5>
                    <AdminTypo.H5
                      flex="0.7"
                      color="textGreyColor.800"
                      bold
                    ></AdminTypo.H5>
                  </VStack>

                  <VStack space="2">
                    <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                      {/* {t("MOTHER_NAME")}: */}
                    </AdminTypo.H5>
                    <AdminTypo.H5
                      flex="0.7"
                      color="textGreyColor.800"
                      bold
                    ></AdminTypo.H5>
                  </VStack>
                </VStack>
              </VStack>
            </HStack>
          </VStack>

          <VStack
            space={"5"}
            w={"33%"}
            bg="light.100"
            p="6"
            rounded="xl"
            ml="3"
            borderWidth={"1px"}
            borderColor={"primary.200"}
            borderStyle={"solid"}
          >
            <HStack
              justifyContent="space-between"
              alignItems="center"
              borderColor="light.400"
              pb="1"
              borderBottomWidth="1"
            >
              <AdminTypo.H5 color="textGreyColor" bold>
                {t("Family Consent Letters")}
              </AdminTypo.H5>
            </HStack>
            <VStack>
              <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                {/* {t("SOCIAL_CATEGORY")}: */}
              </AdminTypo.H5>
              <AdminTypo.H5
                flex="0.7"
                color="textGreyColor.800"
                bold
              ></AdminTypo.H5>
            </VStack>

            <VStack space="2">
              <AdminTypo.H5 flex="1" bold color="textGreyColor.550">
                {/* {t("MARITAL_STATUS")}: */}
              </AdminTypo.H5>
              <AdminTypo.H5
                flex="0.7"
                color="textGreyColor.800"
                bold
              ></AdminTypo.H5>
            </VStack>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  );
}
