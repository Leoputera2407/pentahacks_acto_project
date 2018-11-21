const express = require('express');
let app = express();
let upload = require('express-fileupload');
const path = require('path');
const FILE_UPLOAD_DIR= path.join(__dirname, "uploads");
const fs = require('fs');
if (!fs.existsSync(FILE_UPLOAD_DIR)){
    console.log(FILE_UPLOAD_DIR, "does not exist. Creating it...");
   fs.mkdirSync(FILE_UPLOAD_DIR);
}
app.use(upload()); // configure middleware

app.post('/upload/pitch',function(req, res){
  console.log(req.files);
  if(req.files.upfile){
    let file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    let uploadpath = path.join(FILE_UPLOAD_DIR, name);
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        res.send('Done! Uploading files')
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
})
app.listen(7200);
console.log("app running on 7200");
