import { Overlay, Tooltip, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";
import { ComplaintModal } from "../complaintSystem/complaint";
import { Link } from 'react-router-dom';

export const GroupDetail = ({ groupData, invite, firebase, authUser }) => {

  const [show, setShow] = useState({ showDetail: false, showComplain: false });
  const target = useRef(null);

  const complain = () => {
    setShow({ showDetail: !show.showDetail, showComplain: !show.showComplain });
  };

  const removeGroup = () => {
    const groupRef = firebase.group().doc(groupData.id);
    firebase.user(authUser.email).update({
      pendingGroups: firebase.app.firestore.FieldValue.arrayRemove(groupRef),
    });
    alert('success')
  };

  const accept = () => {
    const groupRef = firebase.group().doc(groupData.id);
    const userRef = firebase.user(authUser.email);
    userRef.update({
      groups: firebase.app.firestore.FieldValue.arrayUnion(groupRef),
    });
    groupRef.update({
      members: firebase.app.firestore.FieldValue.arrayUnion(userRef),
    });
    removeGroup();
  };

  return (
    <div>
      <strong>group name: {groupData.name}</strong>{" "}
      <Button
        ref={target}
        onClick={() => setShow({ showDetail: !show.showDetail })}
      >
        detail
      </Button>

      <Link to={`/group/${groupData.id}`}><button>Go</button></Link>

      {show.showComplain ? (
        <ComplaintModal
          data={groupData}
          showComplain={show.showComplain}
          type="group"
        />
      ) : (
        <></>
      )}
      <Overlay target={target.current} show={show.showDetail} placement="right">
        <Tooltip>
          <p>name: {groupData.name}</p>
          <p>project description: {groupData.public}</p>
          {invite ? (
            <>
              <Button variant="secondary" onClick={removeGroup}>
                reject
              </Button>
              <Button variant="primary" onClick={accept}>
                accpet
              </Button>
            </>
          ) : (
            <Button variant="warning" onClick={complain}>
              Complain
            </Button>
          )}
        </Tooltip>
      </Overlay>
    </div>
  );
};
