import { Overlay, Tooltip, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";

export const UserDetail = ({ userData, pendingUser, firebase }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const acceptRegister = async() => {
    const tempPassword = "123456";
    const { name, email, interest, credential, reference } = userData;
    const creatUser = firebase.app
      .functions()
      .httpsCallable("createUser");
    creatUser({ email, tempPassword })
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
                  refs: firebase.app.firestore.FieldValue.arrayUnion(
                    docRef
                  ),
                });
              }
            });
        }
        firebase.pendingUser(email).update({ rejected: "accept" });
        firebase.passwordReset(email);
        alert('success')
      })
      .catch((error) => {
        alert(error);
      });
  }

  const rejectRegister = () => {
    let rejected = userData.rejected;
    if (rejected === "init") rejected = "rejected";
    else rejected = "block";
    firebase.pendingUser(userData.email).update({ rejected });
    alert('success');
  }
  return (
    <div>
      <strong>user name: {userData.name}</strong>{" "}
      <Button ref={target} onClick={() => setShow(!show)}>
        detail
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        <Tooltip>
          <p>name: {userData.name}</p>
          <p>email: {userData.email}</p>
          <p>interest: {userData.interest}</p>
          <p>credential: {userData.credential}</p>
          {pendingUser ? (
            <>
              <Button variant="primary" onClick={acceptRegister}>Accept</Button>
              <Button variant="warning" onClick={rejectRegister}>Reject</Button>
            </>
          ) : (
            <>
              <p>role: {userData.role}</p>
              <Button variant="warning">report</Button>
            </>
          )}
        </Tooltip>
      </Overlay>
    </div>
  );
};
