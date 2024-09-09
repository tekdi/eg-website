import React from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";

const VideoPlayer = ({ url }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
                @media (max-width: 768px) {
                    .video-container {
                        height: auto;
                    }
                }
                @media (min-width: 769px) {
                    .video-container {
                        height: 450px;
                    }
                }
            `}</style>
      <div className="video-container">
        <ReactPlayer url={url} controls={true} width="100%" height="100%" />
      </div>
    </div>
  );
};

export default VideoPlayer;
VideoPlayer.propTypes = {
  url: PropTypes.string,
};
