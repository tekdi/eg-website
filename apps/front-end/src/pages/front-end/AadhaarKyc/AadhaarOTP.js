import React from "react";
import WestIcon from "@mui/icons-material/West";
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Input, Text } from "native-base";
import "./AadhaarKyc.css";
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

    // const url = `https://dg-sandbox.setu.co/api/okyc/${kycReqID}/complete/`;
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
          navigate("/AdharSuccess");
        } else {
          alert(res.status);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      
  };

  return (
    <div className="adharVerify2">
      <div className="topbar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <WestIcon />
        </button>
      </div>

      <div className="content">
        <h2>
          {t("OFFLINE_AADHAAR_VERIFICATION")}
          <br />
          (OKYC)
        </h2>

        <div className="aadhaarNumber__input" style={{ marginTop: "40px" }}>
          <label htmlFor="otpNumber">{t("ENTER_6_DIGIT_OTP")}</label>

          <Input
            id="otpNumber"
            name="otpNumber"
            placeholder="000000"
            p="4"
            textAlign={"center"}
            maxWidth={120}
            borderRadius={8}
            borderColor={"rgba(0, 0, 0, 0.5)"}
            onChange={(e) => {
              setData({ ...data, otpNumber: e.target?.value });
            }}
          />
        </div>

        <div className="securityCode__input" style={{ marginTop: "30px" }}>
          <label htmlFor="securityCode">
            <span>{t("ENTER_SECURITY_CODE")}</span>
            <span>
              {t("SET_A_4_DIGIT_PASSCODE_TO_SECURELY_SHARE_YOUR_AADHAAR_ZIP_FILE")}
            </span>
          </label>

          <Input
            id="securityCode"
            name="securityCode"
            placeholder="6YE3ZH"
            p="4"
            maxWidth={120}
            borderRadius={8}
            borderColor={"rgba(0, 0, 0, 0.5)"}
            onChange={(e) => {
              setData({ ...data, securityCode: e.target?.value });
            }}
          />
        </div>

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
      </div>

      {
        otpFailedPopup ? (
          <div className="otp_failed_popup">
            <div className="container">
              <button className="btn-close"
                onClick={() => {
                  setOtpFailedPopup(false);
                }}
              >
                <CloseIcon />
              </button>

              <p>Aadhaar KYC Verification Failed</p>

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
                  navigate('/aadhaarNumber')
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
                <span style={{ fontSize: "13px" }}>Mobile Number is not linked to Aadhaar Card</span>
              </Text>
            </div>
          </div>
        ) : null
      }
    </div>
  );
}