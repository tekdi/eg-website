import React from "react";
import WestIcon from "@mui/icons-material/West";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, FormControl, HStack, Input, Text } from "native-base";
import { useNavigate } from "react-router-dom";
import { FrontEndTypo, t, Layout } from "@shiksha/common-lib";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

export default function AdharOTP() {
  const navigate = useNavigate();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const [data, setData] = React.useState({
    otpNumber: "",
    securityCode: "",
  });
  const [otpFailedPopup, setOtpFailedPopup] = React.useState(
    localStorage.getItem("aadhaarNumber") ? false : true
  );
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
      });
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
    >
      <Box borderBottomWidth="2" borderColor="gray.400">
        <Button
          variant="ghost"
          display="flex"
          justifyContent="flex-start"
          onPress={() => navigate(-1)}
        >
          <WestIcon />
        </Button>
      </Box>

      <Box px="4">
        <FrontEndTypo.H1 bold mt="4" color="textMaroonColor.400">
          {t("OFFLINE_AADHAAR_VERIFICATION")}
          (OKYC)
        </FrontEndTypo.H1>

        <Box mt="6">
          <FormControl.Label htmlFor="aadhaarNumber" mb="2">
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">
              {t("ENTER_6_DIGIT_OTP")}
            </Text>
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
          <FormControl.Label
            mb="2"
            display="flex"
            flexDirection="column"
            htmlFor="securityCode"
          >
            <FrontEndTypo.H3 color="textMaroonColor.400" bold mt="5">
              {t("ENTER_SECURITY_CODE")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4 color="gray.500">
              {t(
                "SET_A_4_DIGIT_PASSCODE_TO_SECURELY_SHARE_YOUR_AADHAAR_ZIP_FILE"
              )}
            </FrontEndTypo.H4>
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

        <FrontEndTypo.Secondarybutton
          bg={!data.otpNumber || !data.securityCode ? "gray.300" : "gray.500"}
          py="12px"
          px="20px"
          mt={20}
          disabled={!data.otpNumber || !data.securityCode}
          onPress={handleSubmit}
          // onPress={setIsOpen(true)}
        >
          <Text color="white">{t("CONTINUE")}</Text>
        </FrontEndTypo.Secondarybutton>
        {/* <FrontEndTypo.Primarybutton   onPress={() => { setIsOpen(true)
                }}>ekta</FrontEndTypo.Primarybutton> */}
      </Box>
      {/* <Drawer
         open={isOpen}
         onClose={toggleDrawer}
         direction="bottom"
         size="330px"
        
       >ekta
                      </Drawer> */}

      {otpFailedPopup ? (
        <Box
          position="absolute"
          w="full"
          h="100vh"
          bg="black:alpha.30"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Box
            position="relative"
            w="full"
            p="5"
            pb="12"
            bg="white"
            roundedTop="xl"
          >
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

            <FrontEndTypo.H1 color="textGreyColor.800" my="3">
              {t("AADHAR_KYC_VERIFICATION_FAILED")}
            </FrontEndTypo.H1>
            <FrontEndTypo.Secondarybutton
              mb="5"
              onPress={() => {
                navigate("/admin/aadhaarNumber");
              }}
            >
              {t("RETRY_AADHAR_NUMER_KYC")}
            </FrontEndTypo.Secondarybutton>

            <FrontEndTypo.Primarybutton
              onPress={() => {
                navigate(-1);
              }}
            >
              {t("GO_BACK")}
            </FrontEndTypo.Primarybutton>

            <HStack alignItems="center" my="3" color="red.600">
              <ErrorOutlineIcon fontSize="small" />
              <FrontEndTypo.H4 pl="2" color="red.600">
                {t("MOBILE_NUMBER_IS_NOT_LINKED_TO_AADHAAR_CARD")}
              </FrontEndTypo.H4>
            </HStack>
          </Box>
        </Box>
      ) : null}
    </Layout>
  );
}
