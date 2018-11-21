import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Analyze my sales Pitch</h1>
        </header>
        Whats up dawg. Upload your sales pitch here.
          <form className="video-upload-form" action={`${process.env.REACT_APP_API_URL}/upload/pitch`} method="post" encType="multipart/form-data">
              <input type="file" name="upfile" accept={"video/*"}/>
                  <input type="submit" />
          </form>
      </div>
    );
  }
}

export default App;
