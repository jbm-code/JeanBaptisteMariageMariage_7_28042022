
// multer permet de capturer les iamges via une requête http
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// on enregistre sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images') // null = pas d'erreur, définition du dossier destination
      },
    filename: (req, file, callback) => {
          const name = file.originalname.split(' ').join('_'); // remplace les espaces par des "_"
          const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('file') //single capture un type de fichier