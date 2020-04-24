import React, { Component } from "react";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { Button } from "react-bootstrap";
import { Group } from "./Group";
import { WhiteList } from "./WhiteList";
import { BlackList } from "./BlackList";
class AccountPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = { references: [], toggle: "reference" };
  }

  componentDidMount() {
    this.setState(this.props.authUser, this.getReferences);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authUser === null) {
      this.setState(this.props.authUser, this.getReferences);
    }
  }

  getReferences = () => {
    const { refs } = this.state;
    if (refs) {
      refs.forEach((ref) => {
        ref.get().then((doc) => {
          this.setState((prev) => ({
            prev,
            references: [...prev.references, doc.data()],
          }));
        });
      });
    }
  };

  onChange = (event, email, max) => {
    let value = event.target.value;
    if (value > max) value = max;
    this.setState((prev) => ({
      prev,
      references: prev.references.map((ref) => {
        if (ref.email === email) {
          ref.score = value;
        }
        return ref;
      }),
    }));
  };

  submitScore = (email, score) => {
    this.props.firebase.user(email).update({ score });
    const docRef = this.props.firebase.user(email);
    this.props.firebase.user(this.state.email).update({
      refs: this.props.firebase.app.firestore.FieldValue.arrayRemove(docRef),
    });
    this.setState((prev) => ({
      prev,
      references: prev.references.filter((ref) => ref.email !== email),
    }));
  };

  Reference = () => {
    let max = 10;
    if (this.state.role === "VIP") max = 20;
    if (this.state.references.length) {
      return this.state.references.map((ref) => (
        <div>
          <input
            onChange={(event) => this.onChange(event, ref.email, max)}
            value={ref.score}
            type="number"
            placeholder="score"
            max={max}
          />
          {ref.email}
          <button onClick={() => this.submitScore(ref.email, ref.score)}>
            comfirm
          </button>
        </div>
      ));
    } else return <></>;
  };

  toggleChange = (event) => {
    const value = event.target.value;
    this.setState({ toggle: value });
  };

  ConditionalRender = () => {
    const { toggle } = this.state;
    if (toggle === "reference") return <this.Reference />;
    else if (toggle === "whiteList")
      return (
        <WhiteList
          currentUserEmail={this.state.email}
          firebase={this.props.firebase}
          whiteList={this.state.whiteList}
        />
      );
    else if (toggle === "blackList")
      return (
        <BlackList
          currentUserEmail={this.state.email}
          firebase={this.props.firebase}
          blackList={this.state.blackList}
        />
      );
    else if (toggle === "group")
      return <Group currentUserEmail={this.state.email} currentUserGroups = {this.state.groups} firebase={this.props.firebase} />;
  };

  render() {
    return (
      <div>
        <Button onClick={this.toggleChange} variant="info" value="reference">
          reference
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="whiteList">
          white list
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="blackList">
          black list
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="group">
          group
        </Button>
        <this.ConditionalRender />
      </div>
    );
  }
}
const AccountPage = compose(withAuthUser, withFirebase)(AccountPageBase);

export default withAuthUser(AccountPage);
