// ---- ROUTES TO LAUNCH SCRIPTS ----

const express = require('express');
const scriptCtrl = require('../controllers/script');
const router = express.Router();

router.post('/execute-amplitude-scripts', scriptCtrl.executeAmplitudeScripts);

module.exports = router;