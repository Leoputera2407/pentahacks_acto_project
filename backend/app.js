const express = require('express');
let app = express();
let upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const uuid = require('uuid');
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
    let uploadpath = path.join(FILE_UPLOAD_DIR, name);
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.sendStatus(500);
      }
      else {
        console.log("File Uploaded",name);
          const connectionID = uuid();
          socketClientMap.set(connectionID, null);
          res.status(200).send(connectionID);
      }
    });
  }
  else {
    res.status(404).send("No File selected !");
    res.end();
  };
})

