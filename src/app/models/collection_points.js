const mongoose = require("../../database/index");

const CollectionPointsSchema = new mongoose.Schema({
  regional: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  referencePoint: {
    type: String,
    required: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CollectionPoints = mongoose.model(
  "CollectionPoints",
  CollectionPointsSchema
);

module.exports = CollectionPoints;
