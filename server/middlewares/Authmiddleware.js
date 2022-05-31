const {verify} = require("jsonwebtoken")
const { Users } = require("../models")

const validateToken = async (req, res, next) => {
    const accesToken = req.header("accesToken")

    if (!accesToken) return res.json({ error: "Vous n'êtes pas connecté"})

    try {
        const validToken = verify(accesToken, process.env.ACCESS_TOKEN)
        req.user = validToken  //lors de l'authentification, on rend le user accessible dans la requête
        if (validToken) {
            return next()
        }
    } catch (err) {
       return res.sendStatus(401) // si le accessToken n'est plus valide, reponse 401 => interceptor
    }    
}

module.exports = {validateToken}