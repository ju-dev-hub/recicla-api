const express = require("express");
const router = express.Router();

const Lead = require("../models/lead");

// Cotation
router.post("/cotation", async (req, res) => {
  const { name, email, phone, cnpj, contactPreference } = req.body;
  try {
    const data = {
      name,
      email,
      phone,
      cnpj,
      contactPreference
    };
    const lead = await Lead.create(data);
    return res.send({ lead });
  } catch (err) {
    return res.status(400).send({ error: "Falha ao salvar os dados" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(["lead"]);
    res.header("Access-Control-Allow-Origin", "*");
    return res.send({ lead });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao buscar o lead" });
  }
});

module.exports = app => {
  app.use("/", router);
};
