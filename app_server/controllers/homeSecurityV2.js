var fs = require('fs');
var { IamAuthenticator } = require('ibm-watson/auth');
var VisualRecognitionV3  = require('watson-developer-cloud/visual-recognition/v3');
var LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
var TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');

//Visual Recognition:
var visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'GXlyu2BkwWb_TdARHOuIHniRexL1KeIdCgARtCgoGwMU'
});

//Translator
var languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 't9GqJqUSAfhZBO9F-3TzqgwBlip7iWolMLAj0YCFe4ei',
  }),
  url: 'https://gateway.watsonplatform.net/language-translator/api',
});

//TextToSpeech
var textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: 'vIDCpF0OnYlph3aR_IQRlc4ywPT8s668MBFlWkZQDRCK',
  }),
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
});

// var synthesizeParams = {
//   text: 'Hello world, what is your name?',
//   accept: 'audio/mp3',
//   voice: 'en-US_AllisonVoice',
// };

// var translateParams = {
//     text: 'hello, what is your name?',
//     modelId: 'en-es',
// };

var images_file= fs.createReadStream('/Volumes/Data/Yi/IBM-Watson/Demo-JS/demo/public/images/1024px-Beagle_1.jpg');
var classifier_ids = ["DefaultCustomModel_1082803435"];
var threshold = 0.6;

var params = {
	images_file: images_file,
	classifier_ids: classifier_ids,
	threshold: threshold
};

module.exports.homeSecurityV2 = function(req, res, next) {
    console.log("Testing start1...");
    visualRecognition.classify(params, function(err, response) {
        if (err) { 
            console.log(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
            var className = response.images[0].classifiers[0].classes[0].class;
            
            var synthesizeParams = {
              text: className,
              accept: 'audio/mp3',
              voice: 'en-US_AllisonVoice',
            };

            var translateParams = {
              text: className,
              modelId: 'en-es',
            };

            languageTranslator.translate(translateParams)
            .then(translationResult => {
                console.log(JSON.stringify(translationResult, null, 2));
            })
            .catch(err => {
                console.log('error:', err);
            });

            textToSpeech.synthesize(synthesizeParams)
            .then(audio => {
                audio.result.pipe(fs.createWriteStream('dog.mp3'));
            })
            .catch(err => {
                console.log('error:', err);
             });
            res.render();
        }
    });
};
