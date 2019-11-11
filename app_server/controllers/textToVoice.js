var fs = require('fs');
var TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
var { IamAuthenticator } = require('ibm-watson/auth');

var textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: 'vIDCpF0OnYlph3aR_IQRlc4ywPT8s668MBFlWkZQDRCK',
  }),
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
});

var synthesizeParams = {
  text: 'Hello world',
  accept: 'audio/mp3',
  voice: 'en-US_AllisonVoice',
};

module.exports.textToVoice = function(req, res, next) {
    console.log("test...");
    textToSpeech.synthesize(synthesizeParams)
      .then(audio => {
          audio.result.pipe(fs.createWriteStream('hello_world1.mp3'));
      })
      .catch(err => {
        console.log('error:', err);
      });
};
