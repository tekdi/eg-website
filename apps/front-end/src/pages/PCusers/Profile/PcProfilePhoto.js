import React, { useEffect, useState } from "react";
import { Image, VStack } from "native-base";
import {
  PCusers_layout as Layout,
  H2,
  FrontEndTypo,
  benificiaryRegistoryService,
  PcuserService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";

export default function PcProfilePhoto() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id, photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;
  const [file, setFile] = useState();
  const [benificiary, setBenificiary] = useState({});

  const onPressBackButton = () => {
    navigate(`/profile`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await PcuserService.getPcProfile();
      setBenificiary(data?.data);
      setFile(data?.data?.document_id);
    };
    fetchData();
  }, [id, photoNo]);

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        leftIcon: <FrontEndTypo.H2>{t("PHOTOS")}</FrontEndTypo.H2>,
        onlyIconsShow: ["backBtn"],
      }}
      _page={{ _scollView: { bg: "white" } }}
      stepTitle={t("PHOTOS")}
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
            key={page}
            value={file}
            onChange={(e) => console.log(e)}
          />
          {/* <FrontEndTypo.Primarybutton
            p="4"
            mt="4"
            onPress={() => navigate(`/beneficiary/${id}/upload/${page + 1}`)}
          >
            {t("SAVE_AND_NEXT")}
          </FrontEndTypo.Primarybutton> */}

          <FrontEndTypo.Secondarybutton
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
