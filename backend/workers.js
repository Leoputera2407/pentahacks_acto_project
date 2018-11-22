const workerpool = require('workerpool');
let {socketClientMap} = require('./socket');
const WSevents = require('./websocketEvents');

const {transcribe} = require('./gcp.js');
const kairosAnalyzeVideoEmotion = require('./kairos');

const transcribeAudio = (path, clientID)=>{
    return new Promise((resolve,reject)=>{
        transcribe(path).then((transcription)=>{
            socketClientMap.get(clientID).emit(WSevents.GCP_TTS_FINISH);
            resolve(transcription);
        }).catch((e)=>reject(e));
    });
}
const AVE = (path, clientID)=> {
    return new Promise((resolve,reject)=>{
        kairosAnalyzeVideoEmotion(path).then((result)=>{
            socketClientMap
                .get(clientID)
                .emit(WSevents.KAIROS_VIDEO_EMOTION_FINISH);
            resolve(result);
        }).catch((e)=>reject(e));
    });
}

workerpool.worker({
    analyzeVideoEmotion : AVE,
    transcribe : transcribeAudio,
})
