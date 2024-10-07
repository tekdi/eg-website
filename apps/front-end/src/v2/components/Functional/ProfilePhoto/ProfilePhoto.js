import { IconByName } from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useNavigate } from "react-router-dom";
import FilePreview from "v2/components/Static/FilePreview/FilePreview";
import PropTypes from "prop-types";

export default function ProfilePhoto({
  profile_photo_1,
  editLink,
  isProfileEdit,
}) {
  const navigate = useNavigate();
  return (
    <VStack alignItems="center">
      <HStack
        flexDirection={"row-reverse"}
        space="4"
        position="relative"
        py={4}
      >
        {isProfileEdit && (
          <IconByName
            name="PencilLineIcon"
            color="iconColor.200"
            _icon={{ size: "20" }}
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
      </HStack>
    </VStack>
  );
}

ProfilePhoto.propTypes = {
  profile_photo_1: PropTypes.object,
  editLink: PropTypes.string,
  isProfileEdit: PropTypes.bool,
};
