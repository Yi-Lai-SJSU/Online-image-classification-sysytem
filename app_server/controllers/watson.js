var LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
var { IamAuthenticator } = require('ibm-watson/auth');

var languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 't9GqJqUSAfhZBO9F-3TzqgwBlip7iWolMLAj0YCFe4ei',
  }),
  url: 'https://gateway.watsonplatform.net/language-translator/api',
});

var translateParams = {
  text: 'Sorry, May I call you name',
  modelId: 'en-es',
};

module.exports.translatorTest = function(req, res, next) {
    console.log("Testing...");
    languageTranslator.translate(translateParams)
        .then(translationResult => {
        console.log(JSON.stringify(translationResult, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
    });
};
