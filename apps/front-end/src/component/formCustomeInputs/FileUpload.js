import {
  FrontEndTypo,
  IconByName,
  ImageView,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { Box, HStack, Pressable, Progress, Spinner, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";

const FileUpload = ({ value, onChange, schema }) => {
  const {
    label,
    title,
    uploadTitle,
    userId,
    document_type,
    document_sub_type,
    iconComponent,
    width,
    height,
  } = schema || {};

  const uplodInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [errors, setErrors] = React.useState({});
  const [file, setFile] = React.useState();
  const { t } = useTranslation();
  const uploadProfile = async (file) => {
    setLoading(true);
    setProgress(0);
    const form_data = new FormData();
    const item = {
      file,
      document_type,
      document_sub_type: document_sub_type || "",
      user_id: userId || localStorage.getItem("id"), // localStorage id of the logged-in user
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const result = await uploadRegistryService.uploadFile(
      form_data,
      {},
      (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setProgress(percent);
      }
    );
    setLoading(false);
    const document_id = result?.data?.insert_documents?.returning?.[0]?.id;
    onChange(document_id);
    setFile(document_id);
  };

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file["type"] === "application/pdf") {
      uploadProfile(file);
    } else if (file && file.size <= 1048576 * 10) {
      if (file instanceof File) {
        const maxWidthOrHeight = Math.max(width || 1280, height || 740);
        const compressedImage = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight,
          useWebWorker: true,
        });

        const uploadFile = new File([compressedImage], file.name, {
          type: file.type,
        });

        uploadProfile(uploadFile);
      } else {
        setErrors({ fileSize: t("FILE_SIZE") });
      }
    }
  };

  React.useEffect(() => {
    setFile(value);
  }, [value]);

  return (
    <VStack space={2}>
      {loading ? (
        <VStack
          space={4}
          borderWidth="1"
          borderStyle="dotted"
          borderColor="textGreyColor.50"
          minH="200px"
          justifyContent="center"
          p="4"
        >
          <Spinner
            color={"primary.500"}
            accessibilityLabel="Loading posts"
            size="lg"
          />
          <Progress value={progress} />
          <FrontEndTypo.H3 textAlign="center">{progress}%</FrontEndTypo.H3>
        </VStack>
      ) : (
        <Box
          gap="5"
          borderWidth="1"
          borderStyle="dotted"
          borderColor="textGreyColor.50"
          minH="200px"
          justifyContent="center"
          p="2"
          borderRadius="5"
        >
          <input
            accept="image/*,application/pdf"
            type="file"
            style={{ display: "none" }}
            ref={uplodInputRef}
            onChange={handleFileInputChange}
          />
          <Box alignItems="center">
            {file ? (
              <ImageView
                source={{
                  document_id: file,
                }}
                alt={`Alternate ${t(label)}`}
                width={"190px"}
                height={"190px"}
                borderRadius="0"
                _image={{ borderRadius: 0 }}
              />
            ) : (
              iconComponent || (
                <IconByName
                  color="gray.500"
                  name="FileTextLineIcon"
                  _icon={{ size: "150" }}
                  isDisabled
                />
              )
            )}
          </Box>
          <Pressable
            flex="1"
            onPress={(e) => {
              uplodInputRef?.current?.click();
            }}
            alignItems="center"
            p="2"
            bg="gray.200"
            shadow={2}
          >
            <HStack alignItems="center" space="2">
              <IconByName name="Upload2FillIcon" isDisabled color="gray.800" />
              <FrontEndTypo.H2 textAlign="center" color="gray.800">
                {t(uploadTitle ? uploadTitle : label ? label : title)}
              </FrontEndTypo.H2>
            </HStack>
          </Pressable>
        </Box>
      )}
      {errors?.fileSize && (
        <FrontEndTypo.H2 color="red.400">{errors?.fileSize}</FrontEndTypo.H2>
      )}
    </VStack>
  );
};

export default FileUpload;
