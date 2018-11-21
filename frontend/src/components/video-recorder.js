import React from 'react';
import RecordRTC from 'recordrtc';
import { Modal } from 'react-bootstrap';

const captureUserMedia = (callback) =>{
    var params = { audio: true, video: true };

    navigator.getUserMedia(params, callback, (error) => {
        alert(JSON.stringify(error));
    });
};
const Webcam = (props)=>(
    <video autoPlay muted src={props.src}/>
);

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

class VideoRecorder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recordVideo: null,
            src: null,
            uploadSuccess: null,
            uploading: false
        };

    }

    componentDidMount() {
        if(!hasGetUserMedia) {
            alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
            return;
        }
        this.requestUserMedia();
    }

    requestUserMedia=()=> {
        console.log('requestUserMedia')
        captureUserMedia((stream) => {
            this.setState({ src: window.URL.createObjectURL(stream) });
            console.log('setting state', this.state)
        });
    }

    startRecord = ()=> {
        captureUserMedia((stream) => {
            this.setState({
                recordVideo: RecordRTC(stream, { type: 'video' }),
            },()=>{
                this.state.recordVideo.startRecording();
            })
        });

        //TODO: remove this time limit thing.
        let timeout =setTimeout(() => {
            this.stopRecord();
            clearTimeout(timeout);
        }, 4000);
    }

    //TODO: Put play and stop buttons.
    stopRecord() {
        this.state.recordVideo.stopRecording(() => {
            const file = new File([this.state.recordVideo.blob], "new-upfile.webm", {type: 'video/webm'});
            const formData = new FormData();
            //formData.append('upfile', this.state.recordVideo.blob);
            formData.append('upfile', file,'new-upfile.webm' );
            ///*
            const fetchParams = {
                method: 'POST',
                //headers: {
                 //   "Content-Type": "video/webm"
                //},
                // body: `upfile=${this.state.recordVideo.blob}`
                body: formData
            }

            //*/

            this.setState({ uploading: true });
            // TODO UPLOAD HERE.
           fetch(this.props.uploadURL,
               fetchParams).then((response)=>{
              console.log(response);
           })


        });
    }

    render() {
        return(
            <div>
                <Modal show={this.state.uploadSuccess}><Modal.Body>Upload success!</Modal.Body></Modal>
                <div><Webcam src={this.state.src}/></div>
                {this.state.uploading ?
                    <div>Uploading...</div> : null}
                <div><button onClick={this.startRecord}>Start Record</button></div>
            </div>
        )
    }
}

export default VideoRecorder;
