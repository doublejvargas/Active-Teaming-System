import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { tabooWords } from "../../constants/data";
import { TabooSystem } from "../tabooSystem/taboo";
const ComplaintModalBase = ({
  data,
  firebase,
  showComplain,
  authUser,
  type,
}) => {
  const [showModal, setShowModal] = useState(showComplain);
  const [reason, setReason] = useState("");
  const handleShow = () => setShowModal(!showModal);

  const handleConfirm = () => {
    let ref = firebase.group().doc(data.id);
    if (type === "user") ref = firebase.user(data.id);
    let newReason = reason;
    const tabooSaid = [];
    tabooWords.forEach((word) => {
      let oldReason = newReason;
      newReason = newReason.split(word).join("***");
      if (newReason != oldReason) tabooSaid.push(word);
    });
    if (tabooSaid.length > 0 && authUser) {
      TabooSystem(firebase, authUser, tabooSaid);
    }
    firebase.complaint().add({
      name: data.name,
      ref,
      reason: newReason,
      createdAt: new Date(),
      solved: false,
      type,
    });

    handleShow();
    alert("success!!");
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleShow} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>File a complaint</Modal.Title>
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
export const ComplaintModal = compose(
  withAuthUser,
  withFirebase
)(ComplaintModalBase);
