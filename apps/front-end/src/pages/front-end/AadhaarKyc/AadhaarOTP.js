import React from "react";
import WestIcon from "@mui/icons-material/West";
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, FormControl, Input, Text } from "native-base";
import { useNavigate } from "react-router-dom";
import { t } from "@shiksha/common-lib";

export default function AdharOTP() {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    otpNumber: "",
    securityCode: "",
  });
  const [otpFailedPopup, setOtpFailedPopup] = React.useState(localStorage.getItem("aadhaarNumber") ? false : true);
    const handleSubmit = () => {
    const kycReqID = localStorage.getItem("KYCreqID") || "";
    const aadhaarNumber = localStorage.getItem("aadhaarNumber") || "";

    if (!kycReqID || !aadhaarNumber || !data.otpNumber || !data.securityCode) {
      alert("All Fields are required");
      return;
    }

    const bodyData = {
      otp: data.otpNumber,
      shareCode: data.securityCode,
      aadhaarNumber,
    };
    const url = `${process.env.REACT_APP_AADHAAR_URL}/${kycReqID}/complete/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.REACT_APP_AADHAAR_CLIENT_ID,
        "x-client-secret": process.env.REACT_APP_AADHAAR_CLIENT_SECRET,
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("complete kyc res -> ", res);

        if (res.status === "complete") {
          localStorage.removeItem("KYCreqID");
          localStorage.removeItem("aadhaarNumber");
          navigate("/admin/aadhaarSuccess");
        } else {
          alert(res.status);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      
  };

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

        <Box mt="6">
          <FormControl.Label htmlFor="aadhaarNumber" mb="2">
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">{t("ENTER_6_DIGIT_OTP")}</Text>
          </FormControl.Label>

          <Input
            id="otpNumber"
            name="otpNumber"
            placeholder="000000"
            p="4"
            textAlign={"center"}
            fontSize={18}
            maxWidth={120}
            borderRadius={8}
            borderColor="gray.500"
            onChange={(e) => {
              setData({ ...data, otpNumber: e.target?.value });
            }}
          />
        </Box>

        <Box mt="6">
          <FormControl.Label mb="2" display="flex" flexDirection="column" htmlFor="securityCode">
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">{t("ENTER_SECURITY_CODE")}</Text>
            <Text fontSize="sm" fontWeight="medium" color="gray.500" mt="0.5">
              {t("SET_A_4_DIGIT_PASSCODE_TO_SECURELY_SHARE_YOUR_AADHAAR_ZIP_FILE")}
            </Text>
          </FormControl.Label>

          <Input
            id="securityCode"
            name="securityCode"
            placeholder="6YE3ZH"
            p="4"
            fontSize={18}
            maxWidth={120}
            borderRadius={8}
            borderColor={"rgba(0, 0, 0, 0.5)"}
            onChange={(e) => {
              setData({ ...data, securityCode: e.target?.value });
            }}
          />
        </Box>

        <Button
          variant="secondary"
          bg={!data.otpNumber || !data.securityCode ? "gray.300" : "gray.500"}
          py="12px"
          px="20px"
          mt={20}
          disabled={!data.otpNumber || !data.securityCode}
          onPress={handleSubmit}
        >
          <Text color="white">{t("CONTINUE")}</Text>
        </Button>
      </Box>

      {
        otpFailedPopup ? (
          <Box position="absolute" w="full" h="100vh" bg="black:alpha.30" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-end">
            <Box position="relative" w="full" p="5" pb="12" bg="white" roundedTop="xl">
              <Button
                variant="ghost"
                position="absolute"
                top="3"
                right="2"
                onPress={() => {
                  setOtpFailedPopup(false);
                }}
              >
                <CloseIcon />
              </Button>

              <Text fontSize="lg" fontWeight="medium">Aadhaar KYC Verification Failed</Text>

              <Button
                variant={"solid"}
                py="3.5"
                rounded={"full"}
                bg={"#2D142C"}
                mt="8"
                mb="5"
                onPress={() => {
                  navigate(-1);
                }}
              >
                <Text fontSize={"lg"} color="white" fontWeight={"semibold"}>Go Back</Text>
              </Button>

              <Button
                variant={"outline"}
                py="3"
                rounded={"full"}
                borderColor={"#2D142C"}
                onPress={() => {
                  navigate('/admin/aadhaarNumber')
                }}
              >
                <Text fontSize={"lg"} color="#2D142C" fontWeight={"bold"}>Retry Aadhaar Number KYC</Text>
              </Button>
              
              <Text
                color="red.600"
                display="flex"
                alignItems="center"
                gap="1"
                mt="2"
              >
                <ErrorOutlineIcon fontSize="small" />
                <Text fontSize="13px">Mobile Number is not linked to Aadhaar Card</Text>
              </Text>
            </Box>
          </Box>
        ) : null
      }
    </Box>
  );
}