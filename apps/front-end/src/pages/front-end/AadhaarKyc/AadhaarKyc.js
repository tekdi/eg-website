import React from "react";
import WestIcon from "@mui/icons-material/West";
import "./AadhaarKyc.css";
import { Checkbox } from "@mui/material";
import { Button, Input, Text } from "native-base";
import { useNavigate } from "react-router-dom";
import { t } from "@shiksha/common-lib";

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
      "x-client-id": process.env.REACT_APP_AADHAAR_CLIENT_ID,
      "x-client-secret": process.env.REACT_APP_AADHAAR_CLIENT_SECRET,
    };

    const getCaptcha = (id) => {
      const url2 = `${process.env.REACT_APP_AADHAAR_URL}/${id}/initiate/`;
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
        .catch((err) => console.log(err));
    };

    const url1 = `${process.env.REACT_APP_AADHAAR_URL}/`;

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
    const url = `${process.env.REACT_APP_AADHAAR_URL}/${kycReqID}/verify`;

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": process.env.REACT_APP_AADHAAR_CLIENT_ID,
      "x-client-secret": process.env.REACT_APP_AADHAAR_CLIENT_SECRET,
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

        if (res.code === "otp_sent" || res.error?.code === "send_otp_failed") {
          localStorage.setItem("aadhaarNumber", data.aadhaarNumber || "");
          navigate("/AdharOTP");
        } else {
          alert(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {});
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
          {t("OFFLINE_AADHAAR_VERIFICATION")}
          <br />
          (OKYC)
        </h2>

        <div className="aadhaarNumber__input">
          <label htmlFor="aadhaarNumber">
            {t("ENTER_YOUR_AADHAAR_NUMBER")}
          </label>

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
            <span>{t("ENTER_SECURITY_CODE")}</span>
            <span>{t("TYPE_THE_CHARACTERS_YOU_SEE_IN_THE_PICTURE")}</span>
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
          {t(
            "WE_WILL_SEND_YOU_AN_OTP_TO_THE_MOBILE_NUMBER_LINKED_WITH_YOUR_AADHAAR"
          )}
        </p>

        <ul>
          <li>
            {t(
              "I_AGREE_TO_DOWNLOAD_MY_AADHAAR_XML_FILE_FROM_THE_UIDAI_WEBSITE_TO_COMPLETE_AADHAAR_OFFLINE_VERIFICATION_WITH_SMALLCASE"
            )}
          </li>

          <li>
            {t(
              "I understand that my Aadhaar details shall not be used or stored for any other purpose."
            )}
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
          {t("I_HAVE_READ_AND_UNDERSTOOD_ALL_OF_THE_POINTS_ABOVE")}
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
          <Text color="white">{t("CONTINUE")}</Text>
        </Button>
      </div>
    </div>
  );
}
