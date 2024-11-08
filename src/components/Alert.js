import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";

const AlertDialog = ({ title, content, isOpen, closeCallback, okCallback }) => {
  return (
    <Modal show={isOpen} onHide={closeCallback}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={okCallback}>
          Đồng ý
        </Button>
        <Button variant="secondary" onClick={closeCallback}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AlertDialog;
