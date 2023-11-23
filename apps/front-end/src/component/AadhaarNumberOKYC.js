import { HStack, VStack, Alert, Modal } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FrontEndTypo } from "@shiksha/common-lib";

const AadhaarNumberOKYC = ({ user, _button }) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();

  return (
    <VStack>
      <FrontEndTypo.Primarybutton
        onPress={() => setOpenModal(true)}
        width="100%"
        {..._button}
      >
        {t("AADHAR_NUMBER_KYC")}
      </FrontEndTypo.Primarybutton>

      <Modal isOpen={openModal} size="lg">
        <Modal.Content>
          <Modal.Header>
            <FrontEndTypo.H1>{t("AADHAR_NUMBER_KYC")}</FrontEndTypo.H1>
          </Modal.Header>
          <Modal.Body p="5">
            <VStack space="4">
              <VStack>
                <HStack space="4" alignItems={"center"}>
                  <FrontEndTypo.H2 bold color="textGreyColor.550">
                    {t("NAME")}:
                  </FrontEndTypo.H2>
                  <FrontEndTypo.H2 color="textGreyColor.800" bold>
                    {`${user?.first_name || "-"} ${user?.middle_name || "-"} ${
                      user?.last_name || "-"
                    }`}
                  </FrontEndTypo.H2>
                </HStack>
              </VStack>
              <VStack space="4">
                <HStack space="4">
                  <FrontEndTypo.H2 bold color="textGreyColor.550">
                    {t("DATE_OF_BIRTH")}:
                  </FrontEndTypo.H2>
                  <FrontEndTypo.H2 color="textGreyColor.800" bold>
                    {user?.dob}
                  </FrontEndTypo.H2>
                </HStack>
              </VStack>
              <HStack space="4">
                <FrontEndTypo.H2 bold color="textGreyColor.550">
                  {t("AADHAAR_NUMBER")}:
                </FrontEndTypo.H2>
                <FrontEndTypo.H2 color="textGreyColor.800" bold>
                  {user?.aadhar_no}
                </FrontEndTypo.H2>
              </HStack>

              <Alert status="warning" alignItems={"start"}>
                <HStack alignItems="center" space="2">
                  <Alert.Icon />

                  <VStack space="4" width={"100%"}>
                    <HStack width="95%">
                      {t("AADHAAR_OKYC_MODAL_ALERT_EDIT_MESSSAGE")}
                      <FrontEndTypo.Primarybutton
                        ml="1"
                        size="md"
                        height="15px"
                        onPress={(e) => {
                          navigate(`profile/edit/basic_details`);
                        }}
                      >
                        <FrontEndTypo.H4 bold color="white">
                          {t("EDIT")}
                        </FrontEndTypo.H4>
                      </FrontEndTypo.Primarybutton>
                    </HStack>
                    <HStack width="98%">
                      {t("AADHAAR_OKYC_MODAL_ALERT_MESSSAGE")}
                    </HStack>
                  </VStack>
                </HStack>
              </Alert>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-between"}>
            <FrontEndTypo.Secondarybutton onPress={(e) => setOpenModal()}>
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              onPress={(e) =>
                navigate(`/aadhaar-kyc/${user?.id}/okyc2`, {
                  state: "/",
                })
              }
            >
              {t("CONFIRM")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};
export default React.memo(AadhaarNumberOKYC);
