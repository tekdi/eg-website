import React from "react";
import { Alert, Box, Checkbox, HStack, VStack } from "native-base";
import {
  Layout,
  BodyMedium,
  FrontEndTypo,
  AdminTypo,
  IconByName,
  ImageView,
  campRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

// App
export default function CampSelectedLearners({
  userTokenInfo,
  footerLinks,
  isEdit,
}) {
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState(false);
  const camp_id = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nonRegisteredUser, setNonRegisteredUser] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const selectAllChecked = selectedIds.length === nonRegisteredUser?.length;
  const onPressBackButton = async () => {
    navigate(`/camp/${camp_id?.id}`);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      setSelectedIds([]);
    } else {
      const newSelectedIds = nonRegisteredUser?.map((item) => item.id);
      setSelectedIds(newSelectedIds);
    }
  };

  const updateLearner = async () => {
    if (selectedIds.length !== 0) {
      const ids = {
        learner_ids: selectedIds,
      };
      console.log("ids", ids);
    } else {
      setAlert(true);
    }
  };

  React.useEffect(async () => {
    const result = await campRegistoryService.campNonRegisteredUser();
    const campdetails = await campRegistoryService.getCampDetails(camp_id);
    const campRegisterUsers = campdetails?.data?.group_users;
    const campNotRegisterUsers = result?.data?.user;
    const mergedData = campRegisterUsers.concat(campNotRegisterUsers);
    setNonRegisteredUser(mergedData);
    const ids = campRegisterUsers.map((item) => item.id);
    setSelectedIds(ids);
    setLoading(false);
  }, []);

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("LEARNERS_IN_CAMP"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <Box py={6} px={4} mb={5}>
        <AdminTypo.H3 color={"textMaroonColor.400"}>
          {alert ? (
            <Alert
              status="warning"
              alignItems={"start"}
              mb="3"
              mt="4"
              width={"100%"}
            >
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t("SELECT_LEARNER")}</BodyMedium>
              </HStack>
            </Alert>
          ) : (
            <></>
          )}
        </AdminTypo.H3>

        <HStack
          space={2}
          paddingRight={2}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          {t("SELECT_ALL")}
          <Checkbox
            isChecked={selectAllChecked}
            onChange={handleSelectAllChange}
          />
        </HStack>
        {nonRegisteredUser?.map((item) => {
          return (
            <HStack
              key={item}
              w={"100%"}
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

              <Box maxW="121px">
                <Checkbox
                  isChecked={selectedIds.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </Box>
            </HStack>
          );
        })}
        <FrontEndTypo.Primarybutton onPress={updateLearner}>
          {t("SAVE_AND_CAMP_PROFILE")}
        </FrontEndTypo.Primarybutton>
      </Box>
    </Layout>
  );
}
