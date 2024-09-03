import { Box, Center } from "native-base";
import React from "react";
import PropTypes from "prop-types";

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
AudioPlayer.propTypes = {
  mediaUrl: PropTypes.string,
};
