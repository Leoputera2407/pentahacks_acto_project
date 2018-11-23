const workerpool = require('workerpool');

const transcribeAudio = require('./gcp.js');
const kairosAnalyzeVideoEmotion = require('./kairos');
const VokaturiAnalyzeTone = require('./vokaturi');
const convertVideoToAudio = require('./ffmpeg');
const createWordCloud = require('./wordCloud');
const calculateConfidenceEnthusiasm = require('./confidenceEnthusiasm');
const calculateDelivery = require('./delivery');

workerpool.worker({
    analyzeVideoEmotion : kairosAnalyzeVideoEmotion,
    transcribeAudio : transcribeAudio,
    convertVideoToAudio: convertVideoToAudio,
    analyzeTone: VokaturiAnalyzeTone,
    createWordCloud : createWordCloud,
    calculateConfidenceEnthusiasm: calculateConfidenceEnthusiasm,
    calculateDelivery :calculateDelivery

})
