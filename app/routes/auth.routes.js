const {checkSignUp} = require("../middlewares")
const {checkContentType} = require("../middlewares")
const controller = require("../controllers/authentication.controller")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.post(
    "/api/auth/signup",
    [checkContentType.checkJson, checkSignUp.checkEmail],
    controller.signup
  )

  app.post("/api/auth/signin", controller.signin)
}