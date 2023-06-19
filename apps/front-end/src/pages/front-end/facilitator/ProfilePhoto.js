import { IconByName, ImageView } from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePhoto({ facilitator }) {
  const navigate = useNavigate();
  return (
    <VStack alignItems="center">
      <VStack position="relative" p="4">
        <IconByName
          right="0"
          top="0"
          p="2"
          position="absolute"
          name="PencilLineIcon"
          onPress={(e) => navigate(`/profile/edit/upload/1`)}
        />
        {facilitator?.profile_photo_1?.id ? (
          <ImageView
            w="120"
            h="120"
            source={{ document_id: facilitator?.profile_photo_1?.id }}
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
        {[1, 2, 3].map(
          (photo) =>
            facilitator?.[`profile_photo_${photo}`]?.id && (
              <ImageView
                key={photo}
                w="60"
                h="60"
                source={{
                  document_id: facilitator?.[`profile_photo_${photo}`]?.id,
                }}
              />
            )
        )}
      </HStack>
    </VStack>
  );
}
