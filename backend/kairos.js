const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
if ((!process.env.KAIROS_APP_ID) || (!process.env.KAIROS_APP_KEY)){
    throw new Error("KAIROS_APP_ID or KAIROS_APP_KEY is not defined.");
}

/* Returns a json string (NOT json object.)*/
const kairosAnalyzeVideoEmotion = (absolute_videopath)=>{
    return new Promise((resolve,reject)=>{
        const FILEPATH= absolute_videopath
        const form = new FormData();
        const blob = fs.createReadStream(FILEPATH);
        form.append("source", blob);
        fetch(`https://api.kairos.com/v2/media?landmark=1&timeout=30`, {
            method: 'POST',
            headers: {
                "app_id": process.env.KAIROS_APP_ID,
                "app_key": process.env.KAIROS_APP_KEY,
            },
            body: form
        }).then((data)=>{
            data.text().then((t)=>{
                resolve(t);
            })
        }).catch((e)=>{
            reject(e);
        })
    });
}
module.exports = kairosAnalyzeVideoEmotion;
