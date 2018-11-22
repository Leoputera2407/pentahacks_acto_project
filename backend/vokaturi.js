const fs = require('fs');
const child_process = require("child_process");

if ( !process.env.VOKATURI_EXECUTABLE){
    throw new Error ("VOKATURI_EXECUTABLE env var not defined.")
}

const VokaturiAnalyzeTone = async (absolute_audiopath) => {
    const FILEPATH = absolute_audiopath;

    var spawn = child_process.spawn; 
    var process = spawn('python3', [process.env.VOKATURI_EXECUTABLE, FILEPATH]);

    process.stderr.on('data', (data)=>{
        console.error("FIND ERR TING", data.toString);
    })

    process.stdout.on('close', (result) => {
        //TODO: Fire websocket
        return (result);
    })
}

module.exports = VokaturiAnalyzeTone;



