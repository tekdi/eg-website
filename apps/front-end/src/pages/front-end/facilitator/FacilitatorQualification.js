import React from "react";
import { HStack, VStack, Box, Progress, Divider } from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  t,
  Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";

export default function FacilitatorQualification({
  userTokenInfo,
  footerLinks,
}) {
  const [facilitator, setfacilitator] = React.useState();
  const [qualifications, setQualifications] = React.useState();
  const [qualification, setQualification] = React.useState();
  const navigate = useNavigate();
  const [enumOptions, setEnumOptions] = React.useState({});

  React.useEffect(() => {
    facilitatorDetails();
  }, []);

  const facilitatorDetails = async () => {
    const { id } = userTokenInfo?.authUser;
    const result = await facilitatorRegistryService.getOne({ id });
    setfacilitator(result);
    setQualification(result?.qualifications ? result?.qualifications : {});
  };

  React.useEffect(() => {
    getQualification();
  }, [facilitator]);

  const getQualification = async () => {
    const qua = await facilitatorRegistryService.getQualificationAll();
    const ids = JSON.parse(
      facilitator?.program_faciltators?.qualification_ids
        ? facilitator?.program_faciltators?.qualification_ids
        : "[]"
    );
    const arr = qua?.filter((item) => ids.includes(item.id));
    setQualifications(arr);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, [facilitator]);

  console.log(facilitator);

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        leftIcon: (
          <FrontEndTypo.H2>{t("QUALIFICATION_DETAILS")}</FrontEndTypo.H2>
        ),
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      {
        <VStack>
          <VStack px="5" pt="3">
            <VStack
              px="5"
              py="4"
              mb="3"
              borderRadius="10px"
              borderWidth="1px"
              bg="white"
              borderColor="appliedColor"
            >
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3 bold color="textGreyColor.800">
                  {t("QUALIFICATION")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  _icon={{ size: "20" }}
                  onPress={(e) => {
                    navigate(`/profile/edit/qualification_details`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(
                    { ...qualification, teaching: qualifications },
                    [
                      "qualification_master_id",
                      "qualification_reference_document_id",
                      "teaching",
                    ]
                  )}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                    {t("DEGREE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {qualification?.qualification_master?.name ? (
                      <GetEnumValue
                        t={t}
                        enumType={"QUALIFICATION"}
                        enumOptionValue={
                          qualification?.qualification_master?.name
                        }
                        enumApiData={enumOptions}
                      />
                    ) : (
                      "-"
                    )}
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />
                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("DOCUMENT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    <ImageView
                      text={t("LINK")}
                      source={{
                        document_id: qualification?.document_reference?.id,
                      }}
                    />
                  </FrontEndTypo.H3>
                </HStack>
                <Divider
                  orientation="horizontal"
                  bg="AppliedColor"
                  thickness="1"
                />

                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  alignContent="left"
                  position="left"
                >
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("TEACHING_DEGREE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {qualifications?.map((e) => e.name).join(", ")}
                    {/* {qualifications?.map((e) => {
                      <GetEnumValue
                        t={t}
                        enumType={"QUALIFICATION"}
                        enumOptionValue={e.name}
                        enumApiData={enumOptions}
                      />;
                    })} */}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      }
    </Layout>
  );
}
