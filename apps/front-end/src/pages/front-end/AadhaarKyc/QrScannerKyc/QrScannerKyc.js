import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import "./QrScannerKyc.css";
import { Button, Text } from "native-base";

export default function QrScannerKyc() {
  const navigate = useNavigate();

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  

  React.useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const constraints = {
      video: { facingMode: "environment" }, // use back camera by default
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(tick);
      })
      .catch((error) => {
        console.error(error);
      });

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          
          console.log("qr data -> ", code.data);
        }
      }
      requestAnimationFrame(tick);
    };

    return () => {
      if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="qrScannerPage">
      <div className="topbar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <WestIcon />
        </button>
      </div>

      <div className="content">
        <h2>Scan Your Aadhaar QR Code</h2>

        <video ref={videoRef} style={{ width: "100%" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <Button variant="secondary" bg={"gray.500"} py="12px" px="20px" mt={10}>
          <Text color="white">Continue</Text>
        </Button>
      </div>
    </div>
  );
}