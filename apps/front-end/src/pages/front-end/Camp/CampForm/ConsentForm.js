import React from "react";
import {
  Actionsheet,
  Box,
  Checkbox,
  HStack,
  Pressable,
  VStack,
} from "native-base";
import {
  Layout,
  FrontEndTypo,
  AdminTypo,
  ImageView,
  IconByName,
  campRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";

// App
export default function ConsentForm() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [uploadData, setUploadData] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [groupUsers, setGroupUsers] = React.useState();
  const [consents, setConsents] = React.useState();

  React.useEffect(async () => {
    const result = await campRegistoryService.getCampDetails({ id });
    const campConsent = await campRegistoryService.getConsent({ camp_id: id });
    setConsents(campConsent?.data?.consents || []);
    setGroupUsers(result?.data?.group_users);
    setLoading(false);
  }, []);

  const onPressBackButton = async () => {
    navigate(`/camp/${id}`);
  };

  const handleCheckbox = (e) => {
    const checked = e;
    if (checked) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  // update schema

  const onClickSubmit = () => {
    navigate(`/camp/${id}`);
  };

  const handleUpload = async (data) => {
    await campRegistoryService.createConsent(data);
    // api call
  };

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("CONSENT_FORM"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <Box py={6} px={4} mb={5}>
        <AdminTypo.H3 color={"textMaroonColor.400"}>
          {t("FAMILY_CONSENT")}
        </AdminTypo.H3>

        {groupUsers?.map((item) => {
          const document = consents?.find((e) => e.user_id === item?.id);
          return (
            <HStack
              key={item}
              bg="white"
              p="2"
              my={2}
              shadow="FooterShadow"
              rounded="sm"
              space="1"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <HStack justifyContent="space-between">
                <HStack alignItems="Center" flex="5">
                  {item?.profile_photo_1?.id ? (
                    <ImageView
                      source={{
                        uri: item?.profile_photo_1?.name,
                      }}
                      // alt="Alternate Text"
                      width={"45px"}
                      height={"45px"}
                    />
                  ) : (
                    <IconByName
                      isDisabled
                      name="AccountCircleLineIcon"
                      color="gray.300"
                      _icon={{ size: "51px" }}
                    />
                  )}

                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <FrontEndTypo.H3 bold color="textGreyColor.800">
                      {item?.id}
                      {item?.program_beneficiaries[0]?.enrollment_first_name}
                      {item?.program_beneficiaries[0]?.enrollment_middle_name &&
                        ` ${item?.program_beneficiaries[0]?.enrollment_middle_name}`}
                      {item?.program_beneficiaries[0]?.enrollment_last_name &&
                        ` ${item?.program_beneficiaries[0]?.enrollment_last_name}`}
                    </FrontEndTypo.H3>
                  </VStack>
                </HStack>
              </HStack>

              <Pressable
                onPress={(e) => {
                  setUploadData({
                    user_id: item?.id,
                    document_id: document?.document_id || null,
                    camp_id: id,
                  });
                }}
              >
                <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                  {document?.document_id ? (
                    <HStack>
                      {t("VIEW")}
                      <IconByName
                        isDisabled
                        name="FileTextLineIcon"
                        color="blueText.450"
                        _icon={{ size: "25px" }}
                      />
                    </HStack>
                  ) : (
                    <HStack>
                      {t("UPLOAD")}
                      <IconByName
                        isDisabled
                        name="Upload2FillIcon"
                        color="blueText.450"
                        _icon={{ size: "25px" }}
                      />
                    </HStack>
                  )}
                </HStack>
              </Pressable>
            </HStack>
          );
        })}

        <HStack space={4} alignItems={"center"}>
          <Checkbox
            checked={false}
            color="blueText.450"
            onChange={(e) => handleCheckbox(e)}
          />
          <AdminTypo.H5>{t("CONSENT_DISCLAIMER")}</AdminTypo.H5>
        </HStack>
        <FrontEndTypo.Primarybutton
          isLoading={loading}
          isDisabled={isDisabled}
          p="4"
          mt="4"
          onPress={() => onClickSubmit()}
        >
          {t("SAVE")}
        </FrontEndTypo.Primarybutton>
      </Box>

      <Actionsheet isOpen={uploadData?.user_id}>
        <Actionsheet.Content alignItems={"left"}>
          <HStack justifyContent={"space-between"} alignItems="strat">
            <FrontEndTypo.H1 color="textGreyColor.800" p="2">
              {t("UPLOAD_CONSENT_FORM")}
            </FrontEndTypo.H1>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setUploadData()}
            />
          </HStack>
        </Actionsheet.Content>
        <VStack bg="white" width={"100%"} space="5" p="5">
          <FileUpload
            schema={{
              label: "UPLOAD_CONSENT_FORM",
              document_type: "camp",
              document_sub_type: "consent_form",
            }}
            value={uploadData?.document_id}
            onChange={(e) => setUploadData({ ...uploadData, document_id: e })}
          />
          <FrontEndTypo.Primarybutton onPress={(e) => handleUpload(uploadData)}>
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      </Actionsheet>
    </Layout>
  );
}
