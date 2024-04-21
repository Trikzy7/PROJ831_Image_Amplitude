// ---- ROUTES TO LAUNCH SCRIPTS ----

const express = require('express');
const scriptCtrl = require('../controllers/script');
const router = express.Router();

router.post('/execute-amplitude-scripts', scriptCtrl.executeAmplitudeScripts);
router.post('/execute-modification-graph-amplitude-script', scriptCtrl.executeModificationGraphAmplitudeScript);
router.post('/execute-amplitude-process-convert-scripts', scriptCtrl.executeAmplitudeProcessAndConvertScript);

module.exports = router;