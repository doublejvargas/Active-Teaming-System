import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";

export const Group = ({ firebase }) => {
  const [groupData, setGroupData] = useState();
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(!showModal);
  const handleFormChange = (event) =>
    setGroupData((prev) => (prev, { [event.target.name]: event.target.value }));
  const handleConfirm = () => {
    firebase.group().add(groupData);
  };
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Form a new Group
      </Button>
      <Modal show={showModal} onHide={handleShow} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              onChange={handleFormChange}
              type="text"
              name="name"
              placeholder="group name"
            />
            <Form.Control
              onChange={handleFormChange}
              as="textarea"
              name="public"
              placeholder="public infomation"
            />
            <Form.Control
              onChange={handleFormChange}
              as="textarea"
              name="private"
              placeholder="private infomation"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
