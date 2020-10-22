const mongoose = require('mongoose')
dbConfig = require("../config/database.config")

mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
db.usuario = require("./usuario.model")
db.connect = (database) => mongoose
    .connect(`mongodb+srv://${dbConfig.HOST}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Conexão efetuada com o MongoDB.")
    })
    .catch(err => {
        console.error("Não foi possível conectar com a base de dados", err)
        process.exit()
})

module.exports = db