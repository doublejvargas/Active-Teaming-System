import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { withFirebase } from "../Firebase";

const EvluationBase = ({ firebase }) => {
  const [vips, setVips] = useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    firebase
      .getAllVIPs()
      .get()
      .then((userRefs) => {
        const vips = [];
        userRefs.forEach((ref) => {
          const id = ref.id;
          const data = ref.data();
          vips.push({ id, ...data });
        });
        setVips(vips);
      });
  }, []);

  useEffect(() => {
    firebase
      .getGroupsNeedEvaluate()
      .get()
      .then((groupRefs) => {
        const groups = [];
        groupRefs.forEach((ref) => {
          const id = ref.id;
          const data = ref.data();
          groups.push({ id, ...data });
        });
        setGroups(groups);
      });
  }, [vips]);

  const Detail = ({ groupData }) => {
    const assignTo = async (userId) => {
      const groupRef = firebase.group().doc(groupData.id);
      await firebase.user(userId).update({
        groupsAssigned: firebase.app.firestore.FieldValue.arrayUnion(groupRef),
      });
      await groupRef.update({vipEvaluated: true})
      setGroups({
        groups: groups.filter((group) => group.id !== groupData.id),
      });
    };

    return (
      <Card style={{ width: "25rem" }}>
        <Card.Body>
          <Card.Title>Name: {groupData.name}</Card.Title>
          <Card.Text>Project description: {groupData.public}</Card.Text>
        </Card.Body>
        {vips.map((vip) => (
          <>
            <strong>
              vip name: {vip.name}, score: {vip.score}
              <button onClick={() => assignTo(vip.id)}>assign to him</button>
            </strong>
          </>
        ))}
      </Card>
    );
  };
  return (
    <>
      {groups.length > 0 ? (
        <div>
          {groups.map((group) => (
            <Detail groupData={group} />
          ))}
        </div>
      ) : (
        <div>no data</div>
      )}
    </>
  );
};

export const Evaluation = withFirebase(EvluationBase);
