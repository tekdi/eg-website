import React, { useEffect, useState } from "react";
import { Image, VStack } from "native-base";
import {
  Layout,
  H2,
  FrontEndTypo,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";

export default function BenificiaryProfilePhoto() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id, photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;
  const [file, setFile] = useState();
  const [benificiary, setBenificiary] = useState({});
  const [searchParams] = useSearchParams();
  const redirectLink = searchParams.get("redirectLink");
  const onPressBackButton = () => {
    if (page === 1) {
      navigate(`/beneficiary/${id}/basicdetails`);
    } else {
      navigate(`/beneficiary/${id}/upload/${page - 1}`);
    }
  };

  useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
  }, [id, photoNo]);

  useEffect(() => {
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
      analyticsPageTitle={"BENEFICIARY_PROFILE"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("PHOTOS")}
    >
      <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
        <H2 color="textMaroonColor.400">{t("ADD_ID_PHOTOS")}</H2>
        <VStack space={2}>
          <FileUpload
            schema={{
              dimensionsValidation: { width: 1024, height: 768 },
              label: `ADD_FRONT_VIEW_${page}`,
              document_type: "profile_photo",
              document_sub_type: `profile_photo_${page}`,
              userId: id,
              iconComponent: (
                <Image w={"120"} h="200" source={{ uri: "/profile1.svg" }} />
              ),
            }}
            key={page}
            value={file?.id}
            onChange={(e) => console.log(e)}
          />
          {redirectLink && (
            <FrontEndTypo.Primarybutton
              p="4"
              mt="4"
              onPress={() => navigate(redirectLink)}
            >
              {t("SAVE_AND_ENROLLMENT")}
            </FrontEndTypo.Primarybutton>
          )}
          <FrontEndTypo.Primarybutton
            p="4"
            mt="4"
            onPress={() => navigate(`/beneficiary/${id}/upload/${page + 1}`)}
          >
            {t("SAVE_AND_NEXT")}
          </FrontEndTypo.Primarybutton>

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
