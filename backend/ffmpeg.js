const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
if (! process.env.AUDIO_OUTPUT_FREQ){
    throw new Error("ffmpeg: AUDIO_OUTPUT_FREQ env var not defined.");
}
function convertVideoToAudio(absolute_video_filepath){
    console.log("ffmpeg convert video to audio called..")
    const samplerate = process.env.AUDIO_OUTPUT_FREQ; //opus. CAn also check by doing  ffmpeg -format
    //https://cloud.google.com/speech-to-text/docs/encoding
    return new Promise((resolve,reject)=>{
        const audio_destination_path = path.join(
            path.dirname(absolute_video_filepath),
            `${path.basename(absolute_video_filepath).split('.')[0]}.wav`
        );
        console.log("Destination: ",audio_destination_path);
        ffmpeg()
            .noVideo()
            .input(absolute_video_filepath)
            .audioFrequency(samplerate)
            //.audioCodec("opus") //16000 amr wb
            //.outputOptions("-f opus")
            .outputOptions("-ac 1")
            .on("end",()=>{
                resolve(audio_destination_path);
            }).on('error',(e)=>{
            reject(e);
        }).save(audio_destination_path)

    });
}
module.exports = convertVideoToAudio;
