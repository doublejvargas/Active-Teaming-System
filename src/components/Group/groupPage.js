import React, { Component } from 'react'
import Loading from '../ToolBar/Loading';
import GroupPost from './groupPost';
import app from 'firebase/app';

export default class GroupPage extends Component {

    constructor(props){
        super();

        this.state = {
            loading : true,
            groupid : '',
            members : [],
            groupName : ''
        }

        this.db = app.firestore();
    }

    componentDidMount = async() => {

        let id = this.props.match.params.id

        let groupRef = await this.db.collection('groups').doc(id).get()
            .then( res => {
                
                let data = res.data();

                console.log(data)

                let members = [];

                for( let i = 0; i < data.members.length; i++ ){

                    members.push(data.members[i].id)
                }

                this.setState({
                    loading : false,
                    groupid : id,
                    members : members,
                    groupName : data.name
                })

            }).catch( error => 
                console.log(error));

        console.log(this.state)


    }

    render() {

        if(this.state.loading) {
            return <Loading />;
        }

        return (
            <div>
                <div className="text-center">
                    <h2>Hello! This is Group <em>{this.state.groupName}</em></h2>
                    <h4>Group Members:</h4>
                        {this.state.members.map( member => <li>{member}</li>)}
                </div>
                <br/><br/>
                <div>
                    <h3 className="text-center">Recent Posting</h3>
                    <GroupPost id={this.state.groupid} />
                </div>

                <div className="text-center">
                    <button>Schedule Meeting</button>
                    <br/>
                    <button>warning</button>&nbsp;&nbsp;or&nbsp;&nbsp;<button>praise</button>
                </div>

            </div>
        )
    }
}
