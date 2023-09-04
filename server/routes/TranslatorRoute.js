//TranslatorRoute.js
const express = require('express');
const translatorController = require('../controllers/TranslatorController');
const router = express.Router();
const upload = require('../config/Multer'); // Update the path to the multer configuration file
const archiver = require('archiver'); // Utilisez la bibliothèque 'archiver' pour créer un fichier ZIP


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

// Route translators
router.get('/', translatorController.getTranslator);


// Route to get validated orders
router.get('/orders/assigned', translatorController.getAssignedOrders);

// Route pour récupérer les commandes du traducteur par son ID
router.get('/:id/orders', translatorController.getTranslatorOrders);



// Route for fetching client files
router.get('/:id/client-files', translatorController.getClientFiles);






module.exports = router;
