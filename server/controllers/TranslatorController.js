// TranslatorController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Translator = require('../models/Translator');
const upload = require('../config/Multer'); // Update the path to the multer configuration file
const Order = require('../models/Order');
const archiver = require('archiver'); // Utilisez la bibliothèque 'archiver' pour créer un fichier ZIP
const fs = require('fs'); // Importez le module 'fs'


const translatorController = {
    // Fonction pour inscription d'un traducteur
    signUp: async (req, res) => {
        try {
            const {
                fullName,
                email,
                password,
                address,
                phoneNumber,
                countryOfResidence,
                nativeLanguage,
                workingLanguages,
                specializations,
                degrees,
                isSwornTranslator,
                swornTranslatorDoc,
                identificationDoc,
            } = req.body;

            const requiredFields = [
                'fullName',
                'email',
                'password',
                'address',
                'phoneNumber',
                'countryOfResidence',
                'nativeLanguage',
            ];

            // Vérification des champs requis
            const missingFields = requiredFields.filter(field => !req.body[field]);
            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Required fields are missing: ${missingFields.join(', ')}` });
            }


            // Vérifier si l'email est déjà utilisé
            const existingTranslator = await Translator.findOne({ email });
            if (existingTranslator) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newTranslator = new Translator({
                fullName,
                email,
                password: hashedPassword,
                address,
                phoneNumber,
                countryOfResidence,
                nativeLanguage,
                workingLanguages,
                specializations,
                degrees,
                isSwornTranslator,
                swornTranslatorDoc: req.files['swornTranslatorDoc'] ? req.files['swornTranslatorDoc'][0].filename : null,
                identificationDoc: req.files['identificationDoc'] ? req.files['identificationDoc'][0].filename : null,
            });

            await newTranslator.save();

            res.status(201).json({ message: 'Translator registered successfully', translator: newTranslator });
        } catch (error) {
            res.status(500).json({ message: 'Error registering translator', error });
        }
    },

    // Fonction pour connexion d'un traducteur
    signIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const translator = await Translator.findOne({ email });

            if (!translator) {
                return res.status(404).json({ message: 'Translator not found' });
            }

            const validPassword = await bcrypt.compare(password, translator.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ translatorId: translator._id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.json({ message: 'Login successful', token, user: translator });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    },

    // Fonction pour récupérer la liste des traducteurs (admin)
    getTranslator: async (req, res) => {
        try {
            const translators = await Translator.find();
            res.json({ translators });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching translators', error });
        }
    },

    // Fonction pour suppression de compte d'un traducteur
    deleteAccount: async (req, res) => {
        try {
            const translatorId = req.params.id;
            await Translator.findByIdAndDelete(translatorId);
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting account', error });
        }
    },

    // Fonction pour mise à jour des données d'un traducteur
    updateTranslatorData: async (req, res) => {
        try {
            const translatorId = req.params.id;
            const updatedTranslatorData = req.body;
            await Translator.findByIdAndUpdate(translatorId, updatedTranslatorData);
            res.json({ message: 'Translator data updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating translator data', error });
        }
    },

    // Function to retrieve user data by ID
    getTranslatorDataById: async (req, res) => {
        try {
            const userId = req.params.id;

            // Récupérer l'ID de l'utilisateur à partir du token JWT
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const authorizedUserId = decodedToken.userId;

            // Vérifier si l'ID autorisé correspond à l'ID demandé
            if (authorizedUserId !== userId) {
                return res.status(403).json({ message: 'Unauthorized access to user data' });
            }

            const user = await Translator.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user data', error });
        }
    },

    getAssignedOrders: async (req, res) => {
        try {
            const assignedOrders = await Order.find({ status: 'assigned' })
                .populate('user', 'username') // Populate the 'user' field with username
                .select('orderNumber sourceLanguage targetLanguage translator status createdAt translator');
            res.json({ orders: assignedOrders });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching assigned orders', error });
        }
    },


    getTranslatorOrders: async (req, res) => {
        try {
            const translatorId = req.params.id;

            // Récupérez les commandes du traducteur en fonction de son ID
            const orders = await Order.find({ translator: translatorId });

            res.json({ orders });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving translator orders', error });
        }
    },




    getClientFiles: async (req, res) => {
        try {
            const userId = req.params.id;
            const orderNumber = req.query.orderNumber; // Récupérez le numéro de commande depuis la requête

            // Recherchez la commande spécifiée par l'ID du traducteur et le numéro de commande
            const order = await Order.findOne({ translator: userId, orderNumber });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Créez un fichier ZIP temporaire
            const archive = archiver('zip');
            const zipFileName = `client-files-${userId}-${orderNumber}.zip`;

            // Ajoutez les fichiers correspondant au nom de fichier de la commande à l'archive
            for (const fileName of order.sendFile) {
                archive.file(`./uploads/${fileName}`, { name: fileName });
            }

            // Passez le fichier ZIP au flux de réponse
            res.attachment(zipFileName);
            archive.pipe(res);

            // Finalisez l'archivage et renvoyez-le
            archive.finalize();

            archive.on('error', function (err) {
                console.error('Erreur d\'archivage :', err);
                res.status(500).json({ message: 'Erreur d\'archivage', error: err });
            });
        } catch (error) {
            console.error('Erreur serveur :', error);
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }








};

module.exports = translatorController;
