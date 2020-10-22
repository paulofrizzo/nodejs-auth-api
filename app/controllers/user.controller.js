const {authenticationJwt} = require("../middlewares")
const db = require("../models")
const moment = require("moment")
const User = db.usuario;

exports.fetchUser = (req, res) => {
  User.findOne({
    _id: req.params.id
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ mensagem: err });
        return;
      }

      if (!user) {
        return res.status(401).send({ mensagem: "Usuário não encontrado." });
      }

      if(user.token != authenticationJwt.extractToken(req))
        return res.status(401).send({ mensagem: "Não autorizado." });

      if(moment().diff(moment(user.ultimo_login)) > 30)
        return res.status(440).send({ mensagem: "Sessão inválida." });

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