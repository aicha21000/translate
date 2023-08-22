//TranslatorRoute.js
const express = require('express');
const translatorController = require('../controllers/TranslatorController');
const router = express.Router();
const upload = require('../config/Multer'); // Update the path to the multer configuration file

// Route pour l'inscription

router.post(
  '/signup',
  upload.fields([
    { name: 'swornTranslatorDoc', maxCount: 1 },
    { name: 'identificationDoc', maxCount: 1 },
  ]),
  translatorController.signUp
);

// Route pour la connexion
router.post('/signin', translatorController.signIn);

// Route pour la suppression de compte
router.delete('/:id', translatorController.deleteAccount);

// Route pour la modification de données utilisateur
router.put('/:id', translatorController.updateTranslatorData);

// Route pour récupérer les données de l'utilisateur par ID
router.get('/:id', translatorController.getTranslatorDataById);




module.exports = router;
