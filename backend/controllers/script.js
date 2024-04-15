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
  
    // pathGpt = req.body.pathGpt;
    // pathGraph = req.body.pathGraph;
    // outputPathTif = req.body.outputPathTif;
  
    cmdDownloadScript = `python3.10 ${path.join(__dirname, '../script/download.py')} --outputPathZip '${outputPathZip}' --username '${username}' --password '${password}' --polygon '${polygon}' --dateStart '${dateStart}' --dateEnd '${dateEnd}' `;
    // cmdPxrocessScript = `python3.10 ${path.join(__dirname, '../script/process.py')} --pathGpt '${pathGpt}' --pathGraph '${pathGraph}' --outputPathTif '${outputPathTif}'`;
    
    // Execute d'abord download.py
    exec(cmdDownloadScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de download.py : ${error.message}`);
            res.status(500).send('Erreur lors de l\'exécution de download.py');
            return;
        }
        console.log('download.py terminé avec succès.');
        res.status(200).send('Scripts exécutés avec succès.');
        
        // Ensuite, exécutez process.py
        // exec('python3 process.py', (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`Erreur lors de l'exécution de process.py : ${error.message}`);
        //         res.status(500).send('Erreur lors de l\'exécution de process.py');
        //         return;
        //     }
        //     console.log('process.py terminé avec succès.');
        //     res.status(200).send('Scripts exécutés avec succès.');
        // });
    });
  
    
  }