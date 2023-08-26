// AdminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Translator = require('../models/Translator'); // Import Translator model



const AdminController = {
  signUp: async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, password: hashedPassword });
      await newAdmin.save();
      res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } catch (error) {
      res.status(500).json({ message: 'Error registering admin', error });
    }
  },

  signIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '4h', // Change the expiration time to 4 hours
      });
      res.json({ message: 'Login successful', token, admin });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  },
  getPendingOrders: async (req, res) => {
    try {
      const pendingOrders = await Order.find({ status: 'pending' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage');
        
      res.json({ orders: pendingOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending orders', error });
    }
  },
  getValidatedOrders: async (req, res) => {
    try {
      const validatedOrders = await Order.find({ status: 'validated' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage');
        
      res.json({ orders: validatedOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching validated orders', error });
    }
  },
  getCompletedOrders: async (req, res) => {
    try {
      const completedOrders = await Order.find({ status: 'completed' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage');
        
      res.json({ orders: completedOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching completed orders', error });
    }
  },
  getCancelledOrders: async (req, res) => {
    try {
      const cancelledOrders = await Order.find({ status: 'cancelled' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage');

      res.json({ orders: cancelledOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cancelled orders', error });
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
///// test translators 
assignTranslator: async (req, res) => {
  try {
     

      const translators = await Translator.find();
      // Filtrer les traducteurs ayant les langues de travail correspondantes
      const matchedTranslators = translators.filter(translator => 
        translator.nativeLanguage.includes('french')
      );
    
    
      res.json({ message: 'Matching translators found', translators: matchedTranslators });


  } catch (error) {
      res.status(500).json({ message: 'Error fetching translators', error });
  }
},


// // Fonction pour affecter un traducteur à une commande
// assignTranslator: async (req, res) => {
//   try {
//     const { translatorId } = req.body;
//     const { id } = req.params;

//     // Récupérez les informations de la commande
//     const order = await Order.findById(id)
//       .populate('user', 'username')
//       .select('sourceLanguage targetLanguage');

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Récupérez les traducteurs qui ont la langue native correspondante
//     const translators = await Translator.find({ nativeLanguage: order.sourceLanguage });

//     // Filtrer les traducteurs ayant les langues de travail correspondantes
//     const matchedTranslators = translators.filter(translator =>
//       translator.workingLanguages.includes(order.targetLanguage)
//     );

//     if (matchedTranslators.length === 0) {
//       return res.status(404).json({ message: 'No matching translator found' });
//     }

//     // Ici, vous pouvez envoyer les traducteurs correspondants en réponse
//     res.json({ message: 'Matching translators found', translators: matchedTranslators });

//     // ... Autre logique de mise à jour de la commande si nécessaire ...
//   } catch (error) {
//     res.status(500).json({ message: 'Error assigning translator', error });
//   }
// },
// };


  // ... Other admin functions ...

}
module.exports = AdminController;
