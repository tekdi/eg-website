import React from "react";
import WestIcon from "@mui/icons-material/West";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "native-base";
import "../AadhaarKyc.css";
import { Camera, getBase64,t } from "@shiksha/common-lib";

export default function ManualUpload() {
  const navigate = useNavigate();

  const [image, setImage] = React.useState({
    front: "",
    back: "",
  });

  const [isFront, setIsFront] = React.useState(true);
  const [modal, setModal] = React.useState(false);

  const [cameraUrl, setCameraUrl] = React.useState();
  const [cameraModal, setCameraModal] = React.useState(false);

  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    console.log("images -> ", image);
  }, [image]);

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 2) {
      const data = await getBase64(file);
      setCameraUrl(data);
      // setImage(data);
      if (isFront) {
        setImage((prev) => ({ ...prev, front: data }));
      } else {
        setImage((prev) => ({ ...prev, back: data }));
      }
      setModal(false);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (cameraModal) {
    const handleSetCameraUrl = async (url) => {
      setCameraUrl(url);
  
      if (isFront) {
        setImage((prev) => ({ ...prev, front: url }));
      } else {
        setImage((prev) => ({ ...prev, back: url }));
      }
  
      setCameraModal(false);
      setModal(false);
    };
  
    return (
      <Camera
        cameraModal={cameraModal}
        setCameraModal={setCameraModal}
        cameraUrl={cameraUrl}
        setCameraUrl={handleSetCameraUrl}
      />
    );
  } 
  
  

  return (
    <div className="manualUploadPage" style={{ position: "relative" }}>
      <div className="topbar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <WestIcon />
        </button>
      </div>

      <div className="content">
        {!submitted ? (
          <>
            <h2> {t("AADHAR_CARD")}</h2>
            <Text>{t("UPLOAD_A_PHOTO_OR_SCAN_OF_YOUR_CARD")}</Text>

            <button
              className="btn-uploadOptions"
              onClick={() => {
                setModal(true);
              }}
            >
              {isFront ? (
                image.front ? (
                  <img src={image.front} alt="front image" />
                ) : (
                  <>
                    <UploadIcon />
                    <Text>{t("UPLOAD_THE_FRONT_SIDE_OF_YOUR_AADHAAR_CARD")}</Text>
                  </>
                )
              ) : image.back ? (
                <img src={image.back} alt="back image" />
              ) : (
                <>
                  <UploadIcon />
                  <Text>{t("UPLOAD_THE_BACK_SIDE_OF_YOUR_AADHAAR_CARD")}</Text>
                </>
              )}
            </button>

            <div className="indicators">
              <button
                onClick={() => setIsFront(!isFront)}
                className={`btn-indicator ${isFront ? "active" : ""}`}
              ></button>

              <button
                onClick={() => setIsFront(!isFront)}
                className={`btn-indicator ${!isFront ? "active" : ""}`}
              ></button>
            </div>

            {isFront ? (
              image.front ? (
                <Button
                  variant="secondary"
                  bg="gray.400"
                  py="12px"
                  px="20px"
                  mt="10"
                  onPress={() => {
                    setImage((prev) => ({ ...prev, front: "" }));
                    setModal(true);
                  }}
                >
                  <Text color="white">{t("UPLOAD_AGAIN")}</Text>
                </Button>
              ) : null
            ) : image.back ? (
              <Button
                variant="secondary"
                bg="gray.400"
                py="12px"
                px="20px"
                mt="10"
                onPress={() => {
                  setImage((prev) => ({ ...prev, back: "" }));
                  setModal(true);
                }}
              >
                <Text color="white">{t("UPLOAD_AGAIN")}</Text>
              </Button>
            ) : null}

            <Button
              variant="secondary"
              bg={!image.front || !image.back ? "gray.300" : "gray.500"}
              py="12px"
              px="20px"
              mt="10"
              disabled={!image.front || !image.back}
              onPress={handleSubmit}
            >
              <Text color="white"></Text>
            </Button>
          </>
        ) : (
          <>
            <p className="boxMessage3">
              <CheckIcon fontSize="medium" />
              <span>{t("AADHAAR_CARD_UPLOADED")}</span>
            </p>

            <div className="front__image">
              <h4>{t("FRONT_VIEW")}</h4>

              <img src={image.front} alt="front image" />
            </div>

            <div className="back__image">
              <h4>{t("BACK_VIEW")}</h4>

              <img src={image.back} alt="back image" />
            </div>

            <Button
              variant="secondary"
              bg={"gray.500"}
              py="12px"
              px="20px"
              mt="10"
            >
              <Text color="white">{t("CONTINUE")}</Text>
            </Button>
          </>
        )}
      </div>

      {modal && (
  <div className="uploadModal">
    <div className="modal__container">
      <div className="upload__options">
        <button onClick={() => {
          setCameraUrl();
          setCameraModal(true);
        }}>
          {t("TAKE_A_PHOTO")}
        </button>

        <label htmlFor="galleryUpload">{t("UPLOAD_FROM_GALLERY")}</label>
        <input
          type="file"
          id="galleryUpload"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />

        <label htmlFor="fileUpload">{t("Upload a file")}</label>
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
      </div>

      <button className="btn-cancel" onClick={() => {
        setModal(false);
      }}>
       {t("CANCEL")}
      </button>
    </div>
  </div>
)}

    </div>
  );
}