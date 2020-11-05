const express = require("express");
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

// Generate token
const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
};

// Registration
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // Verifing duplicate email
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "Usuário já registrado" });
    } else {
      // Hashing password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const data = {
        name,
        email,
        password: hashedPassword
      };
      const user = await User.create(data);
      return res.send({ user, token: generateToken({ id: user.id }) });
    }
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

// Authentication
router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  // User not found
  if (!user) {
    return res.status(400).send({ error: "Usuário não registrado" });
  }
  // Password not found
  else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Senha não registrada" });
  } else {
    user.password = undefined;
    return res.send({ user, token: generateToken({ id: user.id }) });
  }
});

// Forgot password
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Usuário não encontrado" });
    } else {
      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findOneAndUpdate(
        { _id: user.id },
        {
          $set: {
            passwordResetToken: token,
            passwordResetExpires: now
          }
        }
      );

      mailer.sendMail(
        {
          to: email,
          from: "ju.desenvolvimento@gmail.com",
          template: "/mail/auth",
          context: { token }
        },
        err => {
          if (err) {
            return res.status(400).send({ error: "Erro ao enviar email" });
          }
          return res.send();
        }
      );
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Tente novamente. Erro ao enviar email" });
  }
});

router.post("/reset_password", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );
    if (!user) {
      return res.status(400).send({ error: "Usuário não encontrado" });
    } else {
      if (token !== user.passwordResetToken) {
        return res.status(400).send({ error: "Token inválido" });
      }
      const now = new Date();
      if (now > user.passwordResetExpires) {
        return res.status(400).send({ error: "Token expirado. Gere um novo." });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        return res.send();
      }
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Não foi possível resetar sua senha. Tente novamente." });
  }
});

module.exports = app => {
  app.use("/auth", router);
};
