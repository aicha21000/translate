
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// ...

const userController = {
  // Fonction pour inscription
  signUp: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ fullName, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  },


    // Fonction pour connexion
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '4h', // Change the expiration time to 4 hours
      });
      res.json({ message: 'Login successful', token, user });
      
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  },

  // Fonction pour suppression de compte
  deleteAccount: async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting account', error });
    }
  },
  
  // Fonction pour modification de mot de passe ou autres données
  updateUserData: async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUserData = req.body;
      await User.findByIdAndUpdate(userId, updatedUserData);
      res.json({ message: 'User data updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user data', error });
    }
  },
  // Function to retrieve user data by ID
  getUserDataById: async (req, res) => {
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

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user data', error });
    }
  },
};



module.exports = userController;