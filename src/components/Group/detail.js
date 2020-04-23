import { Overlay, Tooltip, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";
import {ComplaintModal} from './complaint';
export const GroupDetail = ({ groupData }) => {
  const [show, setShow] = useState({showDetail: false, showComplain: false});
  const target = useRef(null);
  const complaint = () => {
    setShow({showDetail: !show.showDetail, showComplain: !show.showComplain});
  }
  return (
    <div>
      <strong>group name: {groupData.name}</strong>{" "}
      <Button ref={target} onClick={() => setShow({showDetail: !show.showDetail})}>
        detail
      </Button>
      {show.showComplain? <ComplaintModal groupData={groupData} showComplain={show.showComplain} /> : <></>}
      <Overlay target={target.current} show={show.showDetail} placement="right">
        <Tooltip>
          <p>name: {groupData.name}</p>
          <p>project description: {groupData.public}</p>
          <Button variant="warning" onClick={complaint}>Complaint</Button>
        </Tooltip>
      </Overlay>
    </div>
  );
};
