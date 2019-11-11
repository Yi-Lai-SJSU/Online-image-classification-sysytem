var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/watson');
router.get('/waston', ctrlMain.translatorTest);