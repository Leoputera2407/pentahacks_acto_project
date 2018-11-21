import React, { Component } from 'react';
import './App.css';
import VideoRecorder from './components/video-recorder';
class App extends Component {
    state={
        showRecorder : false
    }
  render() {
      const uploadUrl =  `${process.env.REACT_APP_API_URL}/upload/pitch`;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Analyze my sales Pitch</h1>
        </header>
        Whats up dawg. Upload your sales pitch here, or record one!
          <div style={{display:'flex',flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
                  <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
                      <h2> Upload </h2>
          <form className="video-upload-form" action={uploadUrl} method="post" encType="multipart/form-data">
              <input type="file" name="upfile" accept={"video/*"}/>
                  <input type="submit" />
          </form>
              </div>
              <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
                  <h2> Record</h2>
              {this.state.showRecorder?
              <VideoRecorder
                uploadURL={uploadUrl}
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

export default App;
