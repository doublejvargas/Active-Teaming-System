import React, { Component } from "react";
import Loading from "../ToolBar/Loading";
import GroupPost from "./groupPost";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { UserDetail } from "../User/userDetail";

class GroupPageBase extends Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      groupid: "",
      members: [],
      groupName: "",
    };
  }

  componentDidMount = async () => {
    let id = this.props.match.params.id;

    let groupRef = await this.props.firebase
      .group()
      .doc(id)
      .get()
      .then(async (res) => {
        let data = res.data();

        let members = [];

        for (let i = 0; i < data.members.length; i++) {
            await data.members[i].get().then(member => {
                members.push(member.data());
            })
        }

        this.setState({
          loading: false,
          groupid: id,
          members: members,
          groupName: data.name,
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
          <h4>Group Members:</h4>
          {this.state.members.map((member) => (
              <UserDetail userData={member} firebase={this.props.firebase} groupId={this.state.groupid}/>
          ))}
        </div>
        <br />
        <br />
        <div>
          <h3 className="text-center">Recent Posting</h3>
          <GroupPost id={this.state.groupid} />
        </div>

        <div className="text-center">
          <button>Schedule Meeting</button>
          <br />
          <button>warning</button>&nbsp;&nbsp;or&nbsp;&nbsp;
          <button>praise</button>
        </div>
      </div>
    );
  }
}

const GroupPage = compose(withAuthUser, withFirebase)(GroupPageBase);

export default GroupPage;
