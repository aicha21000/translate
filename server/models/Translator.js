// model/Translator.js
const mongoose = require('mongoose');

const translatorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  countryOfResidence: {
    type: String,
    required: true,
  },
  nativeLanguage: {
    type: String,
    required: true,
  },
  workingLanguages: {
    type: [String],
    required: true,
  },
  specializations: {
    type: [String],
    required: true,
  },
  degrees: {
    type: [String],
  },
  isSwornTranslator: {
    type: Boolean,
    default: false,
  },
  swornTranslatorDoc: {
    type: String,
  },
  identificationDoc: {
    type: String,
  },
  missions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Translator = mongoose.model('Translator', translatorSchema);

module.exports = Translator;
