const mongoose = require("../../database/index");

const ProductSchema = new mongoose.Schema({
  glass: {
    isActive: {
      type: Boolean,
      require: true,
      default: true
    },
    equipament: [
      {
        type: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  },
  paper: {
    isActive: {
      type: Boolean,
      require: true,
      default: true
    },
    equipament: [
      {
        type: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  },
  plastic: {
    isActive: {
      type: Boolean,
      require: true,
      default: true
    },
    equipament: [
      {
        type: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  },
  metal: {
    isActive: {
      type: Boolean,
      require: true,
      default: true
    },
    equipament: [
      {
        type: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  },
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

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
