import React, { useEffect, useState } from "react";
import {
  FrontEndTypo,
  H2,
  PCusers_layout as Layout,
  PcuserService,
} from "@shiksha/common-lib";
import { FileUpload } from "component/BaseInput";
import { Image, VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function PcProfilePhoto({ userTokenInfo }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [file, setFile] = useState();

  const onPressBackButton = () => {
    navigate(`/profile`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await PcuserService.getPcProfile();
      setFile(data?.data?.document_id);
    };
    fetchData();
  }, [id]);

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        leftIcon: <FrontEndTypo.H2>{t("PHOTOS")}</FrontEndTypo.H2>,
        onlyIconsShow: ["backBtn"],
      }}
      _page={{ _scollView: { bg: "white" } }}
      stepTitle={t("PHOTOS")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
        <H2 color="textMaroonColor.400">{t("ADD_PHOTOS")}</H2>
        <VStack space={2}>
          <FileUpload
            schema={{
              dimensionsValidation: { width: 1024, height: 768 },
              label: `ADD_PHOTOS`,
              document_type: "profile_photo",
              document_sub_type: `profile_photo_1`,
              userId: id,
              iconComponent: (
                <Image w={"120"} h="200" source={{ uri: "/profile1.svg" }} />
              ),
            }}
            value={file}
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

PcProfilePhoto.propTypes = {
  userTokenInfo: PropTypes.object,
};
