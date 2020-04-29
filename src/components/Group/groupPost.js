import React, { Component } from 'react'
import Post from './post'
import Loading from '../ToolBar/Loading';
import app from 'firebase/app';
import PostInput from './postInput';

export default class GroupPost extends Component {
    state = {
        loading: true,
        posts: [],
    }
    
    componentDidMount = async() => {

        let id = this.props.id
        
        let PostRef = await app.firestore().collection('groups').doc(id).collection('post').get()
            .then( res => {

                let postlist = [];

                res.forEach( doc => {
                    
                    let key = doc.id;
                    let data = doc.data();
                    
                    let date = new Date(data.posttime.seconds * 1000).toUTCString();
                    
                    data.key = key;
                    data.posttime = date

                    postlist.push(data)
                })

                console.log(postlist)
                
                this.setState({
                    posts: postlist.map( post => <Post content = {post.content} 
                                                        posttime = {post.posttime} 
                                                        sender = {post.sender}
                                                        key = {post.key} />),
                    loading: false,
                });

            })
            .catch(err => {
                console.log(err)

        });
    }
    
    
    render() {
        
        if(this.state.loading) {
            return <Loading />;
        }
      
        return (
            <div className="container-fluid text-center">
                <div className="row justify-content-center">
                    { this.state.posts }
                </div>
                <PostInput id={this.props.id}/>
            </div>
        );
      }
}
