import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase";
import { Button } from "react-bootstrap";
import { withAuthUser } from "../Session";
import { compose } from "recompose";
import { ScoreSystem } from "../tabooSystem/score";
const EvaluateMembersBase = ({ groupId, members, firebase, authUser }) => {
  const [membersNeedEval, setMembersNeedEval] = useState([]);
  const getMembersNotEval = async () => {
    let membersNotEval = [];
    await firebase
      .evaluation(groupId, authUser.email)
      .get()
      .then((res) => {
        if (res.exists) {
          const { youEvaluated } = res.data();
          if (youEvaluated) {
            membersNotEval = members.filter((member) => {
              const id = member.email;
              let flag = true;
              youEvaluated.forEach((evaluated) => {
                console.log(evaluated.id === id)
                if (evaluated.id === id) {
                  flag = false;
                }
              });
              return flag;
            });
          } else {
            membersNotEval = members;
          }
        }
      });
    membersNotEval = membersNotEval.filter(
      (member) => member.email !== authUser.email
    );
    setMembersNeedEval(membersNotEval);
  };

  useEffect(() => {
    getMembersNotEval();
  }, []);

  const onChange = (event, email) => {
    let value = event.target.value;
    if (value > 10) value = 10;
    if (value < 0) value = 0;
    setMembersNeedEval((prev) =>
      prev.map((member) => {
        if (member.email === email) {
          member.evalScore = value;
        }
        return member;
      })
    );
  };

  const submitScore = (email, score) => {
    const memberBeEval = firebase.evaluation(groupId, email);
    const memberBeEvalRef = firebase.user(email);
    const userWhoEval = firebase.user(authUser.email);
    const currentUserEvalList = firebase.evaluation(groupId, authUser.email);
    firebase.db.runTransaction((transaction) => {
      return transaction.get(memberBeEval).then((res) => {
        if (!res.exists) {
          score = parseInt(score);
          transaction.set(memberBeEval, {
            score,
            evaluatedYou: firebase.app.firestore.FieldValue.arrayUnion(
              userWhoEval
            ),
          });
          if (members.length - 1 === 1) {
            firebase
              .user(memberBeEval.id)
              .get()
              .then((doc) => {
                const userData = doc.data();
                const currentScore =
                  userData.score + score / (members.length - 1);
                console.log(currentScore);
                ScoreSystem(firebase, userData, currentScore, []);
              });
          }
        } else {
          const data = res.data();
          const newScore = data.score + parseInt(score);
          let evaluatedYou = data.evaluatedYou;
          if (evaluatedYou) {
            evaluatedYou.push(userWhoEval);
          } else {
            evaluatedYou = [userWhoEval];
          }
          transaction.update(memberBeEval, {
            score: newScore,
            evaluatedYou: firebase.app.firestore.FieldValue.arrayUnion(
              userWhoEval
            ),
          });

          if (evaluatedYou && evaluatedYou.length === members.length - 1) {
            firebase
              .user(memberBeEval.id)
              .get()
              .then((doc) => {
                const userData = doc.data();
                const currentScore =
                  userData.score + parseInt(newScore / (members.length - 1));
                ScoreSystem(firebase, userData, currentScore, []);
              });
          }
        }
        currentUserEvalList.get().then((docRef) => {
          if (!docRef.exists) {
            currentUserEvalList.set({
              youEvaluated: firebase.app.firestore.FieldValue.arrayUnion(
                memberBeEvalRef
              ),
            });
          } else {
            currentUserEvalList.update({
              youEvaluated: firebase.app.firestore.FieldValue.arrayUnion(
                memberBeEvalRef
              ),
            });
          }
        });
      });
    });

    setMembersNeedEval(
      membersNeedEval.filter((member) => member.email !== email)
    );
  };

  if (membersNeedEval && membersNeedEval.length > 0) {
    return (
      <div>
        <h3>Give a exit evaluation score</h3>
        {membersNeedEval.map((member) => {
          return (
            <div>
              <input
                onChange={(event) => onChange(event, member.email)}
                value={member.evalScore}
                type="number"
                placeholder="enter a score"
              />
              <strong>name: {member.name}</strong>
              <Button
                onClick={() => submitScore(member.email, member.evalScore)}
              >
                comfirm
              </Button>
            </div>
          );
        })}
      </div>
    );
  } else return <></>;
};

export const EvaluateMembers = compose(
  withAuthUser,
  withFirebase
)(EvaluateMembersBase);
