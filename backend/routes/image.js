// ---- ROUTES TO LAUNCH SCRIPTS ----

const express = require('express');
const imageCtrl = require('../controllers/image');
const router = express.Router();

router.get('/is-tif-directory-exist/:nameDirectory', imageCtrl.isTIFDirectoryExist);
router.get('/is-zip-file-already-downloaded/:nameDirectory/:nameFile', imageCtrl.isZIPFileAlreadyDownloaded);
router.get('/nb-local-images-between-dates', imageCtrl.getNbImagesLocalBetweenDates);
router.get('/list-local-images-between-dates', imageCtrl.getListImagesLocalBetweenDates);

module.exports = router;