import React from "react";
import {
  Alert,
  Box,
  Center,
  HStack,
  Image,
  Modal,
  Pressable,
  VStack,
} from "native-base";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
  Camera,
  Layout,
  H1,
  IconByName,
  H2,
  getBase64,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
  ImageView,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PhotoUpload({ formData, cameraFile, setCameraFile }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;
  const uplodInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [file, setFile] = React.useState();

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 25) {
      if (page < 4) {
        const result = await uploadProfile(file, `profile_photo_${page}`);
        setCameraFile([...(cameraFile ? cameraFile : []), result]);
        const data = result?.data?.insert_documents?.returning?.[0];
        setFile(data);
      }
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };

  const uploadProfile = async (file, document_sub_type) => {
    const { id } = formData;
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
    console.log(page);
    if (page === 1) {
      navigate(`/profile/edit/qualification_details`);
    } else {
      navigate(`/profile/edit/upload/${page - 1}`);
    }
  };

  React.useEffect(() => {
    if (!(page < 4)) {
      navigate(`/profile`);
    }
    setFile(formData?.[`profile_photo_${page}`]);
  }, [page, formData]);

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
              <VStack alignItems="center" py="20">
                {file?.id ? (
                  <ImageView
                    w={"120"}
                    h="200"
                    borderRadius="0"
                    source={{
                      document_id: file?.id,
                    }}
                  />
                ) : (
                  <Box>
                    <Image
                      w={"120"}
                      h="200"
                      source={{ uri: "/profile1.svg" }}
                    />
                    <IconByName
                      name="Upload2FillIcon"
                      textAlign="center"
                      color="textGreyColor.100"
                    />
                  </Box>
                )}
                <FrontEndTypo.H2 color="textGreyColor.100" textAlign="center">
                  {t("UPLOAD_PHOTO")}
                </FrontEndTypo.H2>
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
            onPress={() => navigate(`/profile/edit/upload/${page + 1}`)}
          >
            {t("SAVE_AND_NEXT")}
          </FrontEndTypo.Primarybutton>

          <FrontEndTypo.Secondarybutton
            isLoading={loading}
            p="4"
            mt="4"
            onPress={() => navigate("/profile")}
          >
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
}
