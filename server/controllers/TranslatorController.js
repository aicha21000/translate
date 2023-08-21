const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Translator = require('../models/Translator');

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
                swornTranslatorDoc,
                identificationDoc,
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

            res.json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
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
};

module.exports = translatorController;
