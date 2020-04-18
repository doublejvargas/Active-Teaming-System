import React, { Component, useState } from "react";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { Button, Modal, Form } from "react-bootstrap";
class AccountPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = { references: [] };
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
  render() {
    let max = 10;
    if (this.state.role === "VIP") max = 20;
    let Reference = () => <div></div>;
    if (this.state.references.length) {
      Reference = this.state.references.map((ref) => (
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
    }
    return (
      <div>
        <ModalBase firebase={this.props.firebase} />
        <Reference />
      </div>
    );
  }
}

const ModalBase = ({firebase}) => {
  const [groupData, setGroupData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(!showModal);
  const handleFormChange = (event) =>
    setGroupData({ ...groupData, [event.target.name]: event.target.value });
  const handleConfirm = () => {
    firebase.group().add(groupData);
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Form a new Group
      </Button>
      <Modal
        show={showModal}
        onHide={handleShow}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              onChange={handleFormChange}
              type="text"
              name="name"
              placeholder="group name"
            />
            <Form.Control
              onChange={handleFormChange}
              as="textarea"
              name="public"
              placeholder="public infomation"
            />
            <Form.Control
              onChange={handleFormChange}
              as="textarea"
              name="private"
              placeholder="private infomation"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AccountPage = compose(withAuthUser, withFirebase)(AccountPageBase);

export default withAuthUser(AccountPage);
