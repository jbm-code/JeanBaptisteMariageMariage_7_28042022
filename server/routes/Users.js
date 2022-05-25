//http://localhost:3001/auth

const express = require("express")
const router = express.Router()
const { Users } = require("../models")
const alert =require("alert")

// bcrypt nous permet de hasher les mots de passe (le chemin inverse n'est pas possible)
const bcrypt = require("bcrypt")
const { validateToken } = require("../middlewares/Authmiddleware")
const jwt = require("jsonwebtoken")
const { sign } = require("jsonwebtoken")
const { verify } = require("jsonwebtoken")
require('dotenv').config()

// REGISTRATION
router.post("/", async (req, res) => {
    const { username, password } = req.body
    const user = await Users.findOne({ where: { username: username } })
    if (!user) {
        bcrypt.hash(password, 10).then((hash) => {
            Users.create({  // on enregistre le username et le hash dans la base de donnée
                username: username,
                password: hash
            })
            res.json("utilisateur enregistré")
        }) 
    } else {
        res.json({error: "l'utilisateur existe déja !"})
    }
})

// LOGIN 
router.post("/login", async (req, res) => {
        const { username, password } = req.body
        // sequelize va chercher trouver le username dans la base de donnée
        const user = await Users.findOne({ where: { username: username } })

        if (!user) 
        return res.json({ error: "l'utilisateur n'existe pas" })

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) 
            return res.json({ error: "le mot de passe n'est pas valide" })

            const accesToken = sign({ username: user.username, id: user.id },
                process.env.ACCESS_TOKEN, { expiresIn: "24h" }
            )
            const refreshToken = sign({ username: user.username, id: user.id },
                process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y" }
            )
            res.json({
                accessToken: accesToken,
                tokenExpireIn: "24h",
                refreshToken: refreshToken,
                refreshTokenExpireIn: "1 Year",
                username: username,
                id: user.id
            })
        })
})

//VERIF DU REFRESH TOKEN , PUIS CREATION NOUVEL ACCESS TOKEN
router.post("/refreshToken", async (req, res) => {
    const refreshToken = req.body.refresh_token
    if (!refreshToken) {
        res.json({ error: "Vous n'êtes pas connecté" })
    }
    //on récupère l'utilisateur grace a jsw.verify
    const verifUser = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const username = verifUser.username
    //on vérifie le validité dans la bdd
    const user = await Users.findOne({ where: { username: username } })
    if (!user)
        res.json({ error: "l'utilisateur n'est pas enregistré" })
    //on créé un nouvel accessToken
    const NewAccessToken = sign({ username: user.username, id: user.id },
        process.env.ACCESS_TOKEN, { expiresIn: "24h" })
    const NewRefreshToken = sign({ username: user.username, id: user.id },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y" })
    res.json({
        accessToken: NewAccessToken,
        refreshToken: NewRefreshToken
    })
})

// AUTHCONTEXT va chercher automatiquement a identifier l'utilisateur, validateToken nous fournit le user
router.get("/authUser", validateToken, (req, res) => {
    res.json(req.user)
})

//BASICINFO page profile d'un utilisateur
router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id
    // sequelize nous permet, grace a findByPk(find by primary key), de trouver la rangée (row) ciblée par l'id
    const basicInfo = await Users.findByPk(id, {
        attributes: { exclude: ["password"] }
    })
    res.json(basicInfo)
})

//SUPPRESSION DE USER
router.delete("/basicinfo/:id", validateToken, async (req, res) => {
    const userId = req.params.id
    // même principe que pour comments, sequelize supprime le user ciblé dans la base de données
    await Users.destroy({
        where: {
            id: userId,
        }
    })
    res.json("utilisateur supprimé du backend")
})

module.exports = router