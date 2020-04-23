import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { GroupDetail } from "../Group/detail";
import { withFirebase } from "../Firebase";
const ComplaintModalBase = ({ groupData, firebase, showComplain }) => {
  const [showModal, setShowModal] = useState(showComplain);
  const [reason, setReason] = useState("");
  const handleShow = () => setShowModal(!showModal);

  const handleConfirm = () => {
    const groupRef = firebase.group().doc(groupData.id);
    firebase.complain().add({ groupRef, reason, createdAt: new Date() });
    handleShow();
    alert("success!!");
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleShow} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>File a complain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              as="textarea"
              placeholder="please enter your reason"
              onChange={(event) => setReason(event.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Cancle
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export const ComplaintModal = withFirebase(ComplaintModalBase);
