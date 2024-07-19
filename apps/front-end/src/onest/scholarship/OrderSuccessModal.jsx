import React from "react";
import { Box, Modal, Text } from "native-base";
import { useTranslation } from "react-i18next";

const OrderSuccessModal = ({ isOpen, onClose, orderId, applied = false }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content textAlign={"center"} padding={10}>
        <Text fontSize={22} fontFamily={"fantasy"}>
          {applied
            ? t("YOU_HAVE_ALREADY_APPLIED_FOR_THIS_SCHOLARSHIP")
            : t("Thank_you_for_applying_application_number_is")}
          :
        </Text>
        <Modal.CloseButton />
        <Modal.Body alignSelf={"center"} marginTop={7}>
          <Box padding={3} width={250} background={"gray.600"}>
            <Text color={"white"} fontWeight={500}>
              {orderId}
            </Text>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default OrderSuccessModal;
