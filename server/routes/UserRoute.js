const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

// Route pour l'inscription
router.post('/signup', userController.signUp);

// Route pour la connexion
router.post('/signin', userController.signIn);

// Route pour la suppression de compte
router.delete('/:id', userController.deleteAccount);

// Route pour la modification de données utilisateur
router.put('/:id', userController.updateUserData);



// Route pour récupérer les données de l'utilisateur par ID
router.get('/:id', userController.getUserDataById);

module.exports = router;