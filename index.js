const express = require('express')
const consign = require('consign')
const db = require('./config/db')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.db = db

consign()
    .include('./config/middlewares.js')
    .then("./api/validator.js")
    .then("./api")
    .then("./config/router.js")
    .into(app)

module.exports = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})