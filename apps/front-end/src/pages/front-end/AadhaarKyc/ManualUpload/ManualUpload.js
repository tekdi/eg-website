import React from "react";
import WestIcon from "@mui/icons-material/West";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "native-base";
import "../AadhaarKyc.css";
import { Camera, getBase64 } from "@shiksha/common-lib";

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
    return (
      <Camera
        {...{
          cameraModal,
          setCameraModal,
          cameraUrl,
          setCameraUrl: async (url) => {
            // console.log("image url -> ", url);
            setCameraUrl(url);
            // setImage(url);
            if (isFront) {
              setImage((prev) => ({ ...prev, front: url }));
            } else {
              setImage((prev) => ({ ...prev, back: url }));
            }
            setCameraModal(false);
            setModal(false);
          },
        }}
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
            <h2>Aadhaar Card</h2>
            <Text>Upload a photo or scan of your card</Text>

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
                    <Text>Upload the front side of your Aadhaar card</Text>
                  </>
                )
              ) : image.back ? (
                <img src={image.back} alt="back image" />
              ) : (
                <>
                  <UploadIcon />
                  <Text>Upload the back side of your Aadhaar card</Text>
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
                  <Text color="white">Upload Again</Text>
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
                <Text color="white">Upload Again</Text>
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
              <Text color="white">Continue</Text>
            </Button>
          </>
        ) : (
          <>
            <p className="boxMessage3">
              <CheckIcon fontSize="medium" />
              <span>Aadhaar Card Uploaded</span>
            </p>

            <div className="front__image">
              <h4>Front View</h4>

              <img src={image.front} alt="front image" />
            </div>

            <div className="back__image">
              <h4>Back View</h4>

              <img src={image.back} alt="back image" />
            </div>

            <Button
              variant="secondary"
              bg={"gray.500"}
              py="12px"
              px="20px"
              mt="10"
            >
              <Text color="white">Continue</Text>
            </Button>
          </>
        )}
      </div>

      {modal ? (
        <div className="uploadModal">
          <div className="modal__container">
            <div className="upload__options">
              <button
                onClick={() => {
                  setCameraUrl();
                  setCameraModal(true);
                }}
              >
                Take a Photo
              </button>

              <label htmlFor="galleryUpload">Upload from gallery</label>
              <input
                type="file"
                id="galleryUpload"
                style={{
                  display: "none",
                }}
                onChange={handleFileInputChange}
              />

              <label htmlFor="fileUpload">Upload a file</label>
              <input
                type="file"
                id="fileUpload"
                style={{
                  display: "none",
                }}
                onChange={handleFileInputChange}
              />
            </div>

            <button
              className="btn-cancel"
              onClick={() => {
                setModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}