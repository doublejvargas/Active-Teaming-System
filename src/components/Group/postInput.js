import React, { Component } from 'react'
import { Button, Modal, Form } from "react-bootstrap";
import app from 'firebase/app';

export default class PostInput extends Component {
    
    state = {
        show: false,
        sender: '',
        content: '',
        time:''
    }

    id = this.props.id;
    
    handleShow = () => this.setState({
        show: true
    });

    handleClose = () => this.setState({
        show: false
    });

    handleNameChange = (e) => {
        this.setState({ sender: e.target.value})
    }

    handleContentChange = (e) => {
        this.setState({ content: e.target.value})
    }

    handleConfirm = async (event) => {

        //event.preventDefault();

        let postRef = await app.firestore().collection('groups').doc(this.id).collection('post').add({

                sender: this.state.sender,
                content: this.state.content,
                posttime: new Date()
        })

        this.setState({
            show: false
        });

    }

    render() {
        return (
            <div>
                <button className='btn btn-outline-primary' onClick={this.handleShow}>
                    New Post
                </button>
                <Modal show={this.state.show} onHide={this.handleClose} animation={false}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                        onChange={this.handleNameChange}
                        type="text"
                        name="name"
                        placeholder="your Name"
                        />

                        <Form.Label>Your Post</Form.Label>
                        <Form.Control
                        as="textarea" rows="3"
                        onChange={this.handleContentChange}
                        type="text"
                        placeholder="your post"
                        />
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleConfirm}>
                        Confirm
                    </Button>
                    </Modal.Footer>
                </Modal>
                <br/><br/>
          </div>
        )
    }
}
