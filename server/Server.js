const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/Database');
const userRoute = require('./routes/UserRoute');
const translatorRoute = require('./routes/TranslatorRoute');
const orderRoute = require('./routes/OrderRoute');
const adminRoute = require('./routes/AdminRoute');
const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

// Utilisation du fichier UserRoute.js pour gérer les routes des utilisateurs
app.use('/api/users', userRoute);
app.use('/api/translators', translatorRoute);
app.use('/api/orders', orderRoute);
app.use('/api/admin', adminRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
