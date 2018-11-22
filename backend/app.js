const express = require('express');
let app = express();
let upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const uuid = require('uuid');
const ffmpeg = require('fluent-ffmpeg');
const speech = require('@google-cloud/speech');
require("dotenv").config({ path: path.join(__dirname, "settings.env") });

const FILE_UPLOAD_DIR= path.join(__dirname, "uploads");
if (!fs.existsSync(FILE_UPLOAD_DIR)){
    console.log(FILE_UPLOAD_DIR, "does not exist. Creating it...");
   fs.mkdirSync(FILE_UPLOAD_DIR);
}

socketClientMap = new Map();
app.use(upload()); // configure middleware
const server = app.listen(7200);
console.log("app running on 7200");

const io = require('socket.io')(server, {origin: "*" /*TODO: CHANGE ORIGIN FOR PROd */});

io.use(function (socket, next) {
    const connectionID = socket.handshake.query.connectionID;
    if(socketClientMap.has(connectionID)) {
        if (socketClientMap.get(connectionID) === null) {
            socketClientMap.set(connectionID, socket);
            setInterval(()=>{
                console.log("emitting loading evt");
                socket.emit("LOADING_EVT", "hello hello");
            },2000);
        }
        return next();
    }else{
        return next( new Error("Unauthenticated."));
    }

});
app.options('/upload/pitch',cors());
app.post('/upload/pitch',cors(), function(req, res){
  console.log('req.files');
  console.log(req.files);
  if(req.files.upfile){
    let file = req.files.upfile,
      name = file.name;
        let splittedname = file.name.split('.');
        let extension = "";
        if (splittedname.length > 1){
            extension = "." + splittedname [splittedname.length - 1 ];
        }

      const connectionID = uuid();
    let uploadpath = path.join(FILE_UPLOAD_DIR, connectionID + extension);
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.sendStatus(500);
      }
      else {
        console.log("File Uploaded: ",name, "filename : ",uploadpath);
          socketClientMap.set(connectionID, null);
          res.status(200).send(connectionID);
          transcribe(uploadpath).then((transcription_str)=>{
              //TODO: what to do with transcribe audio path here.
              console.log("transcription_Str:", transcription_str);
          })
      }
    });
  }
  else {
    res.status(404).send("No File selected !");
    res.end();
  };
})

//resolves with filepath of audio file if successful.
function convertVideoToAudio(absolute_video_filepath, samplerate){
    return new Promise((resolve,reject)=>{
        const audio_destination_path = path.join(
            path.dirname(absolute_video_filepath),
            `${path.basename(absolute_video_filepath).split('.')[0]}.flac`
        );
        console.log("Destination: ",audio_destination_path);
        ffmpeg()
            .noVideo()
            .input(absolute_video_filepath)
            .audioFrequency(samplerate)
            .outputOptions("-ac 1")
            .on("end",()=>{
                resolve(audio_destination_path);
            }).on('error',(e)=>{
                reject(e);
            }).save(audio_destination_path)

    });
}
async function transcribe(absolute_video_filepath) {
  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
    const audio_filepath = await convertVideoToAudio(absolute_video_filepath, 20000)


  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(audio_filepath);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 20000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;

}