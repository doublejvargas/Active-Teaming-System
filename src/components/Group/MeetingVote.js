import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Loading from "../ToolBar/Loading";
import app from "firebase/app";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default class MeetingVote extends Component {
  state = {
    loading: true,
    allmeeting: [],
    groupid: "",
    myemail: "",
    showvote: false,
    currentid: 0,
    chosenTime: "",
  };

  componentDidMount = async () => {
    let id = this.props.groupId;
    let myemail = this.props.authdata;

    let MetRef = await app
      .firestore()
      .collection("Meeting")
      .where("GroupRef", "==", id)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        let alldata = [];

        snapshot.forEach((doc) => {
          let meetingid = doc.id;
          let data = doc.data();
          data.meetingid = meetingid;

          alldata.push(data);
        });

        this.setState({
          groupid: id,
          myemail: myemail,
          loading: false,
          allmeeting: alldata,
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  };

  vtoeTime = async (meetingid) => {
    let meetings = this.state.allmeeting;
    let canvote = false;
    let index = 0;

    for (let i = 0; i < meetings.length; i++) {
      if (
        meetings[i].meetingid === meetingid &&
        meetings[i].leftVoter.includes(this.state.myemail)
      ) {
        canvote = true;
        index = i;
      }
    }

    if (!canvote) {
      alert(
        "Either you have already voted on a time or the meeting is overed!"
      );
    } else {
      this.setState({
        currentid: index,
        showvote: true,
      });
    }
  };

  VoteClose = () => {
    this.setState({
      showvote: false,
    });
  };

  Voteforreal = async () => {
    let currentmeeting = this.state.allmeeting[this.state.currentid];
    let meetingid = currentmeeting.meetingid;
    let timeoptions = currentmeeting.TimeOptions;
    let leftovter = currentmeeting.leftVoter;

    if (this.state.chosenTime !== "") {
      for (let i = 0; i < leftovter.length; i++) {
        if (leftovter[i] === this.state.myemail) {
          leftovter.splice(i, 1);
        }
      }
      const chosent = new Date(this.state.chosenTime);
      timeoptions[chosent] = timeoptions[chosent] + 1;

      if (leftovter.length === 0) {
        let keys = Object.keys(timeoptions);
        keys.sort(function (a, b) {
          return timeoptions[b] - timeoptions[a];
        });

        let mostvoted = new Date(keys[0]);

        let metref = await app
          .firestore()
          .collection("Meeting")
          .doc(meetingid)
          .set(
            {
              TimeOptions: timeoptions,
              leftVoter: leftovter,
              votedDate: mostvoted,
            },
            { merge: true }
          );
      } else {
        let metref = await app
          .firestore()
          .collection("Meeting")
          .doc(meetingid)
          .update({
            TimeOptions: timeoptions,
            leftVoter: leftovter,
          });
      }

      this.VoteClose();
    } else {
      alert("please choose a valid time slot");
    }
  };

  chooseTime = (e) => {
    this.setState({ chosenTime: e.value });
  };

  goMeeting = async (meetingid) => {
    let meetings = this.state.allmeeting;
    let settle = false;
    let index = 0;

    for (let i = 0; i < meetings.length; i++) {
      if (
        meetings[i].meetingid === meetingid &&
        meetings[i].leftVoter.length === 0
      ) {
        settle = true;
        index = i;
      }
    }

    if (!settle) {
      alert(
        "Meeting has not been settled, there is still member who have not voted on a date option!"
      );
    } else {
      let currentTime = new Date();
      let voteddate = meetings[index].votedDate.toDate();

      if (currentTime.getTime() <= voteddate.getTime()) {
        if (
          window.confirm(
            "You are earlier, do you want to go to Zoom meeting right now?"
          )
        ) {
          window.open("https://zoom.us/join");
        }
      } else {
        if (
          window.confirm(
            "You are late! Do you want to go to Zoom meeting right now?"
          )
        ) {
          const increment = app.firestore.FieldValue.increment(0.5);

          let useref = await app
            .firestore()
            .collection("groups")
            .doc(this.state.groupid)
            .collection("warning")
            .doc(this.state.myemail)
            .set(
              {
                count: increment,
              },
              { merge: true }
            );

          window.open("https://zoom.us/join");
        }
      }
    }
  };

  renderMeetingPoll = () => {
    let meetings = this.state.allmeeting;

    for (let i = 0; i < meetings.length; i++) {
      let timeoptions = Object.entries(meetings[i].TimeOptions);

      meetings[i].timeoptions = timeoptions;
    }

    let jsxOUtlist = meetings.map((meeting) => (
      <div
        className="col col-md-6 col-lg-4 rounded float-left"
        key={meeting.meetingid}
      >
        <div className="card">
          <div className="card-content">
            <span className="card-title text-primary">Upcoming Meeting</span>
            <br />
            <span className="text-info">Promoter</span>: {meeting.Promoter}
            <br />
            {!meeting.votedDate? (
              <div>
                <span className="text-info">TimeOptions:</span>
                <br />
                <ul>
                  {meeting.timeoptions.map((option) => (
                    <li>
                      {option[0]}&nbsp;&nbsp;:&nbsp;&nbsp;{option[1]}
                      &nbsp;vote(s)
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <span className="text-info">Meeting Date:</span>
                <br />
                <h6>
                  {new Date(meeting.votedDate.seconds * 1000).toUTCString()}
                </h6>
              </div>
            )}
          </div>
          <div className="card-action">
            <button
              className="btn btn-outline-success"
              onClick={() => this.vtoeTime(meeting.meetingid)}
            >
              Vote Time
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => this.goMeeting(meeting.meetingid)}
            >
              Go to Meeting
            </button>
          </div>
        </div>
      </div>
    ));

    return jsxOUtlist;
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    let output = this.renderMeetingPoll();

    return (
      <div className="text-center">
        <Modal show={this.state.showvote} onHide={this.VoteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Pick a Time</label>
            <Dropdown
              options={this.state.allmeeting[this.state.currentid].timeoptions}
              onChange={this.chooseTime}
              value={this.state.chosenTime}
              placeholder="Select a Time Slot"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.Voteforreal}>
              Vote
            </Button>
            <Button variant="secondary" onClick={this.VoteClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div>{output}</div>
      </div>
    );
  }
}
