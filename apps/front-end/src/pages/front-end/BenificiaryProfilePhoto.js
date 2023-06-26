import React, { useState } from "react";
import { Box, Image, Pressable, VStack } from "native-base";
import {
  uploadRegistryService,
  Layout,
  IconByName,
  H2,
  FrontEndTypo,
  ImageView,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BenificiaryProfilePhoto() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id, photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;
  const uplodInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [file, setFile] = React.useState();
  const [benificiary, setBenificiary] = useState({});

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 25) {
      if (page < 4) {
        const result = await uploadProfile(file, `profile_photo_${page}`);
        const data = result?.data?.insert_documents?.returning?.[0];
        setFile(data);
      }
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };

  const uploadProfile = async (file, document_sub_type) => {
    if (id) {
      setLoading(true);
      const form_data = new FormData();
      const item = {
        file: file,
        document_type: "profile_photo",
        document_sub_type,
        user_id: id,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }
      const result = await uploadRegistryService.uploadFile(form_data);
      setLoading(false);
      return result;
    }
  };

  const onPressBackButton = () => {
    if (page === 1) {
      navigate(`/beneficiary/${id}/basicdetails`);
    } else {
      navigate(`/beneficiary/${id}/upload/${page - 1}`);
    }
  };

  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
  }, [id, photoNo]);

  React.useEffect(() => {
    if (!(page < 4)) {
      navigate(`/beneficiary/${id}/basicdetails`);
    }
    setFile(benificiary?.[`profile_photo_${page}`]);
  }, [page, benificiary]);

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        leftIcon: <FrontEndTypo.H2>{t("PHOTOS")}</FrontEndTypo.H2>,
        onlyIconsShow: ["backBtn"],
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
        <H2 color="textMaroonColor.400">{t("ADD_ID_PHOTOS")}</H2>
        <VStack space={2}>
          <Box>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            <Pressable
              isLoading={loading}
              onPress={(e) => {
                uplodInputRef?.current?.click();
              }}
              variant="outline"
              borderWidth="3px"
              borderColor="textGreyColor.100"
              rounded="lg"
              borderStyle="dashed"
              alignItems="center"
              gap="4"
              p="4"
            >
              <VStack alignItems="center" py={file?.id ? "0" : "20"} space="2">
                {file?.id ? (
                  <ImageView
                    w={"150"}
                    h="250"
                    borderRadius="0"
                    source={{
                      document_id: file?.id,
                    }}
                  />
                ) : (
                  <Image w={"120"} h="200" source={{ uri: "/profile1.svg" }} />
                )}
                <IconByName name="Upload2FillIcon" isDisabled />

                {page === 1 ? (
                  <FrontEndTypo.H2 color="textGreyColor.100" textAlign="center">
                    {t("ADD_FRONT_VIEW_1")}
                  </FrontEndTypo.H2>
                ) : <></> ? (
                  page === 2 ? (
                    <FrontEndTypo.H2
                      color="textGreyColor.100"
                      textAlign="center"
                    >
                      {t("ADD_FRONT_VIEW_2")}
                    </FrontEndTypo.H2>
                  ) : (
                    <FrontEndTypo.H2
                      color="textGreyColor.100"
                      textAlign="center"
                    >
                      {t("ADD_FRONT_VIEW_3")}
                    </FrontEndTypo.H2>
                  )
                ) : (
                  <></>
                )}
              </VStack>
            </Pressable>
          </Box>
          {errors?.fileSize ? (
            <H2 color="red.400">{errors?.fileSize}</H2>
          ) : (
            <React.Fragment />
          )}
          <FrontEndTypo.Primarybutton
            isLoading={loading}
            p="4"
            mt="4"
            onPress={() => navigate(`/beneficiary/${id}/upload/${page + 1}`)}
          >
            {t("SAVE_AND_NEXT")}
          </FrontEndTypo.Primarybutton>

          <FrontEndTypo.Secondarybutton
            isLoading={loading}
            p="4"
            mt="4"
            onPress={() => navigate(`/beneficiary/${id}/basicdetails`)}
          >
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
}
