import React, { useState, useEffect, useRef } from "react";
import { Overlay, Tooltip, Button } from "react-bootstrap";
import { ScoreSystem } from "../tabooSystem/score";
export const ComplaintsList = ({ firebase }) => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getAllComplaints();
  }, []);
  const getAllComplaints = () => {
    firebase
      .getUnsovledComplaint()
      .get()
      .then((ref) => {
        ref.docs.forEach((doc) => {
          setComplaints((prev) => [...prev, { id: doc.id, ...doc.data() }]);
        });
      });
  };

  const ShowAllComplaints = () => {
    if (complaints && complaints.length > 0) {
      return complaints.map((complaint) => (
        <ComplaintDetail complaintData={complaint} firebase={firebase} />
      ));
    }
    return <div></div>;
  };

  const ComplaintDetail = ({ complaintData, firebase }) => {
    const [showTip, setShowTip] = useState(false);
    const target = useRef(null);
    const [closeGroup, setCloseGroup] = useState(false);
    const shutDownGroup = () => {
      complaintData.ref.update({ status: "closed", closedAt: new Date() });
      setCloseGroup(true);
    };
    const deductScore = () => {
      complaintData.ref.get().then((group) => {
        const { members } = group.data();
        members.forEach((member) => {
          member.get().then((doc) => {
            const data = doc.data();
            const newScore = data.score - 5;
            ScoreSystem(firebase, data, newScore, []);
          });
        });
      });
      updateComplaintStatus();
    };
    const blockMembers = () => {
      complaintData.ref.get().then((group) => {
        const { members } = group.data();
        members.forEach((member) => {
          member.update({ blocked: "init" });
        });
      });
      updateComplaintStatus();
    };
    const updateComplaintStatus = () => {
      firebase.complaint().doc(complaintData.id).update({ solved: true });
      setComplaints(
        complaints.filter((complaint) => complaint.name !== complaintData.name)
      );
    };
    const punish = () => {
      complaintData.ref.get().then(user => {
        const data = user.data();
        const newScore = data.score - 3;
        ScoreSystem(firebase, data, newScore, []);
      })
      updateComplaintStatus();
    }
    return (
      <>
        {complaintData.type === "user" ? (
          <div>
            <strong>user name: {complaintData.name}</strong>{" "}
            <Button ref={target} onClick={() => setShowTip(!showTip)}>
              detail
            </Button>
            <Overlay target={target.current} show={showTip} placement="right">
              <Tooltip>
                <p>user name: {complaintData.name}</p>
                <p>reason: {complaintData.reason}</p>
                <Button variant="warning" onClick={punish}>
                  Punish
                </Button>
                <Button variant="primary" onClick={updateComplaintStatus}>
                  No actions
                </Button>
              </Tooltip>
            </Overlay>
          </div>
        ) : (
          <div>
            <strong>group name: {complaintData.name}</strong>{" "}
            <Button ref={target} onClick={() => setShowTip(!showTip)}>
              detail
            </Button>
            <Overlay target={target.current} show={showTip} placement="right">
              <Tooltip>
                <p>group name: {complaintData.name}</p>
                <p>reason: {complaintData.reason}</p>
                {closeGroup ? (
                  <>
                    <Button variant="warning" onClick={deductScore}>
                      Deduct members score
                    </Button>
                    <Button variant="warning" onClick={blockMembers}>
                      Block group members
                    </Button>
                  </>
                ) : (
                  <Button variant="warning" onClick={shutDownGroup}>
                    Shut down the group
                  </Button>
                )}
                <Button variant="primary" onClick={updateComplaintStatus}>
                  No actions
                </Button>
              </Tooltip>
            </Overlay>
          </div>
        )}
      </>
    );
  };

  return <ShowAllComplaints />;
};
