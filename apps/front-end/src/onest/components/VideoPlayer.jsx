import React from 'react';
import ReactPlayer from 'react-player';
import { useTranslation } from "react-i18next";

const VideoPlayer = ({ url }) => {
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
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
}

export default VideoPlayer;
