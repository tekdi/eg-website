import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, VStack, Modal, Alert, Text } from "native-base";
import PageLayout from "v2/components/Static/PageLayout/PageLayout";
import NoInternetScreen from "v2/components/Static/NoInternetScreen/NoInternetScreen";
import Loader from "v2/components/Static/Loader/Loader";
import {
  getTokernUserInfo,
  facilitatorRegistryService,
  logout,
  BodyMedium,
  FrontEndTypo,
} from "@shiksha/common-lib";
import PrerakOnboardingForm from "v2/components/Functional/PrerakOnboardingDetail/PrerakOnboardingForm";
import PrerakOnboardingArrayForm from "v2/components/Functional/PrerakOnboardingDetail/PrerakOnboardingArrayForm";
import {
  checkEditRequestPresent,
  checkEnumListPresent,
  checkQulificationPresent,
  getIndexedDBItem,
  getUserId,
} from "v2/utils/Helper/JSHelper";
import {
  checkIpUserInfo,
  checkGetUserInfo,
  getIpUserInfo,
} from "v2/utils/SyncHelper/SyncHelper";
function FacilitatorOnboarding() {
  const { step, photoNo } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  //screen variables
  const [activeScreenName, setActiveScreenName] = useState(step);

  //form variable
  const token = localStorage.getItem("token");
  const [userTokenInfo, setUserTokenInfo] = useState();
  const [userid, setuserid] = useState();
  //fetch URL data and store fix for 2 times render useEffect call
  const [countLoad, setCountLoad] = useState(0);
  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
        //do page load first operation
        setIsloading(true);
        if (token) {
          const IsPresent = await checkDataIsPresent();
          if (!IsPresent) {
            const tokenData = getTokernUserInfo();
            const { hasura } = tokenData?.resource_access || {};
            const id = getUserId();
            const { status, ...user } = await getIpUserInfo(id);
            if (`${status}` === "401") {
              logout();
              window.location.reload();
            }
            setUserTokenInfo({ ...tokenData, authUser: user });
            setuserid(id);
          }
        }
        setIsloading(false);
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      //alert(step);
    }
    fetchData();
  }, [step]);

  const funBackButton = () => {
    if (step == "basic_details") {
      setActiveScreenName("");
    }
    if (step == "contact_details") {
      setActiveScreenName("basic_details");
    }
    if (step == "address_details") {
      setActiveScreenName("contact_details");
    }
    if (step == "personal_details") {
      setActiveScreenName("address_details");
    }
    if (step == "reference_details") {
      setActiveScreenName("personal_details");
    }
    if (step == "work_availability_details") {
      setActiveScreenName("reference_details");
    }
    if (step == "vo_experience") {
      setActiveScreenName("work_availability_details");
    }
    if (step == "experience") {
      setActiveScreenName("vo_experience");
    }
    if (step == "qualification_details") {
      setActiveScreenName("experience");
    }
    if (step == "upload" && !photoNo) {
      setActiveScreenName("qualification_details");
    }
    if (step == "upload" && photoNo) {
      setActiveScreenName("upload");
    }
    setCountLoad(1);
    navigate(-1);
  };
  const navigatePage = (link, screenName, state) => {
    setActiveScreenName(screenName);
    if (state) {
      navigate(link, state);
    } else {
      navigate(link);
    }
  };
  const formValue = [
    "basic_details",
    "contact_details",
    "address_details",
    "personal_details",
    "reference_details",
    "work_availability_details",
    "qualification_details",
    "upload",
    "aadhaar_details",
  ];
  const arrayformValue = ["vo_experience", "experience"];
  const Show_Edit_details = () => {
    if (formValue.includes(activeScreenName)) {
      return (
        <PageLayout
          t={t}
          showAppBar={true}
          funBackButton={funBackButton}
          showHelpButton={true}
          customComponent={
            <PrerakOnboardingForm
              userTokenInfo={userTokenInfo}
              userid={userid}
              step={step}
              navigatePage={navigatePage}
            />
          }
          analyticsPageTitle={"FACILITATOR_ONBOADING"}
          pageTitle={t("FACILITATOR")}
          stepTitle={step}
        />
      );
    } else if (arrayformValue.includes(activeScreenName)) {
      return (
        <PageLayout
          t={t}
          showAppBar={true}
          funBackButton={funBackButton}
          showHelpButton={true}
          customComponent={
            <PrerakOnboardingArrayForm
              userTokenInfo={userTokenInfo}
              userid={userid}
              type={step}
              navigatePage={navigatePage}
            />
          }
          analyticsPageTitle={"FACILITATOR_ONBOADING"}
          pageTitle={t("FACILITATOR")}
          stepTitle={step}
        />
      );
    } else {
      navigate("/");
    }
  };

  //online offline detect
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online, false);
    window.addEventListener("offline", offline, false);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    checkDataIsPresent();
  }, [step]);

  const checkDataIsPresent = async () => {
    const enumList = await checkEnumListPresent();
    const qulification = await checkQulificationPresent();
    const editRequest = await checkEditRequestPresent();
    const IpUserInfo = await checkIpUserInfo(getUserId());
    const GetUserInfo = await checkGetUserInfo(getUserId());
    if (
      !enumList ||
      !qulification ||
      !editRequest ||
      !IpUserInfo ||
      !GetUserInfo
    ) {
      setModalVisible(true);
      return true;
    } else {
      setModalVisible(false);
      return false;
    }
  };

  return (
    <>
      {isLoading ? (
        <PageLayout t={t} isPageMiddle={true} customComponent={<Loader />} />
      ) : (
        Show_Edit_details()
      )}
      <Modal isOpen={modalVisible} avoidKeyboard size="xl">
        <Modal.Content>
          <Modal.Body>
            <Alert status="warning" alignItems={"start"} mb="3" mt="4">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{t("PLEASE_TURN_ON_YOUR_INTERNET")}</BodyMedium>
              </HStack>
            </Alert>
          </Modal.Body>
          <Modal.Footer justifyContent={"center"} alignItems={"center"}>
            <FrontEndTypo.Primarybutton
              onPress={() => {
                navigate("/");
              }}
            >
              {t("CONFIRM")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
export default FacilitatorOnboarding;
