//http://localhost:3001/posts/

const express = require("express")
const router = express.Router()
const { Posts, Likes } = require("../models")
const multer = require("../middlewares/multer-config")
const {validateToken} = require ("../middlewares/Authmiddleware")
const fs = require ("fs") // file-system

// findAll() et create() sont des fonctions de sequelize, qui agissent sur MySQL (!! fonctions asynchrones)
router.get("/", validateToken, async (req, res) => {        
    const listOfPosts = await Posts.findAll({ include: [Likes] })  // include nous donne accés aux likes
    const likedPosts = await Likes.findAll({where: { UserId: req.user.id } }) // tous les likes d'un id
    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts })
})

router.get("/byId/:id", async (req,res) => {
    const id = req.params.id
    // sequelize nous permet, grace a findByPk(find by primary key), de trouver la rangée (row) ciblée par l'id
    const post = await Posts.findByPk(id)
    res.json(post)
})

//BYUSERID affiche tous les posts d'un utilisateur
router.get("/byuserId/:id", async (req,res) => {
    const id = req.params.id
    const listOfPosts = await Posts.findAll({
         where: {UserId: id},   //UserId de la base de données MySQL
         include: [Likes]
        })
    res.json(listOfPosts)
})

//POST
router.post("/", validateToken, multer, async (req, res) => {
    const post = (req.body)    //on récupère les data du corps de la requête 
    post.username = req.user.username  // on recupère le username, traduit du token par le middleware
    post.UserId = req.user.id  

    if (req.file)   post.file = (`${req.protocol}://${req.get('host')}/images/${req.file.filename}`) 
   
    await Posts.create(post)   // on insère les données dans la db
    res.json(post)
})

//MODIF TITRE
router.put("/title", validateToken, async (req, res) => {
    const {newTitle, id } = req.body      //on récupère le corps de la requête (data du frontend)
    await Posts.update({ title: newTitle }, { where: { id: id } })   // pour le Post ciblé par le id
    res.json(newTitle)
})

//MODIF TEXTE
router.put("/postText", validateToken, async (req, res) => {
    const {newText, id } = req.body      //on récupère le corps de la requête (data du frontend)
    await Posts.update({ postText: newText }, { where: { id: id } })   // pour le Post ciblé par le id
    res.json(newText)
})

//MODIF DOCUMENT JOINT
router.put("/postDocument", validateToken, async (req, res) => {
    const {newDocument, id } = req.body      //on récupère le corps de la requête (data du frontend)
    await Posts.update({ postDocument: newDocument }, { where: { id: id } })   // pour le Post ciblé par le id
    res.json(newDocument)
})

//SUPPRESSION DE POST
router.delete("/:postId", validateToken, async (req,res) => {
    const postId = req.params.postId
    const post = await Posts.findByPk(postId)
    const filename = post.file.split("/images/")[1]
        if (filename) 
            fs.unlink (`./images/${filename}`, () => { })  
        await Posts.destroy({
            where: {
            id: postId,
            }
        })      
         
      res.json("post supprimé du backend")
    
})

module.exports = router