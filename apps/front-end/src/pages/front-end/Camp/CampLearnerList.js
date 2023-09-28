import React from "react";
import { Alert, Box, Checkbox, HStack, Text, VStack } from "native-base";
import {
  Layout,
  BodyMedium,
  FrontEndTypo,
  AdminTypo,
  IconByName,
  ImageView,
  CampService,
} from "@shiksha/common-lib";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

// App
export default function CampList({ userTokenInfo, footerLinks, isEdit }) {
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState(false);
  const camp_id = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nonRegisteredUser, setNonRegisteredUser] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const selectAllChecked = selectedIds.length === nonRegisteredUser?.length;
  const onPressBackButton = async () => {
    if (!isEdit) {
      navigate("/camps");
    } else {
      navigate(`/camps/${camp_id?.id}`);
    }
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

  const createCamp = async () => {
    if (selectedIds.length !== 0) {
      const ids = {
        learner_ids: selectedIds,
      };
      const result = await CampService.campRegister(ids);
      const camp_id = result?.data?.camp?.id;
      navigate(`/camps/${camp_id}`);
    } else {
      setAlert(true);
    }
  };

  React.useEffect(async () => {
    const result = await CampService.campNonRegisteredUser();
    setNonRegisteredUser(result?.data?.user);
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
      {location?.state === "camp" ? (
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
                        {item?.program_beneficiaries[0]
                          ?.enrollment_middle_name &&
                          ` ${item?.program_beneficiaries[0]?.enrollment_middle_name}`}
                        {item?.program_beneficiaries[0]?.enrollment_last_name &&
                          ` ${item?.program_beneficiaries[0]?.enrollment_last_name}`}
                      </FrontEndTypo.H3>
                      <Text>
                        {item?.district}, {item?.block},{item?.village}
                      </Text>
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
          {!isEdit ? (
            <FrontEndTypo.Primarybutton onPress={createCamp}>
              {t("CREATE_CAMP")}
            </FrontEndTypo.Primarybutton>
          ) : (
            <FrontEndTypo.Primarybutton onPress={createCamp}>
              {t("SAVE_AND_CAMP_PROFILE")}
            </FrontEndTypo.Primarybutton>
          )}
        </Box>
      ) : (
        <Alert
          status="warning"
          alignItems={"start"}
          mb="3"
          mt="4"
          width={"100%"}
        >
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      )}
    </Layout>
  );
}
