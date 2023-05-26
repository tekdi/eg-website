import React from "react";
import WestIcon from "@mui/icons-material/West";
import { Checkbox } from "@mui/material";
import { Box, Button, FormControl, Image, Input, Text } from "native-base";
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
    localStorage.removeItem("kycOtpFailed");
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

        if (res.code === "otp_sent") {
          localStorage.setItem("aadhaarNumber", data.aadhaarNumber);
          navigate("/admin/aadhaarOTP");
        } else if (res.error && res.error?.code === "send_otp_failed") {
          localStorage.setItem("kycOtpFailed", true);

        if (res.code === "otp_sent" || res.error?.code === "send_otp_failed") {
          localStorage.setItem("aadhaarNumber", data.aadhaarNumber || "");

          navigate("/admin/aadhaarOTP");
        } else {
          alert(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {});
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

        <Box mt="2">
          <FormControl.Label htmlFor="aadhaarNumber" mb="2">
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">{t("ENTER_YOUR_AADHAAR_NUMBER")}</Text>
          </FormControl.Label>

          <Input
            id="aadhaarNumber"
            name="aadhaarNumber"
            placeholder="0000 0000 0000"
            p="4"
            fontSize={18}
            maxWidth={480}
            borderRadius={8}
            borderColor="gray.500"
            onChange={(e) => {
              setData({ ...data, aadhaarNumber: e.target?.value });
            }}
          />
        </Box>

        <Box mt="2">
          <FormControl.Label htmlFor="securityCode" mb="2" display="flex" flexDirection="column">
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">{t("ENTER_SECURITY_CODE")}</Text>
            <Text fontSize="sm" fontWeight="medium" color="gray.500" mt="0.5">{t("TYPE_THE_CHARACTERS_YOU_SEE_IN_THE_PICTURE")}</Text>
          </FormControl.Label>

          <img

            style={{ width: '150px', marginLeft: '-15px' }}
            marginLeft={'-15px'}
            src={`data:image/jpeg;charset=utf-8;base64,${captchaImg}`}
            alt="captcha image"
          />
          
          <Input
            id="securityCode"
            name="securityCode"
            placeholder="6YE3ZH"
            p="4"
            fontSize={18}
            maxWidth={120}
            borderRadius={8}
            borderColor="gray.500"
            onChange={(e) => {
              setData({ ...data, securityCode: e.target?.value });
            }}
          />
        </Box>

        <Text display="inline-block" mt="6" color="gray.600" fontWeight="500" p="2" borderWidth="2" borderColor="gray.400" rounded="md">
          {t(
            "WE_WILL_SEND_YOU_AN_OTP_TO_THE_MOBILE_NUMBER_LINKED_WITH_YOUR_AADHAAR"
          )}
        </Text>

        <ul style={{ padding: '0px 20px', marginTop: '10px' }}>
          <li style={{ listStyleType: 'disc' }}>
            <Text fontSize="sm" fontWeight="500" color="gray.600">
              {t(
                "I_AGREE_TO_DOWNLOAD_MY_AADHAAR_XML_FILE_FROM_THE_UIDAI_WEBSITE_TO_COMPLETE_AADHAAR_OFFLINE_VERIFICATION_WITH_SMALLCASE"
              )}
            </Text>
          </li>

          <li style={{ listStyleType: 'disc' }}>
            <Text fontSize="sm" fontWeight="500" color="gray.600">
              {t(
                "I understand that my Aadhaar details shall not be used or stored for any other purpose."
              )}
            </Text>
          </li>
        </ul>


        <FormControl.Label htmlFor="checkMark" display="flex" alignItems="center" flexDirection="row">
          <Checkbox
            id="checkMark"
            name="checkMark"
            size="small"
            onChange={(e) => {
              setData({ ...data, checkMark: e.target.checked });
            }}
          />{" "}
          <Text fontSize="sm">{t("I_HAVE_READ_AND_UNDERSTOOD_ALL_OF_THE_POINTS_ABOVE")}</Text>
        </FormControl.Label>

        <Button
          variant="secondary"
          bg={
            !data.aadhaarNumber || !data.securityCode || !data.checkMark
              ? "gray.300"
              : "gray.500"
          }
          py="12px"
          px="20px"
          mb="6"
          disabled={
            !data.aadhaarNumber || !data.securityCode || !data.checkMark
          }
          onPress={sendData}
        >
          <Text color="white">{t("CONTINUE")}</Text>
        </Button>
      </Box>
    </Box>
  );
}
