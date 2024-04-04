import { IconByName, ImageView } from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";
import FilePreview from "v2/components/Static/FilePreview/FilePreview";

export default function ProfilePhoto({
  profile_photo_1,
  profile_photo_2,
  profile_photo_3,
  editLink,
  isProfileEdit,
}) {
  const navigate = useNavigate();
  return (
    <VStack alignItems="center">
      <VStack position="relative" py={4}>
        {isProfileEdit && (
          <IconByName
            right="-20"
            top="0"
            p="2"
            position="absolute"
            name="PencilLineIcon"
            onPress={(e) => navigate(editLink || `/profile/edit/upload/1`)}
          />
        )}

        {profile_photo_1?.base64 ? (
          <FilePreview
            base64={profile_photo_1?.base64}
            width={"64px"}
            height={"64px"}
            borderRadius="50%"
          />
        ) : (
          <IconByName
            isDisabled
            name="AccountCircleLineIcon"
            color="iconColor.350"
            _icon={{ size: "64" }}
            justifySelf="Center"
          />
        )}
      </VStack>

      {/* <HStack alignItems="center" space="6">
        {[profile_photo_1, profile_photo_2, profile_photo_3].map(
          (photo) =>
            photo?.base64 && (
              <FilePreview
                key={photo?.id}
                base64={photo?.base64}
                width={"60px"}
                height={"60px"}
                borderRadius="50%"
              />
            )
        )}
      </HStack> */}
    </VStack>
  );
}
