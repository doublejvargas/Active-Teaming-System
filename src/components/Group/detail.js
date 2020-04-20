import { Overlay, Tooltip, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";

export const GroupDetail = ({ groupData }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <div>
      <strong>group name: {groupData.name}</strong>{" "}
      <Button ref={target} onClick={() => setShow(!show)}>
        detail
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        <Tooltip>
          <p>name: {groupData.name}</p>
          <p>project description: {groupData.public}</p>
          <Button variant="warning">report</Button>
        </Tooltip>
      </Overlay>
    </div>
  );
};
