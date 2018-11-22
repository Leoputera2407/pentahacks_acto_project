/*
Loading page - make the websocket connection here
 */

import io from 'socket.io-client';

import React, {Component} from 'react';

const WSEVENTS = {
    "KAIROS_VIDEO_EMOTION_FINISH": "KAIROS_VIDEO_EMOTION_FINISH",
    "GCP_TTS_FINISH": "GCP_TTS_FINISH",
    "VOKO_AUDIO_EMOTION_FINISH": "VOKO_AUDIO_EMOTION_FINISH",
    "SCORE_AGGREGATION_FINISH": "SCORE_AGGREGATION_FINISH",
    "RESULTS": "RESULTS"
}

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
        this.socket.on(WSEVENTS.KAIROS_VIDEO_EMOTION_FINISH,(data)=>{
            //TODO
            console.log("KAIROS FINISH from server: ",data);
        })
        this.socket.on(WSEVENTS.GCP_TTS_FINISH,(data)=>{
            //TODO
            console.log("TTS FINISH from server: ",data);
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

