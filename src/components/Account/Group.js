import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { GroupDetail } from '../Group/detail';

export const Group = ({ currentUserEmail, currentUserGroups, firebase }) => {
  const [groupData, setGroupData] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentInvite, setCurrentInvite] = useState("");
  const [groups, setGroups] = useState([]);
  const handleShow = () => setShowModal(!showModal);
  const handleFormChange = (event) =>
    setGroupData({ ...groupData, [event.target.name]: event.target.value });

  useEffect(() => {
    getAllGroups();
  }, []);
  const handleConfirm = async () => {
    const groupDocRef = firebase.group().doc();
    const currentUserRef = firebase.user(currentUserEmail);
    const members = [currentUserRef];
    for (let i = 0; i < invitations.length; i++) {
      await firebase
        .user(invitations[i])
        .get()
        .then((res) => {
          const docRef = res.ref;
          const { whiteList, blackList } = res.data();
          if (checkIfInList(currentUserRef, whiteList)) {
            docRef.update({
              groups: firebase.app.firestore.FieldValue.arrayUnion(groupDocRef),
            });
            members.push(docRef);
          } else if (!checkIfInList(currentUserRef, blackList)) {
            docRef.update({
              pendingGroups: firebase.app.firestore.FieldValue.arrayUnion(
                groupDocRef
              ),
            });
          }
        });
    }
    firebase.user(currentUserEmail).update({
      groups: firebase.app.firestore.FieldValue.arrayUnion(groupDocRef),
    });
    groupDocRef.set({ ...groupData, members, createdAt: new Date() });
    handleShow();
    alert("success!!");
  };

  const checkIfInList = (docRef, list) => {
    if (list) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].id === docRef.id) return true;
    }
    return false;
  };

  const handleInviteChange = (event) => setCurrentInvite(event.target.value);
  const handleInvitations = () => {
    firebase
      .user(currentInvite)
      .get()
      .then((res) => {
        if (res.exists && invitations.indexOf(currentInvite) === -1)
          setInvitations([...invitations, currentInvite]);
        else alert("error!");
      });
  };
  const ShowInvitations = () => {
    return invitations.map((invite) => <div>{invite}</div>);
  };

  const getAllGroups = () => {
    if (currentUserGroups) {
      currentUserGroups.forEach((group) => {
        group.get().then((ref) => {
          setGroups([...groups, {id:ref.id, ...ref.data()}]);
        });
      });
    }
  };

  const ShowAllGroups = () => {
    if (groups) {
      return groups.map((group) => <GroupDetail groupData={group} /> );
    }
    return <div></div>;
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Form a new Group
      </Button>
      <ShowAllGroups />
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
            <Form.Control
              onChange={handleInviteChange}
              type="text"
              placeholder="invitations"
            />
            <Button variant="primary" size="sm" onClick={handleInvitations}>
              invite
            </Button>
            <ShowInvitations />
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
