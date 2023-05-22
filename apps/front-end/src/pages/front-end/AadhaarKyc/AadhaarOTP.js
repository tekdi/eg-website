import React from "react";
import WestIcon from "@mui/icons-material/West";
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

    fetch(process.env.AADHAR_URL3, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": "401c3159-bbfe-438d-a62c-eb4ff8bb8c10",
        "x-client-secret": "b066a8b1-c3f9-432d-ae74-79489047ec87",
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
    </div>
  );
}