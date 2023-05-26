import React from "react";
import WestIcon from "@mui/icons-material/West";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { Box, Button, Text } from "native-base";
import { t } from "@shiksha/common-lib";

export default function AdharSuccess() {

  const navigate = useNavigate();

  return (
    <Box>
      <Box borderBottomWidth="2" borderColor="gray.400">
        <Button variant="ghost" display="flex" justifyContent="flex-start" onPress={() => navigate(-1)}>
          <WestIcon />
        </Button>
      </Box>

      <Box px="4">
        <Text fontSize="2xl" fontWeight="600" mt="4">
          {t("OFFLINE_AADHAAR_VERIFICATION")}
          <br />
          (OKYC)
        </Text>

        <Box display="flex" flexDirection="row" alignItems="center" gap="2" mt="6" color="gray.500" p="2" borderWidth="2" borderColor="gray.500" rounded="md">
          <CheckIcon fontSize="small" />
          <Text fontSize="sm" fontWeight="semibold">{t("YOUR_AADHAAR_VERIFICATION_IS_SUCCESSFUL")}</Text>
        </Box>

        <Button variant="secondary" bg={"gray.500"} py="12px" px="20px" mt={20}>
          <Text color="white">{t("CONTINUE_LOGIN")}</Text>
        </Button>
      </Box>
    </Box>
  );
}