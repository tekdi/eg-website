import { Box, Modal, Text } from "native-base";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const OrderSuccessModal = ({ isOpen, onClose, orderId, applied = false }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content textAlign={"center"} padding={10}>
        <Text fontSize={22} fontFamily={"fantasy"} textTransform="capitalize">
          {applied
            ? t("ALREADY_APPLIED_FOR_THIS_JOB")
            : t("Thank_you_for_applying_application_number_is")}
          :
        </Text>
        <Modal.CloseButton />
        <Modal.Body textAlign={"center"} alignSelf={"center"} marginTop={7}>
          <Box padding={3} marginLeft={10} width={250} background={"gray.600"}>
            <Text color={"white"} fontWeight={500}>
              {orderId}
            </Text>
          </Box>

          <Text my={4} textTransform="capitalize">
            {localStorage.getItem("instructionsValue")}
          </Text>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default OrderSuccessModal;
OrderSuccessModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  orderId: PropTypes.string,
  applied: PropTypes.bool,
};
