import { Box, Center } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

const AudioPlayer = ({ mediaUrl }) => {
  const { t } = useTranslation();

  return (
    <Center>
      <Box>
        <audio controls>
          <source src={mediaUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </Box>
    </Center>
  );
};

export default AudioPlayer;
