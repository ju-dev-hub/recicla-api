const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "O token não foi informado" });
  } else {
    const parts = authHeader.split(" ");

    if (!parts.length === 2) {
      return res.status(401).send({ error: "Token inválido" });
    }
    const [basic, token] = parts;

    if (!/^Basic$/.test(basic)) {
      return res.status(401).send({ error: "Token fora do padrão" });
    }
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ error: "Token inválido" });
      } else {
        req.userId = decoded.id;
        return next();
      }
    });
  }
};
