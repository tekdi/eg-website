import React from "react";
import { Box, Checkbox, HStack, Pressable, VStack } from "native-base";
import {
  Layout,
  FrontEndTypo,
  AdminTypo,
  ImageView,
  IconByName,
  campRegistoryService,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// App
export default function ConsentForm() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [groupUsers, setGroupUsers] = React.useState();

  const uplodInputRef = React.useRef();

  const handleFileInputChange = async (e, campLearnerId) => {
    let file = e.target.files[0];
    setLoading(true);
    const form_data = new FormData();
    const item = {
      file: file,
      document_type: "camp",
      document_sub_type: "consent_form",
      user_id: campLearnerId,
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const data = await uploadRegistryService.uploadFile(form_data);
    const docId = data?.data?.insert_documents?.returning[0]?.id || "";
    const obj = {
      document_id: `${docId}`,
      id: id,
    };
    await campRegistoryService.createConsent(obj);
    setLoading(false);
  };

  React.useEffect(async () => {
    const result = await campRegistoryService.getCampDetails({ id });
    console.log("resultresult", result);
    setGroupUsers(result?.data?.group_users);
    setLoading(false);
  }, []);

  console.log("result", groupUsers);

  const onPressBackButton = async () => {
    navigate(`/camp/campRegistration/${id}`);
  };

  const handleCheckbox = (e) => {
    const checked = e;
    if (checked) {
      console.log("checked");
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  // update schema

  const onClickSubmit = () => {
    navigate(`/camp/campRegistration/${id}`);
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
                      {item?.program_beneficiaries[0]?.enrollment_first_name}
                      {item?.program_beneficiaries[0]?.enrollment_middle_name &&
                        ` ${item?.program_beneficiaries[0]?.enrollment_middle_name}`}
                      {item?.program_beneficiaries[0]?.enrollment_last_name &&
                        ` ${item?.program_beneficiaries[0]?.enrollment_last_name}`}
                    </FrontEndTypo.H3>
                  </VStack>
                </HStack>
              </HStack>

              {/* <ImageView
                source={{
                  document_id: 1304,
                }}
                text={
                  <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                    {t("VIEW")}
                    <IconByName
                      isDisabled
                      name="FileTextLineIcon"
                      color="blueText.450"
                      _icon={{ size: "25px" }}
                    ></IconByName>
                  </HStack>
                }
              /> */}
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                ref={uplodInputRef}
                onChange={(e) => {
                  handleFileInputChange(e, item?.id);
                }}
              />
              <Pressable
                onPress={(e) => {
                  uplodInputRef?.current?.click();
                }}
              >
                <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                  {t("UPLOAD")}
                  <IconByName
                    isDisabled
                    name="Upload2FillIcon"
                    color="blueText.450"
                    _icon={{ size: "25px" }}
                  ></IconByName>
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
    </Layout>
  );
}
