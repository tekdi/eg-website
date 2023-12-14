import React from "react";
import { Alert, Box, Checkbox, HStack, Text, VStack } from "native-base";
import {
  Layout,
  BodyMedium,
  FrontEndTypo,
  AdminTypo,
  IconByName,
  ImageView,
  campService,
} from "@shiksha/common-lib";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

// App
export default function CampList({ userTokenInfo, footerLinks }) {
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState(false);
  const [errors, setErrors] = React.useState();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nonRegisteredUser, setNonRegisteredUser] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(false);

  const selectAllChecked = selectedIds.length === nonRegisteredUser?.length;
  const onPressBackButton = async () => {
    navigate("/camps");
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
    setIsDisable(true);
    if (selectedIds.length !== 0) {
      const ids = {
        learner_ids: selectedIds,
      };
      const result = await campService.campRegister(ids);
      const camp_id = result?.data?.camp?.id;
      if (camp_id) {
        setIsDisable(false);
        navigate(`/camps/${camp_id}`);
      } else {
        setIsDisable(false);
        setErrors(result?.message);
      }
    } else {
      setIsDisable(false);
      setAlert(true);
    }
  };
  React.useEffect(async () => {
    const result = await campService.campNonRegisteredUser();
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
      {location?.state === "camp" && nonRegisteredUser.length !== 0 ? (
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
              colorScheme="danger"
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
                      <Text>{item?.district}</Text>
                      <Text>{item?.block}</Text>
                      <Text>{item?.village}</Text>
                    </VStack>
                  </HStack>
                </HStack>

                <Box maxW="121px">
                  <Checkbox
                    isChecked={selectedIds.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    colorScheme="danger"
                  />
                </Box>
              </HStack>
            );
          })}

          {errors && (
            <Alert
              status="warning"
              alignItems={"start"}
              mb="3"
              mt="4"
              width={"100%"}
            >
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t(errors)}</BodyMedium>
              </HStack>
            </Alert>
          )}

          <FrontEndTypo.Primarybutton
            isDisabled={isDisable}
            onPress={createCamp}
          >
            {t("CREATE_CAMP")}
          </FrontEndTypo.Primarybutton>
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
            <BodyMedium>
              {nonRegisteredUser.length !== 0
                ? t("PAGE_NOT_ACCESSABLE")
                : t("LEARNER_NOT_AVAILABLE")}
            </BodyMedium>
          </HStack>
        </Alert>
      )}
    </Layout>
  );
}
