const mongoose = require("mongoose")

const Usuario = mongoose.model(
  "Usuario",
  new mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    telefones: Array,
    data_criacao: { type: Date, default: Date.now },
    data_atualizacao: { type: Date, default: Date.now },
    ultimo_login: { type: Date },
    token: String,
    uuid: String,
    telefones: [
      {
        ddd: Number,
        telefone: Number
      }
    ]
  })
)

module.exports = Usuario