import React, { useState, useEffect, useRef } from "react";
import { Overlay, Tooltip, Button } from "react-bootstrap";
export const ComplaintsList = ({ firebase }) => {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    getAllComplaints();
  }, []);
  const getAllComplaints = () => {
    firebase
      .complaint()
      .where("solved", "==", false)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          setComplaints([...complaints, { id: doc.id, ...doc.data() }]);
        });
      });
  };
  const ComplaintDetail = ({ complaintData, group }) => {
    const [showTip, setShowTip] = useState(false);
    const target = useRef(null);
    return (
      <div>
        <strong>group name: {complaintData.name}</strong>{" "}
        <Button ref={target} onClick={() => setShowTip(!showTip)}>
          detail
        </Button>
        <Overlay target={target.current} show={showTip} placement="right">
          <Tooltip>
            <p>group name: {complaintData.name}</p>
            <p>reason: {complaintData.reason}</p>
          </Tooltip>
        </Overlay>
      </div>
    );
  };

  const ShowAllComplaints = () => {
    if (complaints) {
      return complaints.map((complaint) => (
        <ComplaintDetail complaintData={complaint} group={true} />
      ));
    }
    return <div></div>;
  };
  return <ShowAllComplaints />;
};
