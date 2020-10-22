const express = require("express")
const bodyParser = require("body-parser")
const db = require("./app/models");

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

db.connect(process.env.environment ? 'test' : 'users')

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao meu teste de API." });
})

app.get('*', function(req, res){
  res.status(404).json({mensagem: "Página não encontrada."});
});

app.post('*', function(req, res){
  res.status(404).json({mensagem: "Página não encontrada."});
});

app.use(function (err, req, res, next) {
  res.status(500).json({mensagem: "Ocorreu um erro no servidor."})
})

const PORT = process.env.PORT || 3000;

module.exports = app.listen(PORT)