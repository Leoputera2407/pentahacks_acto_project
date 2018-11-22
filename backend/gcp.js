const speech = require('@google-cloud/speech');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS){
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not defined.");
}
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

module.exports = {
    transcribe: transcribe

}