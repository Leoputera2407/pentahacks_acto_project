import React from 'react';
import RecordRTC from 'recordrtc';

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
            uploading: false,
            isRecording:false
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
        this.setState({
            isRecording:true
        });
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
        }, 40000);
    }

    uploadVideo = ()=>{
        this.setState({ uploading: true });
        const file = new File([this.state.recordVideo.blob], "new-upfile.webm", {type: 'video/webm'});
        const formData = new FormData();

        formData.append('upfile', file, 'new-upfile.webm');

        this.props.onSubmitForm(formData)
        /*
        fetch(this.props.uploadURL,
            fetchParams).then((response)=>{
            console.log(response);
            this.setState({
                uploadSuccess:true,
                uploading:false
            })
        })
        */
    }

    stopRecord=()=> {
        this.state.recordVideo.stopRecording(() => {
            this.setState({
                isRecording: false
            });
        });
    }

    render() {
        return(
            <div>
                <div><Webcam src={this.state.src}/></div>
                {this.state.uploading ?
                    <div>Uploading...</div> : null}
                {this.state.uploadSuccess?
                    <div> Upload Success! </div>:null}

                <div><button onClick={this.state.isRecording? this.stopRecord: this.startRecord}>{this.state.isRecording? "Stop":"Start"} Recording</button></div>
                {!this.state.isRecording && this.state.recordVideo?
                <button onClick={this.uploadVideo}>
                    Submit video
                </button>
                        :null}
            </div>
        )
    }
}

export default VideoRecorder;
