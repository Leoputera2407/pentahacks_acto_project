const workerpool = require('workerpool');

const {transcribe} = require('./gcp.js');
const kairosAnalyzeVideoEmotion = require('./kairos');


workerpool.worker({
    analyzeVideoEmotion : kairosAnalyzeVideoEmotion,
    transcribe : transcribe,
})
