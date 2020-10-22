const checkJson = (req, res, next) => {
    if(!req.is('application/json')){
        return res.status(400).send({ message: "Content Type não suportado pela aplicação." })
    }

    next()
}
  
const checkContentType = {
    checkJson
}
  
module.exports = checkContentType

