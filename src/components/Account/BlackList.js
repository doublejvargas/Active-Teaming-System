import { Button, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { UserDetail } from "../User/userDetail";
export const BlackList = ({ currentUserEmail, firebase, blackList }) => {
  const [email, setEmail] = useState("");
  const [list, setList] = useState([]);
  const onChange = (event) => setEmail(event.target.value);
  const getTheList = () => {
    if (blackList) {
      blackList.forEach((user) => {
        user.get().then((ref) => {
          setList(prev => [...prev, { id: ref.id, ...ref.data() }]);
        });
      });
    }
  };
  useEffect(() => {
    getTheList();
  }, []);
  const ShowTheList = () => {
    if (list && list.length > 0) {
      return list.map((user) => (
        <UserDetail userData={user} pendingUser={false} firebase={firebase} />
      ));
    }
    return <div></div>;
  };

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
    <div>
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
      <ShowTheList />
    </div>
  );
};
