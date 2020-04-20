import { Overlay, Tooltip, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";

export const UserDetail = ({ userData }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <div>
      <strong>group name: {userData.name}</strong>{" "}
      <Button ref={target} onClick={() => setShow(!show)}>
        detail
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        <Tooltip>
          <p>name: {userData.name}</p>
          <p>email: {userData.email}</p>
          <p>interest: {userData.interest}</p>
          <p>credential: {userData.credential}</p>
          <p>role: {userData.role}</p>
          <Button variant="warning">report</Button>
        </Tooltip>
      </Overlay>
    </div>
  );
};
