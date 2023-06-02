import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import "./QrScannerKyc.css";
import { FrontEndTypo,Layout } from "@shiksha/common-lib";

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
    <Layout
    _appBar={{
      onlyIconsShow: ["backBtn"],
      _box: { bg: "white", shadow: "appBarShadow" },
      _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
    }}
    >
    <div className="qrScannerPage">
      <div className="topbar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <WestIcon />
        </button>
      </div>

      <div className="content">
        <FrontEndTypo.H1 bold>{t("SCAN_YOUR_AADHAR_QR_CODE")}</FrontEndTypo.H1>

        <video ref={videoRef} style={{ width: "100%" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <FrontEndTypo.Secondarybutton mt={10}>
         {t("CONTINUE")}
        </FrontEndTypo.Secondarybutton>
      </div>
    </div>
    </Layout>
  );
}
