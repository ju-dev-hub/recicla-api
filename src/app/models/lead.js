const mongoose = require("../../database/index");

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uppercase: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: true
  },
  contactPreference: {
    type: Object,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lead = mongoose.model("Lead", LeadSchema);

module.exports = Lead;
