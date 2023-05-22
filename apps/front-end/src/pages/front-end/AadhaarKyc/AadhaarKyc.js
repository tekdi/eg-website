import React from "react";
import WestIcon from "@mui/icons-material/West";
import "./AadhaarKyc.css";
import { Checkbox} from "@mui/material";
import { Button, Input, Text } from "native-base";
import { useNavigate } from "react-router-dom";

export default function AdharKyc() {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    aadhaarNumber: "",
    securityCode: "",
    checkMark: false,
  });
  const [kycReqID, setKycReqID] = React.useState("");
  const [captchaImg, setCaptchaImg] = React.useState("");

  React.useEffect(() => {
    const headers = {
      "x-client-id": "401c3159-bbfe-438d-a62c-eb4ff8bb8c10",
      "x-client-secret": "b066a8b1-c3f9-432d-ae74-79489047ec87",
    };

    const getCaptcha = (id) => {
      const url2 = `https://dg-sandbox.setu.co/api/okyc/${id}/initiate/`;
      const options = {
        method: "GET",
        headers: headers,
      };

      fetch(url2, options)
        .then((res) => res.json())
        .then((res) => {
          console.log("captcha Image res -> ", res);

          if (res.captchaImage) {
            setCaptchaImg(res.captchaImage);
          }
        })
        .catch((err) => console.log(err))
       
    };

    const url1 = "https://dg-sandbox.setu.co/api/okyc/";

    fetch(url1, {
      method: "POST",
      headers: headers,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("create okyc req -> ", res);

        if (res.id) {
          getCaptcha(res.id);
          setKycReqID(res.id);
          localStorage.setItem("KYCreqID", res.id);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const sendData = () => {
    // setLoading2(true);

    const url = `https://dg-sandbox.setu.co/api/okyc/${kycReqID}/verify`;

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": "401c3159-bbfe-438d-a62c-eb4ff8bb8c10",
      "x-client-secret": "b066a8b1-c3f9-432d-ae74-79489047ec87",
    };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        aadhaarNumber: data.aadhaarNumber,
        captchaCode: data.securityCode,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("submit adhar res -> ", res);

        if (res.code === "otp_sent") {
          localStorage.setItem("aadhaarNumber", data.aadhaarNumber);
          navigate("/AdharOTP");
        } else {
          alert(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        // setLoading2(false);
      });
  };

  return (
    <div className="adharVerify1">
      <div className="topbar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <WestIcon />
        </button>
      </div>

      <div className="content">
        <h2>
          Offline Aadhaar Verification
          <br />
          (OKYC)
        </h2>

        <div className="aadhaarNumber__input">
          <label htmlFor="aadhaarNumber">Enter Your Aadhaar Number</label>

          <Input
            id="aadhaarNumber"
            name="aadhaarNumber"
            placeholder="0000 0000 0000"
            p="4"
            maxWidth={480}
            borderRadius={8}
            borderColor={"rgba(0, 0, 0, 0.5)"}
            onChange={(e) => {
              setData({ ...data, aadhaarNumber: e.target?.value });
            }}
          />
        </div>

        <div className="securityCode__input">
          <label htmlFor="securityCode">
            <span>Enter Security Code</span>
            <span>Type the characters you see in the picture</span>
          </label>
          <img
            src={`data:image/jpeg;charset=utf-8;base64,${captchaImg}`}
            alt="captcha image"
          />
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

        <p className="boxMessage">
          We will send you an OTP to the mobile number linked with your Aadhaar
        </p>

        <ul>
          <li>
            I agree to download my Aadhaar XML file from the UIDAI Website to
            complete Aadhaar offline verification with smallcase.{" "}
          </li>

          <li>
            I understand that my Aadhaar details shall not be used or stored for
            any other purpose.
          </li>
        </ul>

        <label htmlFor="checkMark">
          <Checkbox
            id="checkMark"
            name="checkMark"
            size="small"
            onChange={(e) => {
              setData({ ...data, checkMark: e.target.checked });
            }}
          />{" "}
          I have read and understood all of the points above
        </label>

        <Button
          variant="secondary"
          bg={
            !data.aadhaarNumber || !data.securityCode || !data.checkMark
              ? "gray.300"
              : "gray.500"
          }
          py="12px"
          px="20px"
          disabled={
            !data.aadhaarNumber || !data.securityCode || !data.checkMark
          }
          onPress={sendData}
        >
          <Text color="white">Continue</Text>
        </Button>
      </div>
    </div>
  );
}