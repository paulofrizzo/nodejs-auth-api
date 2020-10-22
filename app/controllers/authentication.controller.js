const config = require("../config/authentication.config")
const db = require("../models")
const { uuid } = require('uuid')
const moment = require("moment")
const User = db.usuario;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    _id: uuid,
    nome: req.body.nome,
    email: req.body.email,
    telefones: req.body.telefones,
    senha: bcrypt.hashSync(req.body.senha, 8)
  });

  var token = jwt.sign({ id: user.id }, config.secret);
  user.token = token
  
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ mensagem: err });
      return;
    }else{
      res.status(201).send({
        id: user._id,
        nome: user.nome,
        email: user.email,
        data_criacao: user.data_criacao,
        data_atualizacao: user.data_atualizacao,
        telefones: user.telefones,
        ultimo_login: user.ultimo_login,
        token: user.token
      });
    }
  });
}

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ mensagem: err });
        return;
      }

      if (!user) {
        return res.status(401).send({ mensagem: "Usuário e/ou senha inválidos." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.senha,
        user.senha
      );

      if (!passwordIsValid) {
        return res.status(401).send({ mensagem: "Usuário e/ou senha inválidos." });
      }

      user.ultimo_login = moment()
      user.save()

      res.status(200).send({
        id: user._id,
        nome: user.nome,
        email: user.email,
        data_criacao: user.data_criacao,
        data_atualizacao: user.data_atualizacao,
        ultimo_login: user.ultimo_login,
        token: user.token
      });
    });
}