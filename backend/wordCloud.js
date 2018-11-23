
module.exports = (sentenceString)=>{
    const words = sentenceString.split(" ");
    let dict = {};
    words.forEach((word)=>{
        if(dict[word]){
            dict[word]++;
        }else{
            dict[word] = 1;
        }
    })
    return dict;
}