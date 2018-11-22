const path = require('path')
const child_process = require("child_process");
require("dotenv").config({ path: path.join(__dirname, "settings.env") });
if ( !process.env.VOKATURI_EXECUTABLE){
    throw new Error ("VOKATURI_EXECUTABLE env var not defined.")
}

VOKATURI_EXECUTABLE = process.env.VOKATURI_EXECUTABLE;
const VokaturiAnalyzeTone = (absolute_audiopath) => {
    return new Promise((resolve,reject)=>{
        const FILEPATH = absolute_audiopath;

        var spawn = child_process.spawn;
        var process = spawn('python3', [VOKATURI_EXECUTABLE, FILEPATH],
            {
                cwd: path.dirname(VOKATURI_EXECUTABLE)
            });

        process.stderr.on('data', (data)=>{
            console.error("FIND ERR TING", data.toString);
        })
        let STDOUT = "";
        process.stdout.on('data', (chunk) => {
            STDOUT += chunk;
        });
        process.stdout.on('close', (err) => {
            if (err){
                reject(err);
            }
            resolve(STDOUT);
        })
    });
}

module.exports = VokaturiAnalyzeTone;



