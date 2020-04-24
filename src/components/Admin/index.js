import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { UserDetail } from "../Account/userDetail";
import { Button } from "react-bootstrap";
import { ComplaintsList } from "./complaints";
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { list: [], toggle: "registration" };
    this.pendingListSubcriber = null;
  }

  componentDidMount() {
    this.pendingListSubcriber = this.props.firebase
      .getPendingUsers()
      .onSnapshot((users) => {
        this.setState({ list: [] });
        if (!users.empty) {
          users.forEach((user) => {
            this.setState((prev) => ({ list: [...prev.list, user.data()] }));
          });
        }
      });
  }

  componentWillUnmount() {
    this.pendingListSubcriber();
  }

  Registration = () => {
    const { list } = this.state;
    return list.map((user) => (
      <UserDetail userData={user} pendingUser={true} firebase={this.props.firebase} />
    ));
  };

  toggleChange = (event) => {
    const value = event.target.value;
    this.setState({ toggle: value });
  };

  ConditionalRender = () => {
    const { toggle } = this.state;
    if (toggle === "registration") return <this.Registration />;
    else if (toggle === "complaints")
      return <ComplaintsList firebase={this.props.firebase} />;
  };

  render() {
    return (
      <div>
        <Button onClick={this.toggleChange} variant="info" value="registration">
          registration
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="complaints">
          complaints
        </Button>{" "}
        <this.ConditionalRender />
      </div>
    );
  }
}

export default withFirebase(Admin);
