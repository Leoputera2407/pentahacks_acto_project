const workerpool = require('workerpool');

const transcribeAudio = require('./gcp.js');
const kairosAnalyzeVideoEmotion = require('./kairos');
const VokaturiAnalyzeTone = require('./vokaturi');
const convertVideoToAudio = require('./ffmpeg');

workerpool.worker({
    analyzeVideoEmotion : kairosAnalyzeVideoEmotion,
    transcribeAudio : transcribeAudio,
    convertVideoToAudio: convertVideoToAudio,
    analyzeTone: VokaturiAnalyzeTone
})
