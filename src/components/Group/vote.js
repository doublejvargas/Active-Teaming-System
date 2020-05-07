import React, { useState, useEffect, useRef } from "react";
import { withFirebase } from "../Firebase";
import { Overlay, Tooltip, Button } from "react-bootstrap";
import { withAuthUser } from "../Session";
import { compose } from "recompose";
import { ScoreSystem } from "../tabooSystem/score";
const VoteBase = ({ firebase, groupId, groupVotes, authUser, members }) => {
  const [votes, setVotes] = useState([]);

  const getVotes = async () => {
    let voteList = [];
    for (let i = 0; i < groupVotes.length; ++i) {
      await groupVotes[i].get().then((res) => {
        voteList.push({ ...res.data(), id: res.id });
      });
    }
    voteList = voteList.filter((vote) => vote.target.id !== authUser.email);
    setVotes(voteList);
  };
  useEffect(() => {
    getVotes();
  }, []);
  const ShowVotes = () => {
    if (votes.length > 0) {
      return votes.map((vote) => <VoteDetail vote={vote} />);
    }
    return <div></div>;
  };

  const VoteDetail = ({ vote }) => {
    const [show, setShow] = useState(false);
    const target = useRef(null);
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

    const kickOut = async (scoreDeduction) => {
      const groupRef = firebase.group().doc(groupId);
      const memberRef = voteData.target;
      await groupRef.update({
        members: firebase.app.firestore.FieldValue.arrayRemove(memberRef),
      });
      await memberRef.update({
        groups: firebase.app.firestore.FieldValue.arrayRemove(groupRef),
      });
      await memberRef.get().then((res) => {
        const data = res.data();
        const newScore = data.score - scoreDeduction;
        ScoreSystem(firebase, data, newScore, []);
      });
    };

    const checkIFallMembersRespond = async () => {
      const voteRef = firebase.vote().doc(voteData.id);
      const groupRef = firebase.group().doc(groupId);
      const yesVoted = voteData.yes.length;
      const noVoted = voteData.no.length;
      if (yesVoted + noVoted + 1 === members.length) {
        await groupRef.update({
          votes: firebase.app.firestore.FieldValue.arrayRemove(voteRef),
        });
        if (yesVoted === members.length - 1) {
          if (voteData.type === "kickOut") {
            kickOut(10);
          } else {
            const memberRef = groupRef
              .collection(voteData.type)
              .doc(voteData.target.id);
            await firebase.db.runTransaction((transaction) => {
              return transaction.get(memberRef).then((res) => {
                if (!res.exists) {
                  memberRef.set({ count: 1 });
                } else {
                  const newCount = res.data().count + 1;
                  transaction.update(memberRef, { count: newCount });
                  if (newCount === 3 && voteData.type === "warning") {
                    kickOut(5);
                  }
                }
              });
            })
            setVotes(votes.filter(vote => vote.id !== voteData.id));
          }
        }
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
      <div>
        <strong>vote type: {voteData.type}</strong>{" "}
        <Button ref={target} onClick={() => setShow(!show)}>
          detail
        </Button>
        <Overlay target={target.current} show={show} placement="right">
          <Tooltip>
            <p>type: {voteData.type}</p>
            <p>target: {voteData.target.id}</p>
            <p>yes: {voteData.yes.length}</p>
            <p>no: {voteData.no.length}</p>
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
          </Tooltip>
        </Overlay>
      </div>
    );
  };

  return <ShowVotes />;
};

export const Vote = compose(withAuthUser, withFirebase)(VoteBase);
