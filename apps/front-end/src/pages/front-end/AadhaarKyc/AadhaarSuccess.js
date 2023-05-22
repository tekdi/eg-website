import React from "react";
import WestIcon from "@mui/icons-material/West";
import CheckIcon from "@mui/icons-material/Check";
import "./AadhaarKyc.css";
import { Button, Text } from "native-base";

export default function AdharSuccess() {
  return (
    <div className="adharVerify2">
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

        <p className="boxMessage2">
          <CheckIcon fontSize="small" />
          <span>Your Aadhaar Verification is successful</span>
        </p>

        <Button variant="secondary" bg={"gray.500"} py="12px" px="20px" mt={20}>
          <Text color="white">Continue Login</Text>
        </Button>
      </div>
    </div>
  );
}