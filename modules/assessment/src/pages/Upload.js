import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Loading } from "@shiksha/common-lib"; // Import your Loading component

const CameraFileUploadComponent = ({ constraints, height, width }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Automatically open file input when the component mounts
    if (constraints === "fileUpload") {
      fileInputRef.current.click();
    }
  }, [constraints]);

  const onCapture = async () => {
    try {
      setLoading(true); // Set loading to true when capturing starts

      const capturedImageBase64 = webcamRef.current.getScreenshot();
      const capturedImageBlob = await fetch(capturedImageBase64).then((res) =>
        res.blob()
      );

      if (capturedImageBlob instanceof Blob) {
        const compressedImage = await imageCompression(capturedImageBlob, {
          maxSizeMB: 1,
          maxWidthOrHeight: Math.max(width, height),
          useWebWorker: true,
        });

        setImage(URL.createObjectURL(compressedImage));
        sendToBackend(compressedImage);
      } else {
        console.error("Invalid image format");
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFileUpload = async (acceptedFiles) => {
    const uploadedImage = acceptedFiles[0];

    if (uploadedImage instanceof File) {
      try {
        setLoading(true);

        const compressedImage = await imageCompression(uploadedImage, {
          maxSizeMB: 1,
          maxWidthOrHeight: Math.max(width, height),
          useWebWorker: true,
        });

        setImage(URL.createObjectURL(compressedImage));
        sendToBackend(compressedImage);
      } catch (error) {
        console.error("Error compressing image:", error);
      } finally {
        setLoading(false); 
      }
    } else {
      console.error("Invalid file format");
    }
  };

  const sendToBackend = (imageData) => {
    console.log("Sending image to backend:", imageData);
  };


  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: onFileUpload,
  });

  const handleCameraPermission = () => {
    if (window.confirm("Please give permission to access your camera?")) {
      window.location.reload();
    } else {
      console.log("Camera permission denied");
    }
  };

  return (
    <div>
      {loading && <Loading />} 
      {constraints === "camera" && (
        <div>
          <Webcam
            audio={false}
            height={height}
            width={width}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            onUserMediaError={({ message }) => {
              if (message === "Permission denied") {
                handleCameraPermission();
              } else {
                console.error("Error accessing camera:", message);
              }
            }}
          />
          <button onClick={onCapture}>Capture</button>
        </div>
      )}
      {constraints === "fileUpload" && (
        <div {...getRootProps()}>
          <input {...getInputProps()} ref={fileInputRef} style={{ display: "none" }} />
          <p onClick={() => fileInputRef.current.click()}>Click to select one</p>
        </div>
      )}
      {constraints === "both" && (
        <div>
          <Webcam
            audio={false}
            height={height}
            width={width}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            onUserMediaError={({ message }) => {
              if (message === "Permission denied") {
                handleCameraPermission();
              } else {
                console.error("Error accessing camera:", message);
              }
            }}
          />
          <button onClick={onCapture}>Capture</button>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select one</p>
          </div>
        </div>
      )}
      {image && <img src={image} alt="Captured/Uploaded" />}
    </div>
  );
};

export default CameraFileUploadComponent;

