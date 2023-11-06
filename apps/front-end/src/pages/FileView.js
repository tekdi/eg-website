import {
  IconByName,
  ImageView,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";
import { useParams } from "react-router-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function FileView() {
  const { id } = useParams();
  const [receiptUrl, setReceiptUrl] = React.useState();
  const [fileType, setFileType] = React.useState();
  const [height, setHeight] = React.useState(0);
  const con = React.useRef();

  const downloadImage = () => {
    const FileSaver = require("file-saver");
    FileSaver.saveAs(`${receiptUrl?.fileUrl}`);
  };

  React.useEffect(async () => {
    const newResult = await uploadRegistryService.getOne({
      document_id: id,
    });
    setReceiptUrl(newResult);
    setFileType(newResult?.key?.split(".").pop());
    const dataH =
      window.innerHeight > window.outerHeight
        ? window.outerHeight
        : window.innerHeight;
    const hData = dataH - (con?.current?.clientHeight + 10);
    setHeight(hData);
  }, [id]);

  return (
    <VStack>
      {fileType === "pdf" ? (
        <ImageView
          frameborder="0"
          _box={{ flex: 1 }}
          height="100%"
          width="100%"
          urlObject={receiptUrl}
          alt="aadhaar_front"
        />
      ) : (
        fileType && (
          <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <VStack>
                <HStack
                  space="2"
                  justifyContent="center"
                  alignItems="center"
                  p="3"
                  ref={con}
                >
                  <IconByName
                    p="0"
                    color="light.400"
                    rounded="full"
                    _icon={{ size: "30" }}
                    name="AddCircleLineIcon"
                    onPress={(e) => zoomIn()}
                  />
                  <IconByName
                    p="0"
                    color="light.400"
                    rounded="full"
                    _icon={{ size: "30" }}
                    name="IndeterminateCircleLineIcon"
                    onPress={(e) => zoomOut()}
                  />
                  <IconByName
                    p="0"
                    color="light.400"
                    rounded="full"
                    _icon={{ size: "30" }}
                    name="RefreshLineIcon"
                    onPress={(e) => resetTransform()}
                  />
                  <HStack p="1.5px">
                    <IconByName
                      p="2px"
                      color="light.400"
                      borderWidth="2"
                      rounded="full"
                      _icon={{ size: "19" }}
                      name="DownloadLineIcon"
                      onPress={downloadImage}
                    />
                  </HStack>
                </HStack>
                <VStack
                  justifyContent="center"
                  alignItems="center"
                  borderWidth="1px"
                  borderColor="light.400"
                >
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height,
                    }}
                  >
                    <VStack
                      justifyContent="center"
                      alignItems="center"
                      rounded="sm"
                      borderWidth="1px"
                      borderColor="light.100"
                      {...{
                        width: "100%",
                        height,
                      }}
                    >
                      <ImageView
                        isImageTag
                        _box={{
                          width: "100%",
                          height: "100%",
                        }}
                        {...{
                          width: "100%",
                          height: "100%",
                        }}
                        style={{
                          filter: "none",
                          objectFit: "contain",
                        }}
                        urlObject={receiptUrl}
                        alt="aadhaar_front"
                      />
                    </VStack>
                  </TransformComponent>
                </VStack>
              </VStack>
            )}
          </TransformWrapper>
        )
      )}
    </VStack>
  );
}
