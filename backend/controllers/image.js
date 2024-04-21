// ---- FUNCTIONS TO LAUNCH SCRIPTS ----
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// FUNCTIONS
exports.isTIFDirectoryExist = (req, res, next) => {

    nameDirectory = req.params.nameDirectory;
  
    absolutePath = path.join(__dirname, `../../images/imagesTIF/${nameDirectory}`);
  
    // console.log(absolutePath);

    let directoryExist;

    try {
        // Vérifier si le chemin correspond à un dossier
        directoryExist = fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isDirectory();
      } catch (error) {
        // Le dossier n'existe pas ou une erreur s'est produite lors de la vérification
        directoryExist = false;
      }

    res.status(200).json({ 'directoryExist': directoryExist });
    
}

exports.isZIPFileAlreadyDownloaded = (req, res, next) => {

    nameDirectory = req.params.nameDirectory;
    nameFile = req.params.nameFile;
  
    absolutePath = path.join(__dirname, `../../images/imagesZIP/${nameDirectory}/${nameFile}`);
  
    // console.log(absolutePath);

    let fileAlreadyDownloaded;

    try {
        // Vérifier si le chemin correspond à un dossier
        fileAlreadyDownloaded = fs.existsSync(absolutePath);
      } catch (error) {
        // Le dossier n'existe pas ou une erreur s'est produite lors de la vérification
        fileAlreadyDownloaded = false;
      }

    res.status(200).json({ 'fileAlreadyDownloaded': fileAlreadyDownloaded, 'absolutePath': absolutePath });
    
}

exports.getNbImagesLocalBetweenDates = (req, res, next) => {

    polygon = req.query.polygon;
    dateStart = req.query.dateStart;
    dateEnd = req.query.dateEnd;

    absolutePath = path.join(__dirname, `../../images/imagesTIF/${nameDirectory}/`);

    
    try {
        // Liste tous les files dans le répertoire
        const files = fs.readdirSync(absolutePath);
    
        // Convertit les dates de début et de fin en objets Date
        const startDate = new Date(dateStart);
        const endDate = new Date(dateEnd);
    
        // Expression régulière pour extraire les parties de date du nom de file
        const regex = /(\d{8})T(\d{6})_(\d{8})T(\d{6})/;
    
        // Compte le nombre de files entre les dates spécifiées
        const count = files.reduce((total, file) => {
          const match = file.match(regex);
          if (match) {
            const startDateFile = new Date(`${match[1].substring(0, 4)}-${match[1].substring(4, 6)}-${match[1].substring(6, 8)}`);
            const endDateFile = new Date(`${match[3].substring(0, 4)}-${match[3].substring(4, 6)}-${match[3].substring(6, 8)}`);
            if (startDateFile >= startDate && endDateFile <= endDate) {
              return total + 1;
            }
          }
          return total;
        }, 0);
    
        res.status(200).json({ 'nbLocalImages': count });

      } catch (error) {

        res.status(500).json({ 'error': 'error while reading the repository' });
      }
}

exports.getListImagesLocalBetweenDates = (req, res, next) => {

    polygon = req.query.polygon;
    dateStart = req.query.dateStart;
    dateEnd = req.query.dateEnd;

    absolutePathFolder = path.join(__dirname, `../../images/imagesTIF/${nameDirectory}/`);

    try {
        // Read all files in the directory
        const files = fs.readdirSync(absolutePathFolder);

        // Convert the start and end dates to Date objects
        const startDate = new Date(dateStart);
        const endDate = new Date(dateEnd);

        const regex = /(\d{8})T(\d{6})_(\d{8})T(\d{6})/;
    
        // Filter files between the specified dates
        const filesBetweenDates = files.filter((file) => {
            const match = file.match(regex);
            if (match) {
                
                const startDateFile = new Date(`${match[1].substring(0, 4)}-${match[1].substring(4, 6)}-${match[1].substring(6, 8)}`);
                const endDateFile = new Date(`${match[3].substring(0, 4)}-${match[3].substring(4, 6)}-${match[3].substring(6, 8)}`);
              
                return startDateFile >= startDate && endDateFile <= endDate;
            }
            return false;
          });

    
        // Array to store file information
        const filesInfo = filesBetweenDates.map((file) => {
            const filePath = path.join(absolutePathFolder, file);
            const match = file.match(regex);
            const startDateFile = new Date(`${match[1].substring(0, 4)}-${match[1].substring(4, 6)}-${match[1].substring(6, 8)}`);
            const endDateFile = new Date(`${match[3].substring(0, 4)}-${match[3].substring(4, 6)}-${match[3].substring(6, 8)}`);
            return {
                name: file,
                date: startDateFile.toISOString().substring(0, 10),
                absolutePath: filePath
            };
        });
    
        // Send the list of files
        res.status(200).json({ files: filesInfo });

      } catch (error) {

        res.status(500).json({ error: 'error while reading the repository' });
      }
}


