const express = require('express');
const translatorController = require('../controllers/TranslatorController');
const router = express.Router();

// Route pour l'inscription
router.post('/signup', translatorController.signUp);

// Route pour la connexion
router.post('/signin', translatorController.signIn);

// Route pour la suppression de compte
router.delete('/:id', translatorController.deleteAccount);

// Route pour la modification de données utilisateur
router.put('/:id', translatorController.updateTranslatorData);

module.exports = router;
