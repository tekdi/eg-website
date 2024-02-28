import React from "react";
import { Image, VStack } from "native-base";
import { FrontEndTypo } from "@shiksha/common-lib";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";

export default function PhotoUpload({ aadhar_no, formData, navigatePage }) {
  const { t } = useTranslation();
  const { photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;

  React.useEffect(() => {
    if (page >= 4) {
      if (!aadhar_no || aadhar_no === "") {
        navigatePage(`/profile/edit/aadhaar_details`, "aadhaar_details");
      } else {
        navigatePage(`/profile`, "");
      }
    }
  }, [page, formData]);

  return (
    <VStack py={6} px={4} mb={5} space="6" bg="gray.100">
      <FrontEndTypo.H2 color="textMaroonColor.400">
        {t("ADD_ID_PHOTOS")}
      </FrontEndTypo.H2>
      <VStack space={2}>
        <FileUpload
          schema={{
            dimensionsValidation: { width: 1024, height: 768 },
            label: `ADD_FRONT_VIEW_${page}`,
            document_type: "profile_photo",
            document_sub_type: `profile_photo_${page}`,
            userId: formData?.id,
            iconComponent: (
              <Image w={"120"} h="200" source={{ uri: "/profile1.svg" }} />
            ),
          }}
          value={formData?.[`profile_photo_${page}`]?.id}
          key={formData?.[`profile_photo_${page}`]?.id}
          onChange={(e) => console.log(e)}
        />

        <FrontEndTypo.Primarybutton
          p="4"
          mt="4"
          onPress={() => {
            navigatePage(`/profile/edit/upload/${page + 1}`, "upload");
          }}
        >
          {t("SAVE_AND_NEXT")}
        </FrontEndTypo.Primarybutton>

        <FrontEndTypo.Secondarybutton
          p="4"
          mt="4"
          onPress={() => navigatePage("/profile", "")}
        >
          {t("SAVE_AND_PROFILE")}
        </FrontEndTypo.Secondarybutton>
      </VStack>
    </VStack>
  );
}
