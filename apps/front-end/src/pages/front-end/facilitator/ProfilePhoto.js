import { IconByName, ImageView } from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePhoto({
  profile_photo_1,
  profile_photo_2,
  profile_photo_3,
  editLink,
}) {
  const navigate = useNavigate();
  return (
    <VStack alignItems="center">
      <VStack position="relative" p="4">
        {editLink && (
          <IconByName
            right="-20"
            top="0"
            p="2"
            position="absolute"
            name="PencilLineIcon"
            onPress={(e) => navigate(editLink || `/profile/edit/upload/1`)}
          />
        )}
        {profile_photo_1?.id ? (
          <ImageView
            w="120"
            h="120"
            source={{ document_id: profile_photo_1?.id }}
          />
        ) : (
          <IconByName
            isDisabled
            name="AccountCircleLineIcon"
            color="iconColor.350"
            _icon={{ size: "120" }}
            justifySelf="Center"
          />
        )}
      </VStack>

      <HStack alignItems="center" space="6">
        {[profile_photo_1, profile_photo_2, profile_photo_3].map(
          (photo) =>
            photo?.id && (
              <ImageView
                key={photo}
                w="60"
                h="60"
                source={{
                  document_id: photo?.id,
                }}
              />
            )
        )}
      </HStack>
    </VStack>
  );
}
