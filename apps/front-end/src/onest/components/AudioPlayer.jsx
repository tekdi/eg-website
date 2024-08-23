import { Box, Center } from "native-base";
import React from "react";

const AudioPlayer = ({ mediaUrl }) => {
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
