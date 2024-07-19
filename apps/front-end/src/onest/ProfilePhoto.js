import React, { useEffect, useState } from "react";
import { Image, VStack } from "native-base";
import { H2, FrontEndTypo } from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";
import Layout from "./Layout";

export default function ProfilePhoto({ userTokenInfo: { authUser } }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;
  const [file, setFile] = useState();
  const [volunteer, setVolunteer] = useState({});

  const onPressBackButton = () => {
    if (page === 1) {
      navigate(`/profile`);
    } else {
      navigate(`/profile/4/edit`);
    }
  };

  React.useEffect(() => {
    const init = async () => {
      setVolunteer(authUser);
    };
    init();
  }, []);

  useEffect(() => {
    if (!(page < 2)) {
      navigate(`/profile`);
    }
    setFile(volunteer?.[`profile_photo_${page}`]);
  }, [page, volunteer]);

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      _appBar={{
        onPressBackButton,
        leftIcon: <FrontEndTypo.H2>{t("PHOTOS")}</FrontEndTypo.H2>,
        onlyIconsShow: ["backBtn"],
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"VOUNTEER_PROFILE"}
      pageTitle={t("VOUNTEER")}
      stepTitle={t("PHOTOS")}
    >
      <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
        <H2 color="textMaroonColor.400">{t("VOLUNTEER_ADD_ID_PHOTOS")}</H2>
        <VStack space={2}>
          <FileUpload
            schema={{
              dimensionsValidation: { width: 1024, height: 768 },
              label: `ADD_FRONT_VIEW_${page}`,
              document_type: "profile_photo",
              document_sub_type: `profile_photo_${page}`,
              userId: authUser?.id,
              iconComponent: (
                <Image w={"120"} h="200" source={{ uri: "/profile1.svg" }} />
              ),
            }}
            key={page}
            value={file?.id}
            onChange={(e) => console.log(e)}
          />
          <FrontEndTypo.Secondarybutton
            p="4"
            mt="4"
            onPress={() => navigate(`/profile`)}
          >
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
}
