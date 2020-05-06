import React, { Component } from "react";
import Loading from "../ToolBar/Loading";
import GroupPost from "./groupPost";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { UserDetail } from "../User/userDetail";
import { Button, Modal, Form } from "react-bootstrap";
import { Vote } from "./vote";
class GroupPageBase extends Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      groupId: "",
      members: [],
      groupName: "",
      toggle: "",
    };
  }

  componentDidMount = async () => {
    let id = this.props.match.params.id;

    let groupRef = await this.props.firebase
      .group()
      .doc(id)
      .get()
      .then(async (res) => {
        const data = res.data();

        const members = [];

        for (let i = 0; i < data.members.length; i++) {
          await data.members[i].get().then((member) => {
            members.push(member.data());
          });
        }
        
        this.setState({
          loading: false,
          groupId: id,
          members: members,
          groupName: data.name,
          public: data.public,
          votes: data.votes
        });
      })
      .catch((error) => console.log(error));
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <div>
        <div className="text-center">
          <h2>
            Hello! This is Group <em>{this.state.groupName}</em>
          </h2>
          <div className="text-center">
            <Button
              variant="info"
              onClick={() => this.setState({ toggle: "votes" })}
            >
              check votes
            </Button>{" "}
            <Button
              variant="info"
              onClick={() => this.setState({ toggle: "tasks" })}
            >
              check tasks
            </Button>
          </div>
          <h4>Group Members:</h4>
          {this.state.members.map((member) => (
            <UserDetail
              userData={member}
              firebase={this.props.firebase}
              groupId={this.state.groupId}
            />
          ))}
        </div>
        {this.state.toggle === "votes" ? (
          <div className="text-center">
          <br />
            <Vote groupVotes={this.state.votes} groupId={this.state.groupId} members={this.state.members}/>
          </div>
        ) : (
          <>
            <br />
            <div className="text-center">
              <Button variant="outline-info">Schedule Meeting</Button>{" "}
              <Button variant="outline-danger">Close Group</Button>
            </div>
            <br />
            <div>
              <h3 className="text-center">Recent Posting</h3>
              <GroupPost id={this.state.groupId} />
            </div>
          </>
        )}
      </div>
    );
  }
}

const GroupPage = compose(withAuthUser, withFirebase)(GroupPageBase);

export default GroupPage;
