import React from "react";
import {
  Alert,
  Box,
  Center,
  Checkbox,
  HStack,
  Progress,
  VStack,
} from "native-base";
import {
  Layout,
  BodyMedium,
  FrontEndTypo,
  AdminTypo,
  IconByName,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

// App
export default function CampList({ userTokenInfo, footerLinks, isEdit }) {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const data = [
    {
      name: "abc",
      id: 1,
    },
    {
      name: "qwerty",
      id: 2,
    },
    {
      name: "Swapnil",
      id: 3,
    },
  ];
  const [selectedIds, setSelectedIds] = React.useState([]);
  const selectAllChecked = selectedIds.length === data.length;
  const onPressBackButton = async () => {
    if (!isEdit) {
      navigate("/camp");
    } else {
      navigate("/camp/campRegistration");
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
      const newSelectedIds = data.map((item) => item.id);
      setSelectedIds(newSelectedIds);
    }
  };
  // console.log("selectedItems", selectedIds);

  const createCamp = () => {
    if (selectedIds.length !== 0) {
      navigate(`/camp/campRegistration`);
    } else {
      setAlert(true);
    }
  };
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
        {data.map((item) => {
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
                  {/* <ImageView
                          source={{
                            document_id: 11,
                          }}
                          alt="Alternate Text"
                          width={"45px"}
                          height={"45px"}
                        /> */}

                  <IconByName
                    isDisabled
                    name="AccountCircleLineIcon"
                    color="gray.300"
                    _icon={{ size: "45px" }}
                  />

                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <FrontEndTypo.H3 bold color="textGreyColor.800">
                      {item?.name}
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
    </Layout>
  );
}
