const speech = require('@google-cloud/speech');
const fs = require('fs');
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || ! process.env.AUDIO_OUTPUT_FREQ){
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS or AUDIO_OUTPUT_FREQ is not defined.");
}
async function transcribeAudio(audio_filepath) {
    // Creates a client
    const client = new speech.SpeechClient();

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(audio_filepath);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    const config = {
        //encoding: '',
        sampleRateHertz: process.env.AUDIO_OUTPUT_FREQ,
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

module.exports = transcribeAudio;

