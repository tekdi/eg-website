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
import { FileUpload } from "component/BaseInput";

export default function PhotoUpload({
  aadhar_no,
  formData,
  cameraFile,
  setCameraFile,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;
  const uplodInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [file, setFile] = React.useState();

  const onPressBackButton = () => {
    if (page === 1) {
      navigate(`/facilitatorbasicdetail`);
    } else {
      navigate(`/profile/edit/upload/${page - 1}`);
    }
  };

  React.useEffect(() => {
    if (page >= 4) {
      if (!aadhar_no || aadhar_no === "") {
        navigate(`/profile/edit/aadhaar_details`);
      } else {
        navigate(`/profile`);
      }
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
          <FileUpload
            schema={{
              label: `ADD_FRONT_VIEW_${page}`,
              document_type: "profile_photo",
              document_sub_type: `profile_photo_${page}`,
              userId: formData?.id,
              iconComponent: (
                <Image w={"120"} h="200" source={{ uri: "/profile1.svg" }} />
              ),
            }}
            value={formData?.[`profile_photo_${page}`]?.id}
            onChange={(e) => console.log(e)}
          />
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
