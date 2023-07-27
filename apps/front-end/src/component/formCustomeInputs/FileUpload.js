import {
  FrontEndTypo,
  IconByName,
  ImageView,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { Box, Pressable, Progress, Spinner, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

const FileUpload = ({ options, value, onChange, required, schema }) => {
  const { label, title, uploadTitle, userId, document_type, iconComponent } =
    schema ? schema : {};
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
      user_id: userId,
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
    if (file.size <= 1048576 * 10) {
      uploadProfile(file);
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
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
        <Pressable
          onPress={(e) => {
            uplodInputRef?.current?.click();
          }}
          alignItems="center"
          gap="5"
          borderWidth="1"
          borderStyle="dotted"
          borderColor="textGreyColor.50"
          minH="200px"
          justifyContent="center"
          p="2"
          borderRadius="5"
        >
          <Box alignItems="center">
            <input
              accept="image/*,application/pdf"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />

            {file ? (
              <ImageView
                source={{
                  document_id: file,
                }}
                alt={`Alternate ${t(label)}`}
                width={"190px"}
                height={"190px"}
                borderRadius="0"
              />
            ) : iconComponent ? (
              iconComponent
            ) : (
              <IconByName name="Upload2FillIcon" isDisabled />
            )}
            <FrontEndTypo.H2 textAlign="center">
              {t(uploadTitle ? uploadTitle : label ? label : title)}
            </FrontEndTypo.H2>
          </Box>
        </Pressable>
      )}
      {errors?.fileSize && (
        <FrontEndTypo.H2 color="red.400">{errors?.fileSize}</FrontEndTypo.H2>
      )}
    </VStack>
  );
};

export default FileUpload;
