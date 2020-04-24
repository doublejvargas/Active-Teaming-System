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

  // async acceptRegister(userInfo) {
  //   const tempPassword = "123456";
  //   const { name, email, interest, credential, reference } = userInfo;
  //   const creatUser = this.props.firebase.app
  //     .functions()
  //     .httpsCallable("createUser");
  //   creatUser({ email, tempPassword })
  //     .then((res) => {
  //       return this.props.firebase.user(email).set({
  //         name,
  //         email,
  //         interest,
  //         credential,
  //         reference,
  //         role: "OU",
  //         createdAt: new Date(),
  //         score: 0,
  //       });
  //     })
  //     .then((res) => {
  //       if (reference) {
  //         this.props.firebase
  //           .user(reference)
  //           .get()
  //           .then((user) => {
  //             if (user.exists) {
  //               const docRef = this.props.firebase.user(email);
  //               user.ref.update({
  //                 refs: this.props.firebase.app.firestore.FieldValue.arrayUnion(
  //                   docRef
  //                 ),
  //               });
  //             }
  //           });
  //       }
  //       this.props.firebase.pendingUser(email).update({ rejected: "accept" });
  //       this.props.firebase.passwordReset(email);
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
  // }

  // rejectRegister(userInfo) {
  //   let rejected = userInfo.rejected;
  //   if (rejected === "init") rejected = "rejected";
  //   else rejected = "block";
  //   this.props.firebase.pendingUser(userInfo.email).update({ rejected });
  // }

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
