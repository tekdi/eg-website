import React, { useEffect, useState } from "react";
import {
  aadhaarService,
  Layout,
  Loading,
  checkAadhaar,
  authRegistryService,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function Aadhaarokyc2({
  setPage,
  setLoading,
  error,
  setError,
  handalBack,
  setAttempt,
  footerLinks,
  setAadhaarCompare,
  user,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [url, setUrl] = useState();
  const { t } = useTranslation();

  const handleSubmit = async (res) => {
    setLoading(true);
    if (res.status === "verified") {
      const result = checkAadhaar(user, res?.aadhaar_data);
      setAadhaarCompare(result);
      if (result?.isVerified) {
        authRegistryService.aadhaarKyc({
          id: user?.id,
          aadhar_verified: "yes",
          aadhaar_verification_mode: "offline",
        });
      }
      await facilitatorRegistryService.prerakAadhaarOkycResponse(res);
      setPage && setPage("aadhaarSuccess");
    } else {
      setAttempt("number");
      setError({
        ...error,
        top: res?.error ? res?.error : t("DATA_NOT_VERIFIED"),
      });
      setPage && setPage("aadhaarSuccess");
    }
    setLoading(false);
  };

  useEffect(async () => {
    if (user) {
      const id = searchParams.get("id");
      const success = searchParams.get("success");
      if (!id) {
        const reuslt = await aadhaarService.okyc2({
          redirectUrl: `${process.env.REACT_APP_BASE_URL}/aadhaar-kyc/${user?.id}/okyc2`,
        });
        if (reuslt && reuslt?.url) {
          setUrl(reuslt?.url);
        }
      } else if (success === "true" && id) {
        const reusltVerify = await aadhaarService.okyc2Verify({ id });
        handleSubmit(reusltVerify);
      }
    }
  }, [!user]);

  useEffect(() => {
    if (url) {
      window.location.replace(url);
    }
  }, [url]);

  return (
    <Layout
      getBodyHeight={(e) => setLoadingHeight(e)}
      _appBar={{
        onlyIconsShow: ["backBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        onPressBackButton: handalBack,
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <Loading height={loadingHeight} />
    </Layout>
  );
}

Aadhaarokyc2.propTypes = {
  setPage: PropTypes.func,
  setLoading: PropTypes.func,
  error: PropTypes.object,
  setError: PropTypes.func,
  handalBack: PropTypes.func,
  setAttempt: PropTypes.func,
  footerLinks: PropTypes.array,
  setAadhaarCompare: PropTypes.func,
  user: PropTypes.object,
};
