var express = require('express');
var router = express.Router();
//var ctrlMain = require('../app_server/controllers/watson');
var ctrlMain = require('../app_server/controllers/homeSecurity');
//var ctrlMain = require('../app_server/controllers/textToVoice');

//////////
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
//////////////
var upload = multer({ storage: storage });
//router.get('/watson', ctrlMain.translatorTest);
//router.get('/homeSecurityTest',ctrlMain.homeSecurity);
//router.get('/homeSecurity',ctrlMain.homeSecurity);
//router.get('/uploadImage', ctrlMain.uploadImage);
router.post('/upload/photo', upload.single('myImage'), ctrlMain.handleImage);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //result = "(" + "hhhhh" + ")";
  //res.getWriter.write(result);
});

module.exports = router;
