const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

mongoose.connect('mongodb://localhost/user', { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })

mongoose.Promise = global.Promise

module.exports = mongoose