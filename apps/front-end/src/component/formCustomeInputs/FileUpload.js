import {
  FrontEndTypo,
  IconByName,
  ImageView,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { Box, Image, Pressable, Spinner, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

const FileUpload = ({ options, value, onChange, required, schema }) => {
  const { label, title, userId, document_type } = schema ? schema : {};
  const uplodInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [file, setFile] = React.useState();
  const { t } = useTranslation();
  const uploadProfile = async (file) => {
    setLoading(true);
    const form_data = new FormData();
    const item = {
      file,
      document_type,
      user_id: userId,
    };
    for (let key in item) {
      form_data.append(key, item[key]);
    }
    const result = await uploadRegistryService.uploadFile(form_data);
    setLoading(false);
    const document_id = result?.data?.insert_documents?.returning?.[0]?.id;
    onChange(document_id);
    setFile(document_id);
  };

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 25) {
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
      <VStack
        justifyContent="center"
        borderWidth="1"
        borderStyle="dotted"
        borderColor="textGreyColor.50"
        alignItems="center"
        minH="200px"
      >
        {loading ? (
          <Spinner
            color={"primary.500"}
            accessibilityLabel="Loading posts"
            size="lg"
          />
        ) : (
          <Box>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            <Pressable
              onPress={(e) => {
                uplodInputRef?.current?.click();
              }}
              alignItems="center"
              gap="5"
            >
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
              ) : (
                <IconByName name="Upload2FillIcon" isDisabled />
              )}
              <FrontEndTypo.H2>{t(label ? label : title)}</FrontEndTypo.H2>
            </Pressable>
          </Box>
        )}
      </VStack>
      {errors?.fileSize && <H2 color="red.400">{errors?.fileSize}</H2>}
    </VStack>
  );
};

export default FileUpload;
