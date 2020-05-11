import React, { useState, useEffect } from "react";
import { Card, Modal, Form, Button } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import { withAuthUser } from "../Session";
import { compose } from "recompose";
const VoteSUbase = ({ firebase, authUser }) => {
  const [vips, setVips] = useState([]);
  const [votes, setVotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newVote, setNewVote] = useState("");
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
      .getSUvote()
      .get()
      .then((voteRefs) => {
        const votes = [];
        voteRefs.forEach((ref) => {
          const id = ref.id;
          const data = ref.data();
          votes.push({ id, ...data });
        });
        setVotes(votes);
      });
  }, [vips]);

  const handleShowModal = () => setShowModal(!showModal);

  const chooseCandidate = (event) => setNewVote(event.target.value);

  const addNewVote = () => {
    const vote = newVote.split(" score: ");
    const authUserRef = firebase.user(authUser.email);
    firebase
      .getDemocraticSU()
      .get()
      .then((refs) => {
        if (refs.size > 0) {
          alert("already have a democratic SU");
        } else {
          firebase.vote().add({
            targetName: vote[0],
            targetScore: vote[1],
            yes: [authUserRef],
            no: [],
            type: "SU",
            createdAt: new Date(),
            achieved: false,
          });
          alert("success");
        }
        handleShowModal();
      });
  };

  const VoteDetail = ({ vote }) => {
    const [currentVote, setCurrentVote] = useState("");
    const [voteData, setVoteData] = useState(vote);

    useEffect(() => {
      const { yes, no } = voteData;
      if (yes.some((ref) => ref.id === authUser.email)) {
        setCurrentVote("yes");
      } else if (no.some((ref) => ref.id === authUser.email)) {
        setCurrentVote("no");
      }
    }, []);

    const checkIFallMembersRespond = async () => {
      const yesVoted = voteData.yes.length;
      const noVoted = voteData.no.length;

      if (yesVoted + noVoted === vips.length) {
        if (yesVoted > noVoted) {
          let candidateId = "";
          for (let i = 0; i < vips.length; ++i) {
            if (vips[i].name === voteData.targetName) {
              candidateId = vips[i].email;
              break;
            }
          }
          firebase
            .getDemocraticSU()
            .get()
            .then((refs) => {
              if (refs.size > 0) {
                alert("already have a democratic SU");
              } else {
                firebase.user(candidateId).update({ role: "DSU" });
              }
            });
          firebase.vote().doc(voteData.id).update({ achieved: true });
        }
        setVotes(votes.filter((vote) => vote.id !== voteData.id));
      }
    };

    const updateVote = () => {
      firebase
        .vote()
        .doc(voteData.id)
        .get()
        .then((res) => {
          setVoteData(
            { id: res.id, ...res.data() },
            checkIFallMembersRespond()
          );
        });
    };

    const voteAction = async (type) => {
      const userRef = firebase.user(authUser.email);
      if (type === "yes" && currentVote === "no") {
        firebase
          .vote()
          .doc(voteData.id)
          .update({
            yes: firebase.app.firestore.FieldValue.arrayUnion(userRef),
            no: firebase.app.firestore.FieldValue.arrayRemove(userRef),
          });
      } else if (type === "no" && currentVote === "yes") {
        firebase
          .vote()
          .doc(voteData.id)
          .update({
            no: firebase.app.firestore.FieldValue.arrayUnion(userRef),
            yes: firebase.app.firestore.FieldValue.arrayRemove(userRef),
          });
      } else if (currentVote === "") {
        firebase
          .vote()
          .doc(voteData.id)
          .update({
            [type]: firebase.app.firestore.FieldValue.arrayUnion(userRef),
          });
      }
      updateVote();
      setCurrentVote(type);
    };

    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Name: {voteData.targetName}</Card.Title>
          <Card.Text>Score: {voteData.targetScore}</Card.Text>
        </Card.Body>
        <Button
          variant={currentVote === "yes" ? "primary" : "outline-primary"}
          onClick={() => voteAction("yes")}
        >
          vote yes
        </Button>{" "}
        <Button
          variant={currentVote === "no" ? "primary" : "outline-primary"}
          onClick={() => voteAction("no")}
        >
          vote no
        </Button>
      </Card>
    );
  };

  return (
    <div>
      <Button onClick={handleShowModal}>create a new vote</Button>
      <Modal show={showModal} onHide={handleShowModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control as="select" value={newVote} onChange={chooseCandidate}>
            <option>choose candidate</option>
            {vips.map((vip) => (
              <option>
                {vip.name} score: {vip.score}
              </option>
            ))}
          </Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShowModal}>
            Close
          </Button>
          <Button variant="primary" onClick={addNewVote}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {votes.length > 0 ? (
        <div>
          {votes.map((vote) => (
            <VoteDetail vote={vote} />
          ))}
        </div>
      ) : (
        <div>no onging votes</div>
      )}
    </div>
  );
};

export const VoteSU = compose(withAuthUser, withFirebase)(VoteSUbase);
