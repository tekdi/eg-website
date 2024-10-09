import { t } from "i18next";
import { Avatar, Button, Image, Box, Modal, HStack, Center } from "native-base";
import React, { useEffect, useState } from "react";
import { IconByName, useWindowSize } from "@shiksha/common-lib";
import { base64toBlob, getFileTypeFromBase64 } from "v2/utils/Helper/JSHelper";
import PropTypes from "prop-types";

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
      }
    }
    fetchData();
  }, [base64]);

  const getFilePreview = () => {
    if (type === "pdf" || isIframeTag) {
      return (
        <iframe
          style={{ border: "none", borderColor: "none" }}
          src={data?.fileUrl}
          title={data?.fileUrl}
          loading="lazy"
          {...{ width: props?.width, height: props?.height }}
        />
      );
    } else if (isImageTag) {
      return (
        <img
          alt="Image_not_found"
          width={"300px"}
          height={"300px"}
          {...props}
          src={base64}
        />
      );
    } else {
      return (
        <Avatar
          alt="Image not found"
          {...(!props?.size ? { width: "30px", height: "30px" } : {})}
          {...props}
          source={{
            ...source,
            uri: data?.fileUrl,
          }}
        />
      );
    }
  };

  let filePreview = null;
  if (data?.fileUrl) {
    filePreview = getFilePreview();
  }

  const buttonOrText = data?.fileUrl ? (
    <Button
      variant={"link"}
      onPress={(e) => setModalUrl(data?.fileUrl)}
      {..._button}
    >
      {text}
    </Button>
  ) : (
    t("NA")
  );

  const getImageOrPdfPreview = () => {
    if (type.includes("image")) {
      return (
        <img
          alt="Image_not_found"
          style={{ borderRadius: borderRadius }}
          {...props}
          src={base64}
        />
      );
    } else if (type.includes("application/pdf")) {
      return (
        <iframe
          src={pdf}
          width="100%"
          height="500px"
          title="PDF Preview"
        ></iframe>
      );
    } else {
      return t("NA");
    }
  };

  return (
    <Box {..._box}>
      {base64 && getImageOrPdfPreview()}

      {!text ? filePreview : buttonOrText}

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

FilePreview.propTypes = {
  base64: PropTypes.string,
  source: PropTypes.string,
  borderRadius: PropTypes.number,
  text: PropTypes.string,
  isImageTag: PropTypes.bool,
  isIframeTag: PropTypes.bool,
  urlObject: PropTypes.object,
  _box: PropTypes.object,
  _button: PropTypes.object,
  width: PropTypes.any,
  height: PropTypes.any,
  size: PropTypes.any,
};
