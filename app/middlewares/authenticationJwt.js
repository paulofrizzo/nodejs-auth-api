const jwt = require("jsonwebtoken")
const config = require("../config/authentication.config.js")

const checkToken = (req, res, next) => {

  const token = extractToken(req)

  if (!token){
    return res.status(403).send({ mensagem: "Não autorizado." })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ mensagem: "Não autorizado." })
    }
    req.userId = decoded.id
    next()
  })
}

const extractToken = (req) => {
  return req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : false
}

const authenticationJwt = {
  checkToken,
  extractToken
}

module.exports = authenticationJwt