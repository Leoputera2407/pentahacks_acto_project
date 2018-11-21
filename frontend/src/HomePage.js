import React, { Component } from 'react';
import VideoRecorder from './components/video-recorder';
const UPLOAD_URL = `${process.env.REACT_APP_API_URL}/upload/pitch`;
class HomePage extends Component {
    state={
        showRecorder : false
    }
    moveToLoadingPage = (connectionID)=>{
        // NOTE: we get a websocket connectionID that we use to connect to the websocket , for our given pitch video.
        this.props.history.push (`/loading`,
            {
                connectionID
            })
        ;
    }
    submitVideo = (formData) => {
        const fetchParams = {
            method: 'POST',
            body: formData
        };
        fetch(UPLOAD_URL,
            fetchParams).then((response)=>{
                console.log(response);
                response.text().then((text)=>{
                    const connectionId = text;
                    console.log("response from upload: ", text);
                    this.moveToLoadingPage(connectionId);
                })
            })
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Analyze my sales Pitch</h1>
        </header>
        Whats up dawg. Upload your sales pitch here, or record one!
          <div style={{display:'flex',flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
                  <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
                      <h2> Upload </h2>
          <form id="vupload-form" className="video-upload-form" action={UPLOAD_URL} method="post" encType="multipart/form-data">
              <input type="file" name="upfile" accept={"video/*"}/>
                  <input type="submit"  onClick={
                      (e)=>{
                          e.preventDefault();
                          const formData = new FormData(document.getElementById("vupload-form"));
                          this.submitVideo(formData);
                      }
                  }/>
          </form>
              </div>
              <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
                  <h2> Record</h2>
              {this.state.showRecorder?
              <VideoRecorder
                onSubmitForm={this.submitVideo}
              />:
                  <button
                      onClick={()=>this.setState({showRecorder:true})}
                  >
                      Record a pitch
                  </button>
              }
          </div>
          </div>
      </div>
    );
  }
}

export default HomePage;
