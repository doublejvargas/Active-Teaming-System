import { Overlay, Tooltip, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";
import { withAuthUser } from "../Session";
import {ComplaintModal} from '../complaintSystem/complaint';
const UserDetailBase = ({ userData, pendingUser, firebase, authUser }) => {
  const [show, setShow] = useState({showDetail: false, showComplain: false});
  const target = useRef(null);
  const complain = () => {
    setShow({showDetail: !show.showDetail, showComplain: !show.showComplain});
  }
  const acceptRegister = async () => {
    const password = "123456";
    const { name, email, interest, credential, reference } = userData;
    const creatUser = firebase.app.functions().httpsCallable("createUser");
    creatUser({ email, password })
      .then((res) => {
        return firebase.user(email).set({
          name,
          email,
          interest,
          credential,
          reference,
          role: "OU",
          createdAt: new Date(),
          score: 0,
        });
      })
      .then((res) => {
        if (reference) {
          firebase
            .user(reference)
            .get()
            .then((user) => {
              if (user.exists) {
                const docRef = firebase.user(email);
                user.ref.update({
                  refs: firebase.app.firestore.FieldValue.arrayUnion(docRef),
                });
              }
            });
        }
        firebase.pendingUser(email).update({ rejected: "accept" });
        firebase.passwordReset(email);
        alert("success");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const rejectRegister = () => {
    let rejected = userData.rejected;
    if (rejected === "init") rejected = "rejected";
    else rejected = "block";
    firebase.pendingUser(userData.email).update({ rejected });
    alert("success");
  };

  const compliment = () => {
    let sender = 'visitor';
    if(authUser) sender=authUser.email;
    firebase.compliment().add({sender, createdAt: new Date(), receiver:userData.email, solved:false});
    setShow({showDetail: !show.showDetail});
    alert("success");
  }

  return (
    <div>
      <strong>user name: {userData.name}</strong>{" "}
      <Button ref={target} onClick={() => setShow({showDetail: !show.showDetail})}>
        detail
      </Button>
      {show.showComplain? <ComplaintModal data={userData} showComplain={show.showComplain} type='user'/> : <></>}
      <Overlay target={target.current} show={show.showDetail} placement="right">
        <Tooltip>
          <p>name: {userData.name}</p>
          <p>email: {userData.email}</p>
          <p>interest: {userData.interest}</p>
          <p>credential: {userData.credential}</p>
          {pendingUser ? (
            <>
              <Button variant="primary" onClick={acceptRegister}>
                Accept
              </Button>
              <Button variant="warning" onClick={rejectRegister}>
                Reject
              </Button>
            </>
          ) : (
            <>
              <p>role: {userData.role}</p>
              <Button variant="warning" onClick={complain}>Complain</Button>
              <Button variant="primary" onClick={compliment}>Compliment</Button>
            </>
          )}
        </Tooltip>
      </Overlay>
    </div>
  );
};

export const UserDetail = withAuthUser(UserDetailBase);