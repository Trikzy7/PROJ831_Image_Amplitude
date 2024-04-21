// ---- FUNCTIONS TO LAUNCH SCRIPTS ----
const { exec } = require('child_process');
const path = require('path');

// AMPLITUDE SCRIPTS
exports.executeAmplitudeScripts = (req, res, next) => {

    outputPathZip = req.body.outputPathZip;
    username = req.body.username;
    password = req.body.password;
    polygon = req.body.polygon;
    dateStart = req.body.dateStart;
    dateEnd = req.body.dateEnd;
  
    pathGpt = req.body.pathGpt;
    pathGraph = req.body.pathGraph;
    outputPathTif = req.body.outputPathTif;
  
    cmdDownloadScript = `python3.10 ${path.join(__dirname, '../script/download.py')} --outputPathZip '${outputPathZip}' --username '${username}' --password '${password}' --polygon '${polygon}' --dateStart '${dateStart}' --dateEnd '${dateEnd}' `;
    cmdProcessScript = `python3.10 ${path.join(__dirname, '../script/process.py')} --outputPathZip '${outputPathZip}' --polygon '${polygon}' --pathGpt '${pathGpt}' --pathGraph '${pathGraph}' --outputPathTif '${outputPathTif}'`;
    // python3.10 process.py --outputPathZip '/Users/mathieu/Etudes/IDU4/S8/Projet_IDU/imagesZip/' --polygon 'POLYGON((6.0502 45.7566,6.2397 45.7566,6.2397 45.9662,6.0502 45.9662,6.0502 45.7566))' --pathGpt "/Applications/snap/bin/gpt" --pathGraph "/Users/mathieu/Etudes/IDU4/S8/Projet_IDU/finalGraphTest.xml" --outputPathTif "/Users/mathieu/Etudes/IDU4/S8/Projet_IDU/imageTif/"


    // Execute d'abord download.py
    exec(cmdDownloadScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de download.py : ${error.message}`);
            res.status(500).send('Erreur lors de l\'exécution de download.py');
            return;
        }
        console.log('download.py terminé avec succès.');
        
        // Ensuite, execute process.py
        exec(cmdProcessScript, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de process.py : ${error.message}`);
                res.status(500).send('Erreur lors de l\'exécution de process.py');
                return;
            }
            console.log('process.py terminé avec succès.');
            res.status(200).send('Scripts download et process exécutés avec succès.');
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
            res.status(500).send('Erreur lors de l\'exécution de graphAmplitude.py');
            return;
        }
        console.log('graphAmplitude.py terminé avec succès.');
        res.status(200).send('Scripts modification exécutés avec succès.');
    });


}

  