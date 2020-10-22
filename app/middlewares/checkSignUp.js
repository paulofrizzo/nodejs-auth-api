const db = require("../models")
const Usuario = db.usuario

const checkEmail = (req, res, next) => {
    Usuario.findOne({
            email: req.body.email
        }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }

        if (user) {
            res.status(400).send({ message: "E-mail já existente." })
            return
        }

        next()

    })
}
  
const checkSignUp = {
    checkEmail
}
  
module.exports = checkSignUp

