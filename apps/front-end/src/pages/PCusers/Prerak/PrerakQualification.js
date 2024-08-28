import React, { useEffect } from "react";
import { HStack, VStack, Box, Progress, Divider } from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  t,
  PCusers_layout as Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
  PcuserService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function PrerakQualification({ userTokenInfo }) {
  const [loading, setLoading] = React.useState(true);
  const [prerakProfile, setPrerakProfile] = React.useState();
  const [qualifications, setQualifications] = React.useState();
  const [qualification, setQualification] = React.useState();
  const navigate = useNavigate();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [qua, setQua] = React.useState();
  const { id } = useParams();

  const getPrerakProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        id: id,
      };
      const result = await PcuserService.getPrerakProfile(payload);

      setPrerakProfile(result?.data);
      setQualification(
        result?.data?.qualifications ? result?.data?.qualifications : {},
      );
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data || {});
      const qualificationData = await enumRegistryService.getQualificationAll();
      setQua(qualificationData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    getPrerakProfile();
  }, []);

  React.useEffect(async () => {
    const ids = JSON.parse(
      prerakProfile?.program_faciltators?.qualification_ids
        ? prerakProfile?.program_faciltators?.qualification_ids
        : "[]",
    );
    if (Array.isArray(qua) && Array.isArray(ids)) {
      const arr = qua.filter((item) => ids.includes(item.id));
      setQualifications(arr);
    }
  }, [qua, prerakProfile]);

  const onPressBackButton = () => {
    navigate(`/prerak/PrerakProfileView/${id}`);
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        leftIcon: (
          <FrontEndTypo.H2>{t("QUALIFICATION_DETAILS")}</FrontEndTypo.H2>
        ),
        onPressBackButton,
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      facilitator={userTokenInfo?.authUser || {}}
    >
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
            </HStack>
            <Box paddingTop="2">
              <Progress
                value={arrList({ ...qualification, teaching: qualifications }, [
                  "qualification_master_id",
                  "qualification_reference_document_id",
                  "teaching",
                ])}
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
                    urlObject={{
                      fileUrl:
                        qualification?.qualification_reference_document_id,
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
                  {t(`${qualifications?.map((e) => e.name).join(", ")}`)}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}

PrerakQualification.propTypes = {
  userTokenInfo: PropTypes.any,
};
