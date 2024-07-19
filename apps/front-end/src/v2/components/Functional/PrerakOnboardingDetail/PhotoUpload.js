import React, { useState, useEffect } from "react";
import { Image, VStack } from "native-base";
import { FrontEndTypo } from "@shiksha/common-lib";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";
import { OfflineFileUpload } from "v2/components/Static/FormBaseInput/FormBaseInput";
import { updateOnboardingData } from "v2/utils/OfflineHelper/OfflineHelper";
import { useNavigate } from "react-router-dom";

export default function PhotoUpload({
  userid,
  facilitator,
  aadhar_no,
  formData,
  navigatePage,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { photoNo } = useParams();
  const page = photoNo ? parseInt(photoNo) : 1;

  React.useEffect(() => {
    if (page >= 4) {
      // Uncomment if Aadhaar is required.

      // if (!aadhar_no || aadhar_no === "") {
      //   navigatePage(`/profile/edit/aadhaar_details`, "aadhaar_details");
      // } else {
      //   navigatePage(`/profile`, "");
      // }

      navigatePage(`/profile`, "");
    } else {
      setFileValue(
        facilitator?.[`profile_photo_${page}`]?.base64
          ? facilitator[`profile_photo_${page}`].base64
          : ""
      );
    }
  }, [page, formData]);

  const [fileValue, setFileValue] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (fileValue) {
        let newdata = {};
        newdata[`profile_photo_${page}`] = {
          base64: fileValue,
          id: "",
          name: "",
          document_type: "profile_photo",
          document_sub_type: `profile_photo_${page}`,
          path: "",
        };
        //offline data submit
        await updateOnboardingData(userid, newdata);
      }
    }
    fetchData();
  }, [fileValue]);

  const handleProfilePhoto = (label) => {
    if (fileValue) {
      if (label === "profile") {
        navigatePage("/profile", "");
      } else {
        navigate(`/profile/edit/upload/${page + 1}`);
      }
    } else {
      setError(`REQUIRED_MESSAGE`);
    }
  };

  return (
    <VStack py={6} px={4} mb={5} space="6">
      <VStack space={2}>
        <FrontEndTypo.H1 color="textGreyColor.750">
          {t("ADD_ID_PHOTOS")}
        </FrontEndTypo.H1>
        <FrontEndTypo.H3 color="#4F4F4F">
          {t("PHOTO_DESCRIPTION")}
        </FrontEndTypo.H3>
      </VStack>
      <VStack space={2}>
        <OfflineFileUpload
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
          value={fileValue}
          key={formData?.[`profile_photo_${page}`]?.id}
          onChange={(e) => setFileValue(e)}
        />

        {error && (
          <FrontEndTypo.H2 mt={3} color={"textMaroonColor.400"}>
            {t(`ADD_FRONT_VIEW_${page}`)}
          </FrontEndTypo.H2>
        )}

        <VStack alignItems={"center"}>
          <FrontEndTypo.Primarybutton
            p="4"
            mt="4"
            minW={"60%"}
            onPress={() => {
              handleProfilePhoto("next");
            }}
          >
            {t("SAVE_AND_NEXT")}
          </FrontEndTypo.Primarybutton>

          <FrontEndTypo.Secondarybutton
            p="4"
            mt="4"
            minW={"60%"}
            onPress={() => handleProfilePhoto("profile")}
          >
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </VStack>
  );
}
