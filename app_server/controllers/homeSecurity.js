var fs = require('fs');
var path = require('path');
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

var wastonHandlding = function(images_file_input, cb) {
    console.log("Testing start1...");
    console.log(images_file_input);
    //var images_file= fs.createReadStream('/Volumes/Data/Yi/IBM-Watson/Demo-JS/demo/public/images/cat.jpg');
    var images_file= fs.createReadStream(images_file_input);
    var classifier_ids = ["DefaultCustomModel_1082803435"];
    var threshold = 0.6;

    var params = {
	    images_file: images_file,
	    classifier_ids: classifier_ids,
	    threshold: threshold
    };

    visualRecognition.classify(params, function(err, response) {
        if (err) { 
            console.log(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
            var className = response.images[0].classifiers[0].classes[0].class;
          
            var translateParams = {
              text: className,
              modelId: 'en-es',
            };

            languageTranslator.translate(translateParams)
            .then(translationResult => {
                console.log(JSON.stringify(translationResult, null, 2));
                var transResult = translationResult.result.translations[0].translation;
                console.log("Testing.... Hello...");
                console.log(transResult);

                var synthesizeParams = {
                  text: transResult,
                  accept: 'audio/mp3',
                  voice: 'es-US_SofiaVoice',
                };

                textToSpeech.synthesize(synthesizeParams)
                .then(audio => {
                  console.log("Generate mp3....");
                  var pathOfNewAudio = path.join(__dirname, "../..", "public/audio/" + className + ".mp3");
                  console.log(pathOfNewAudio);
                  console.log("log to mp3 output...");
                  audio.result.pipe(fs.createWriteStream(pathOfNewAudio));
                  //audio.result.pipe(fs.createWriteStream(__dirname + ".." + "public/audio" + className +".mp3"));
                  cb(className);
                })
                .catch(err => {
                  console.log('error:', err);
                });
            })
            .catch(err => {
                console.log('error:', err);
            });
            //Console.log("Waston audio success..............");
        }
    });
};

module.exports.uploadImage = function(req, res) {
  res.render('uploadImage');
};

module.exports.handleImage = function(req, res) {
  console.log(req.file.path);
  var img = fs.readFileSync(req.file.path);
  wastonHandlding(path.join(__dirname, "../..", req.file.path), function(audio_file) {
    console.log("what are you doing?");
    console.log(audio_file);
    //res.send({audo_file:audio_file});
    var pathOfmp3 = "/audio/" + audio_file + ".mp3";
    res.render('result',{audio_file: pathOfmp3});
  });
};


