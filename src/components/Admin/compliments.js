import React, { useState, useEffect, useRef } from "react";
import { Overlay, Tooltip, Button } from "react-bootstrap";
import { ScoreSystem } from "../tabooSystem/score";
export const ComplimentList = ({ firebase }) => {
  const [compliments, setCompliments] = useState([]);

  useEffect(() => {
    getAllCompliments();
  }, []);
  const getAllCompliments = () => {
    firebase
      .getUnsovledCompliment()
      .get()
      .then((ref) => {
        ref.docs.forEach((doc) => {
          setCompliments((prev) => [...prev, { id: doc.id, ...doc.data() }]);
        });
      });
  };

  const ShowAllComplaints = () => {
    if (compliments.length > 0) {
      return compliments.map((compliment) => (
        <ComplimentDetail complimentData={compliment} firebase={firebase} />
      ));
    }
    return <div></div>;
  };

  const ComplimentDetail = ({ complimentData, firebase }) => {
    const [showTip, setShowTip] = useState(false);
    const target = useRef(null);
    const reward = () => {
      firebase
        .user(complimentData.receiver)
        .get()
        .then((user) => {
          const data = user.data();
          const score = data.score + 3;
          ScoreSystem(firebase, data, score, []);
        });
      updateComplaintStatus();
    };
    const updateComplaintStatus = () => {
      firebase.compliment().doc(complimentData.id).update({ solved: true });
      setCompliments(
        compliments.filter(
          (compliment) => compliment.createdAt !== complimentData.createdAt
        )
      );
    };
    return (
      <div>
        <strong>sender: {complimentData.sender}</strong>{" "}
        <Button ref={target} onClick={() => setShowTip(!showTip)}>
          detail
        </Button>
        <Overlay target={target.current} show={showTip} placement="right">
          <Tooltip>
            <p>sender: {complimentData.sender}</p>
            <p>receiver: {complimentData.receiver}</p>
            <Button variant="secondary" onClick={updateComplaintStatus}>
              Deny
            </Button>
            <Button variant="primary" onClick={reward}>
              Reward
            </Button>
          </Tooltip>
        </Overlay>
      </div>
    );
  };

  return <ShowAllComplaints />;
};
