const express = require('express');
let app = express();
let upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const uuid = require('uuid');
const workerpool = require('workerpool');
const WSevents = require('./websocketEvents');
const {emitEvent} = require('./socket');
require("dotenv").config({ path: path.join(__dirname, "settings.env") });
const {initSocketIoServer,socketClientMap,map} = require('./socket');
const FILE_UPLOAD_DIR= path.join(__dirname, "uploads");

if (!fs.existsSync(FILE_UPLOAD_DIR)){
    console.log(FILE_UPLOAD_DIR, "does not exist. Creating it...");
   fs.mkdirSync(FILE_UPLOAD_DIR);
}
const pool = workerpool.pool(path.join(__dirname, "workers.js"), {
    minWorkers: "max"
});


app.use(upload()); // configure middleware
const server = app.listen(7200);
console.log("app running on 7200");

initSocketIoServer(server);

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
          console.log("Appjs map : ",map);
          res.status(200).send(connectionID);
          //TODO : spawn workers here.
          Promise.all([
              (async ()=>{
                  const data = await pool.exec("transcribe",[uploadpath]);
                  emitEvent(connectionID, WSevents.GCP_TTS_FINISH)
                  return(data);
              })(),
              (async ()=>{
                  const data = await pool.exec("analyzeVideoEmotion",[uploadpath]);
                  emitEvent(connectionID, WSevents.KAIROS_VIDEO_EMOTION_FINISH)
                  return(data);
              })(),
          ]).then((data)=>{
              console.log(data[0]);
              console.log(data[1]);

          })
      }
    });
  }
  else {
    res.status(404).send("No File selected !");
    res.end();
  };
})


