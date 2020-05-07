import React, { useState, useEffect, useRef } from "react";
import { withFirebase } from "../Firebase";
import { Form, Button, Card, Modal } from "react-bootstrap";
import { withAuthUser } from "../Session";
import { compose } from "recompose";
import { ScoreSystem } from "../tabooSystem/score";

const TaskBase = ({ firebase, groupId, authUser, members }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState([]);
  const getTasks = async () => {
    const allTasks = [];

    await firebase
      .task(groupId)
      .get()
      .then((res) => {
        res.docs.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          allTasks.push({ id, ...data });
        });
      });
    setTasks(allTasks);
  };
  useEffect(() => {
    getTasks();
  }, [tasks && tasks.length === 0 ? tasks.length : 0]);

  const ShowTasks = () => {
    if (tasks && tasks.length > 0) {
      return tasks.map((task) => (
        <TaskDetail
          task={task}
          finished={task.finished}
          firebase={firebase}
          members={members}
          groupId={groupId}
        />
      ));
    }
    return <div>no tasks</div>;
  };
  const AddNewTask = () => {
    firebase
      .task(groupId)
      .add({ ...newTask, finished: false, createdAt: new Date() });
    alert("success");
    handleShowModal();
  };

  const handleShowModal = () => setShowModal(!showModal);

  const handleFormChange = (event) =>
    setNewTask({ ...newTask, [event.target.name]: event.target.value });

  const TaskDetail = ({ task, finished, firebase, members, groupId }) => {
    const [assign, setAssign] = useState(task.assignTo);
    const markAsFinished = async () => {
      await firebase
        .task(groupId)
        .doc(task.id)
        .update({ finished: true, finishedAt: new Date() });
      task.finished = true;
      setTasks(
        tasks.map((t) => {
          if (t.id === task.id) {
            return task;
          }
          return t;
        })
      );
    };

    const assignTo = (event) => {
      const name = event.target.value;
      firebase.task(groupId).doc(task.id).update({ assignTo: name });
      setAssign(name);
    };

    return (
      <div
        className={
          finished
            ? "d-flex justify-content-end"
            : "d-flex justify-content-start"
        }
      >
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{task.title}</Card.Title>
            <Card.Text>{task.description}</Card.Text>
          </Card.Body>
          {finished ? (
            <>
              <h6>Finished by {task.assignTo}</h6>
              <h6>Finished at {new Date(task.finishedAt.seconds * 1000).toUTCString()}</h6>
            </>
          ) : (
            <>
              <Form.Control as="select" value={assign} onChange={assignTo}>
                <option>assign to...</option>
                {members.map((member) => (
                  <option>{member.name}</option>
                ))}
              </Form.Control>
              <Button variant="warning" onClick={markAsFinished}>
                mark as finished
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className="text-center">
        <Button onClick={handleShowModal}>add new task</Button>
        <Modal show={showModal} onHide={handleShowModal} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>New Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                onChange={handleFormChange}
                type="text"
                name="title"
                placeholder="title"
              />
              <Form.Control
                onChange={handleFormChange}
                as="textarea"
                name="description"
                placeholder="task description"
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleShowModal}>
              Close
            </Button>
            <Button variant="primary" onClick={AddNewTask}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <ShowTasks />
    </>
  );
};

export const Task = compose(withAuthUser, withFirebase)(TaskBase);
