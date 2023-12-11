import React, { useState } from "react";
import { Box, Button, Center, HStack, VStack } from "native-base";
import Upload from "./Upload";

export default function ImageOptimize() {
  const [showUpload, setShowUpload] = useState(false);

  const captureImage = () => {
    console.log("The button is clicked");
    setShowUpload(true);
  };

  // Props to be passed to the Upload component
  const uploadProps = {
    constraints : "fileUpload",
    size  : "pixel",
    quality : "quality",
    height: 480,
    width: 640
    
  };

  return (
    <React.Fragment>
      <Center>
        {showUpload ? ( 
          <Upload {...uploadProps} />
        ) : (
          <Button onPress={captureImage}>Capture</Button>
        )}
      </Center>
    </React.Fragment>
  );
}
