// config/multer.js
const multer = require('multer');
const path = require('path');

// Définir les options pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Indiquer le dossier de destination pour les fichiers téléchargés
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique en ajoutant un timestamp au nom d'origine
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname);
  },
});

// Créer un objet multer avec les options de stockage
const upload = multer({ storage: storage });

module.exports = upload;
