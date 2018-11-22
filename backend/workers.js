const workerpool = require('workerpool');

const {transcribe} = require('./gcp.js');
const kairosAnalyzeVideoEmotion = require('./kairos');
const VokaturiAnalyzeTone = require('./vokaturi');


workerpool.worker({
    analyzeVideoEmotion : kairosAnalyzeVideoEmotion,
    transcribe : transcribe,
    analyzeTone: VokaturiAnalyzeTone
})
