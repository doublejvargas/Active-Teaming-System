import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";

export const BlackList = ({ currentUserEmail, firebase }) => {
  const [email, setEmail] = useState("");
  const onChange = (event) => setEmail(event.target.value);
  const handleAdd = () => {
    firebase
      .user(email)
      .get()
      .then((res) => {
        if (res.exists) {
          firebase.user(currentUserEmail).update({
            blackList: firebase.app.firestore.FieldValue.arrayUnion(res.ref),
          });
          setEmail("");
          alert("success!");
        } else alert("user not exists!");
      });
  };
  return (
    <Form.Row>
      <Form.Control
        onChange={onChange}
        type="email"
        placeholder="email"
        value={email}
      />
      <Button variant="primary" onClick={handleAdd}>
        Add
      </Button>
    </Form.Row>
  );
};
