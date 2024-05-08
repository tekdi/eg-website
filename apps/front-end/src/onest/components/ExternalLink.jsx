import { FrontEndTypo } from "@shiksha/common-lib";
import { Box, Center, Text, Button, Stack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

const ExternalLink = ({ url }) => {
  const { t } = useTranslation();

  console.log("Url", url);
  return (
    <Center>
      <Box>
        <Text>
          Explore this content from an external website. Choose how you'd like
          to view it:
        </Text>
        <iframe
          src={url}
          title="External Website"
          style={{
            width: "100%",
            height: "500px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        ></iframe>
        <Stack direction="row" justifyContent="center" marginTop="10px">
          <FrontEndTypo.Primarybutton
            size="md"
            className="custom-button"
            style={{ width: "150px" }}
            onPress={() => window.open(url, "_blank")}
          >
            Open in New Tab
          </FrontEndTypo.Primarybutton>
        </Stack>
      </Box>
    </Center>
  );
};

export default ExternalLink;
