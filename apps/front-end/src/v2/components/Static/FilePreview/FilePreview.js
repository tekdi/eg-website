import { t } from "i18next";
import { Avatar, Button, Image, Box, Modal, HStack, Center } from "native-base";
import React, { useEffect, useState } from "react";
import { IconByName, useWindowSize } from "@shiksha/common-lib";
import { base64toBlob, getFileTypeFromBase64 } from "v2/utils/Helper/JSHelper";

export default function FilePreview({
  base64,
  source,
  borderRadius,
  text,
  isImageTag,
  isIframeTag,
  urlObject,
  _box,
  _button,
  ...props
}) {
  const [data, setData] = useState();
  const [pdf, setPdf] = useState();
  const [modalUrl, setModalUrl] = useState();
  const [type, setType] = useState("");
  const [width, height] = useWindowSize();

  const downloadImage = () => {
    const FileSaver = require("file-saver");
    FileSaver.saveAs(`${modalUrl}`);
  };

  useEffect(() => {
    async function fetchData() {
      if (base64) {
        let temp_type = await getFileTypeFromBase64(base64);
        setType(temp_type);
        const pdfBlob = await base64toBlob(base64);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdf(pdfUrl);
        //console.log("type", temp_type);
      }
    }
    fetchData();
  }, [base64]);

  return (
    <Box {..._box}>
      {base64 &&
        (type.includes("image") ? (
          <img
            alt="Image not found"
            style={{ borderRadius: borderRadius }}
            {...props}
            src={base64}
          />
        ) : type.includes("application/pdf") ? (
          <iframe
            src={pdf}
            width="100%"
            height="500px"
            title="PDF Preview"
          ></iframe>
        ) : (
          t("NA")
        ))}

      {!text ? (
        !data?.fileUrl ? (
          <React.Fragment />
        ) : type === "pdf" || isIframeTag ? (
          <iframe
            style={{ border: "none" }}
            frameBorder="0"
            src={data?.fileUrl}
            title={data?.fileUrl}
            loading="lazy"
            {...{ width: props?.width, height: props?.height }}
          />
        ) : isImageTag ? (
          <img
            alt="Image not found"
            width={"300px"}
            height={"300px"}
            {...props}
            src={base64}
          />
        ) : (
          <Avatar
            alt="Image not found"
            {...(!props?.size ? { width: "30px", height: "30px" } : {})}
            {...props}
            source={{
              ...source,
              uri: data?.fileUrl,
            }}
          />
        )
      ) : data?.fileUrl ? (
        <Button
          variant={"link"}
          onPress={(e) => setModalUrl(data?.fileUrl)}
          {..._button}
        >
          {text}
        </Button>
      ) : (
        t("NA")
      )}

      <Modal isOpen={modalUrl} onClose={() => setModalUrl()}>
        <Modal.Content {...{ width }} maxWidth={"80%"}>
          <Modal.CloseButton />
          <Modal.Body padding={"30px"}>
            <HStack space={3} justifyContent="center">
              <Center>
                <Button
                  rightIcon={<IconByName name="DownloadLineIcon" />}
                  variant={"outline"}
                  onPress={downloadImage}
                  marginBottom={"20px"}
                  borderRadius={"100px"}
                  p="4"
                  height={"40px"}
                >
                  {t("DOWNLOAD")}
                </Button>
              </Center>
            </HStack>
            <div id="modalContent">
              {type === "pdf" ? (
                <iframe
                  src={modalUrl}
                  title={modalUrl}
                  {...{ width, height }}
                />
              ) : (
                <Image
                  alt="Image not found"
                  {...{ width, height }}
                  {...props}
                  source={{
                    ...source,
                    uri: modalUrl,
                  }}
                />
              )}
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
