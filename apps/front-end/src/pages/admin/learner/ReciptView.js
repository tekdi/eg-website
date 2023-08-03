import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
  facilitatorRegistryService,
  Loading,
  t,
  authRegistryService,
  ImageView,
  AdminTypo,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Modal,
  FormControl,
  Input,
  Image,
  useToast,
} from "native-base";
import { ChipStatus } from "component/Chip";
import NotFound from "../../NotFound";
import Steper from "component/Steper";
const Experience = (obj) => {
  return (
    <VStack>
      {obj?.role_title ? (
        <Text>
          {t("ROLE")} : {obj?.role_title}
        </Text>
      ) : (
        <React.Fragment />
      )}
      {obj?.experience_in_years ? (
        <Text>
          {t("YEARS_OF_EX")} : {obj?.experience_in_years}
        </Text>
      ) : (
        <React.Fragment />
      )}
      {obj?.description ? (
        <Text>
          {t("DESCRIPTION")} : {obj?.description}
        </Text>
      ) : (
        <React.Fragment />
      )}
    </VStack>
  );
};

export default function ReciptView({ footerLinks }) {
  const toast = useToast();

  const { id } = useParams();
  const [data, setData] = React.useState();
  const [scale, setScale] = React.useState({
    width: 40,
    height: 45,
  });

  const navigate = useNavigate();

  React.useEffect(async () => {
    const profileDetails = async () => {
      const result = await benificiaryRegistoryService.getOne(id);
      setData(result?.result);
    };
    await profileDetails();
  }, []);

  const handleScroll = (event) => {
    const deltaY = event.deltaY;
    if (deltaY < 0) {
      setScale({
        ...scale,
        width: scale?.width > 40 ? scale?.width - 1 : 40,
        height: scale?.height > 45 ? scale?.height - 1 : 45,
      });
    } else {
      setScale({
        ...scale,
        width: scale?.width < 90 ? scale?.width + 1 : 40,
        height: scale?.height < 85 ? scale?.height + 1 : 45,
      });
    }
  };

  console.log("data", scale);
  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <Image
              source={{
                uri: "/profile.svg",
              }}
              alt="Prerak Orientation"
              size="30px"
              resizeMode="contain"
            />

            <AdminTypo.H1 color="Activatedcolor.400">
              {" "}
              {t("ALL_PRERAK")}
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

          <VStack space={"5"} p="5" mt="6">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PAYMENT_RECEIPT").toUpperCase()}
            </AdminTypo.H4>

            <VStack space={"5"} w="100%" bg="light.100" p="6" rounded="xl">
              <HStack
                justifyContent="space-between"
                alignItems="center"
                borderColor="light.400"
                pb="1"
                borderBottomWidth="1"
              ></HStack>
              <HStack justifyContent={"space-between"}>
                <ImageView
                  source={{
                    document_id:
                      data?.program_beneficiaries?.payment_receipt_document_id,
                  }}
                  alt="aadhaar_front"
                  width={scale?.width + "vw"}
                  height={scale?.height + "vh"}
                  maxWidth={"90vh"}
                  minWidth={"40vw"}
                  maxHeight={"85vh"}
                  minHeight={"45vh"}
                  borderRadius="5px"
                  borderWidth="1px"
                  borderColor="worksheetBoxText.100"
                  alignSelf="Center"
                  onWheel={handleScroll}
                />
              </HStack>
              <HStack width={"100%"}>
                <AdminTypo.PrimaryButton>
                  {t("FACILITATOR_STATUS_QUIT")}
                </AdminTypo.PrimaryButton>
                <AdminTypo.Secondarybutton mx={5}>
                  {t("FACILITATOR_STATUS_REJECTED")}
                </AdminTypo.Secondarybutton>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </HStack>
    </Layout>
  );
}
