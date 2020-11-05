const nodemailer = require("nodemailer")
const path = require("path")
const {host, port, user, pass} = require("../config/mail.json")
const hbs = require("nodemailer-express-handlebars")

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: 'src/resources',
      layoutsDir: 'src/resources/mail',
      defaultLayout: 'auth.hbs',
    },
    viewPath: 'src/resources',
    extName: '.hbs',
  };

  transport.use("compile", hbs(handlebarOptions))

  module.exports = transport