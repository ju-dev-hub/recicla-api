const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Product = require("../models/product");

const router = express.Router();

router.use(authMiddleware);

// List
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate(["user"]);
    return res.send({ products });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao buscar a lista de produtos" });
  }
});

// List by id
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(["user"]);
    return res.send({ product });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao buscar o produto" });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const products = await Product.create(req.body, { user: req.userId });

    return res.send({ products });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao criar o produto" });
  }
});

// Update
router.put("/:productId", async (req, res) => {
  try {
    const { glass, paper, plastic, metal } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        glass,
        paper,
        plastic,
        metal,
        user: req.userId
      },
      { new: true }
    );

    await product.save();

    return res.send({ product });
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: "Erro ao atualizar o produto" });
  }
});

// Delete
router.delete("/:productId", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao deletar o produto" });
  }
});

module.exports = app => {
  app.use("/products", router);
};
