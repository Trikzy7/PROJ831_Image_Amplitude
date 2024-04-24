// ---- FUNCTIONS TO LAUNCH SCRIPTS ----
const { exec } = require('child_process');
const e = require('express');
const path = require('path');

// AMPLITUDE SCRIPTS
exports.executeAmplitudeScripts = (req, res, next) => {

    username = req.body.username;
    password = req.body.password;
    polygon = req.body.polygon;
    dateStart = req.body.dateStart;
    dateEnd = req.body.dateEnd;
    pathGpt = req.body.pathGpt;
    // listDateMissing = req.body.listDateMissing;

    cmdDownloadScript = `python3.10 ${path.join(__dirname, '../script/download.py')} --username '${username}' --password '${password}' --polygon '${polygon}' --dateStart '${dateStart}' --dateEnd '${dateEnd}' `;

    // Execute download.py
    exec(cmdDownloadScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de download.py : ${error.message}`);
            res.status(500).send({ error: stderr });
            return;
        }

        console.log(stdout);
        let list_path_images_zip = JSON.parse(stdout.replace(/'/g, "\""));

        let list_path_images_zip_str = "";
        list_path_images_zip.forEach((list_path_image) => {
            list_path_images_zip_str = list_path_images_zip_str + list_path_image + " ";
        })


        cmdProcessScript = `python3.10 ${path.join(__dirname, '../script/process.py')} --listPathFilesZip '${list_path_images_zip_str}' --polygon '${polygon}' --pathGpt '${pathGpt}'`;

        // Execute process.py
        exec(cmdProcessScript, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de process.py : ${error.message}`);
                res.status(500).send({ error: 'Erreur lors de l\'exécution de process.py' });
                return;
            }
            console.log('process.py terminé avec succès.');

            let inputtPathTif = path.join(__dirname, `../../images/imagesTIF/${polygon.replace(/\s/g, '_')}`) + '/';
            console.log(inputtPathTif);
            cmdTifToPngScript = `python3.10 ${path.join(__dirname, '../script/tifToPng.py')} --inputPathTif '${inputtPathTif}'`;

            console.log(cmdTifToPngScript)

             // Execute tifToPng.py
            exec(cmdTifToPngScript, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution de tifToPng.py : ${error.message}`);
                    res.status(500).send({ error: 'Erreur lors de l\'exécution de tifToPng.py' });
                    return;
                }
                console.log('tifToPng.py terminé avec succès.');
                res.status(200).send({ message: stdout, completed: true });
            });
        });

    });

}

// MODIFICATION GRAPH AMPLITUDE SCRIPTS
exports.executeModificationGraphAmplitudeScript = (req, res, next) => {
    listeDates = req.body.listeDates;
    outputPathPolygonFolder = req.body.outputPathPolygonFolder;
    coordinates = req.body.coordinates;
    outputPathJsonValue = path.join(__dirname, '../../frontend/src/assets/');

    // cmdDownloadScript = `python3.10 ${path.join(__dirname, '../script/download.py')} --outputPathZip '${outputPathZip}' --username '${username}' --password '${password}' --polygon '${polygon}' --dateStart '${dateStart}' --dateEnd '${dateEnd}' `;
    cmdModifScript = `python3.10 ${path.join(__dirname, '../script/graphAmplitude.py')} --listeDates '${listeDates}' --outputPathJsonValue '${outputPathJsonValue}' --outputPathPolygonFolder '${outputPathPolygonFolder}' --coordinates '${coordinates}'`;

    // Execute d'abord download.py
    exec(cmdModifScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de graphAmplitude.py : ${error.message}`);
            res.status(500).send({error: 'Erreur lors de l\'exécution de graphAmplitude.py'});
            return;
        }
        console.log('graphAmplitude.py terminé avec succès.');
        res.status(200).send({message: 'Scripts modification exécutés avec succès.'});
    });

}


exports.executeAmplitudeProcessAndConvertScript = (req, res, next) => {

    polygon = req.body.polygon;
    pathGpt = req.body.pathGpt;
    listInputPathZip = req.body.listInputPathZip

    let nameFilesZip = listInputPathZip.join(' ');

    outputPathTif = path.join(__dirname, `../../images/imagesTIF/${polygon.replace(/\s/g, '_')}`) + '/';
    pathGraph = path.join(__dirname, `../finalGraph.xml`);


    cmdProcessScript = `python3.10 ${path.join(__dirname, '../script/process.py')} --nameFilesZip '${nameFilesZip}' --polygon '${polygon.toUpperCase()}' --pathGpt '${pathGpt}' --pathGraph '${pathGraph}' --outputPathTif '${outputPathTif}'`;

    console.log(cmdProcessScript);


    // Execute d'abord process.py
    exec(cmdProcessScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de process.py : ${error.message}`);
            res.status(500).send('Erreur lors de l\'exécution de process.py');
            return;
        }

        console.log('process.py terminé avec succès.');
        res.status(200).send({ message: 'Scripts process et process exécutés avec succès.' });

    });




}
