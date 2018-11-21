/*
Loading page - make the websocket connection here
 */

import io from 'socket.io-client';

import React, {Component} from 'react';

class LandingPage extends Component {
    socket = null;
    constructor(props){
        super(props);
        console.log("constructor rendering with location", props.history.location);
        const connectionID = props.history.location.state.connectionID;
        console.log("loading page: connectionID : ",connectionID);
        this.socket =  io(`${process.env.REACT_APP_API_URL}`, {query:{connectionID:connectionID} });
    }
    componentDidMount () {
        this.socket.on("LOADING_EVT",(data)=>{
            //TODO
            console.log("from server: ",data);
        })
    }
    render (){
        return (
            <div>
                Loading ting
            </div>
        );
    }
}
export default LandingPage;

