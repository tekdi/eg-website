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
  Checkbox,
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
    width: 60,
    height: 70,
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
        width: scale?.width > 60 ? scale?.width - 1 : 60,
        height: scale?.height > 70 ? scale?.height - 1 : 70,
      });
    } else {
      setScale({
        ...scale,
        width: scale?.width < 110 ? scale?.width + 1 : 60,
        height: scale?.height < 105 ? scale?.height + 1 : 70,
      });
    }
  };

  console.log("data", data);
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

          <VStack space={"5"}>
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("ENROLLMENT_DETAILS_VERIFICATION")}
            </AdminTypo.H4>

            <VStack space={"5"} w="100%" bg="light.100" p="6" rounded="xl">
              <HStack justifyContent={"space-evenly"}>
                <VStack
                  justifyContent="space-between"
                  alignItems="top"
                  borderColor="light.400"
                  pb="1"
                >
                  <HStack>
                    <VStack mx={5}>
                      <AdminTypo.H5 color={"light.400"}>
                        {t("ENROLLMENT_STATUS")}
                      </AdminTypo.H5>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrollment_status}
                      </AdminTypo.H3>
                    </VStack>
                    <VStack mx={5}>
                      <AdminTypo.H5 color={"light.400"}>
                        {t("ENROLLMENT_BOARD")}
                      </AdminTypo.H5>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrolled_for_board}
                      </AdminTypo.H3>
                    </VStack>
                  </HStack>
                  <HStack my={3}>
                    <Checkbox />
                    <VStack ml={3}>
                      <AdminTypo.H4 color={"light.400"}>
                        {t("ENROLLMENT_NUMBER")}
                      </AdminTypo.H4>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrollment_number}
                      </AdminTypo.H3>
                    </VStack>
                  </HStack>
                  <HStack my={3}>
                    <Checkbox />
                    <VStack ml={3}>
                      <AdminTypo.H4 color={"light.400"}>
                        {t("SELECTED_SUBJECTS")}
                      </AdminTypo.H4>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrolled_for_board}
                      </AdminTypo.H3>
                    </VStack>
                  </HStack>
                  <HStack my={3}>
                    <Checkbox />
                    <VStack ml={3}>
                      <AdminTypo.H4 color={"light.400"}>
                        {t("NAME")}
                      </AdminTypo.H4>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrollment_first_name}
                        {data?.program_beneficiaries?.enrollment_last_name &&
                          " " +
                            data?.program_beneficiaries?.enrollment_last_name}
                      </AdminTypo.H3>
                    </VStack>
                  </HStack>
                  <HStack my={3}>
                    <Checkbox />
                    <VStack ml={3}>
                      <AdminTypo.H4 color={"light.400"}>
                        {t("DOB")}
                      </AdminTypo.H4>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrollment_dob}
                      </AdminTypo.H3>
                    </VStack>
                  </HStack>
                  <HStack my={3}>
                    <Checkbox />
                    <VStack ml={3}>
                      <AdminTypo.H4 color={"light.400"}>
                        {t("AADHAAR_NUMBER")}
                      </AdminTypo.H4>
                      <AdminTypo.H3>
                        {data?.program_beneficiaries?.enrollment_aadhaar_no}
                      </AdminTypo.H3>
                    </VStack>
                  </HStack>
                </VStack>

                <VStack width={"60vw"} height={"70vh"}>
                  <ImageView
                    source={{
                      document_id:
                        data?.program_beneficiaries
                          ?.payment_receipt_document_id,
                    }}
                    alt="aadhaar_front"
                    width={scale?.width + "vw"}
                    height={scale?.height + "vh"}
                    maxWidth={"110vW"}
                    minWidth={"60vw"}
                    maxHeight={"105vh"}
                    minHeight={"70vh"}
                    borderRadius="5px"
                    borderWidth="1px"
                    borderColor="worksheetBoxText.100"
                    alignSelf="Center"
                    onWheel={handleScroll}
                  />
                </VStack>
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
