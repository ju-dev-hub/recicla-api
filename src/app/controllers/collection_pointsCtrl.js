const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Product = require("../models/product");
const CollectionPoints = require("../models/collection_points");

const router = express.Router();

router.use(authMiddleware);

// List
router.get("/", async (req, res) => {
  try {
    const collection_points = await CollectionPoints.find().populate([
      "user",
      "products"
    ]);
    return res.send({ collection_points });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao buscar a lista de pontos de coleta" });
  }
});

// List by id
router.get("/:collectionId", async (req, res) => {
  try {
    const collectionPoint = await CollectionPoints.findById(
      req.params.collectionId
    ).populate(["user", "products"]);
    return res.send({ collectionPoint });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao buscar o ponto de coleta" });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const {
      regional,
      neighborhood,
      street,
      number,
      referencePoint,
      products
    } = req.body;

    const collectionPoint = await CollectionPoints.create({
      regional,
      neighborhood,
      street,
      number,
      referencePoint,
      user: req.userId
    });

    const productItem = new Product({
      ...products,
      collectionPoint: collectionPoint._id
    });

    await productItem.save();

    await collectionPoint.products.push(productItem);

    await collectionPoint.save();

    return res.send({ collectionPoint });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao criar o ponto de coleta" });
  }
});

// Update
router.put("/:collectionId", async (req, res) => {
  try {
    const {
      regional,
      neighborhood,
      street,
      number,
      referencePoint,
      products
    } = req.body;

    const collectionPoint = await CollectionPoints.findByIdAndUpdate(
      req.params.collectionId,
      {
        regional,
        neighborhood,
        street,
        number,
        referencePoint
      },
      { new: true }
    );

    if (collectionPoint && collectionPoint.products) {
      collectionPoint.products = [];
      await Product.deleteMany({ collectionPoint: collectionPoint._id });
    }
    const productItem = new Product({ ...products, products: products._id });

    await productItem.save();

    await collectionPoint.products.push(productItem);

    await collectionPoint.save();

    return res.send({ collectionPoint });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao atualizar o ponto de coleta" });
  }
});

// Delete
router.delete("/:collectionId", async (req, res) => {
  try {
    await CollectionPoints.findByIdAndDelete(req.params.collectionId);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao deletar o ponto de coleta" });
  }
});

module.exports = app => {
  app.use("/collection_points", router);
};
