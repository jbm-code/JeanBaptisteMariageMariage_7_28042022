//http://localhost:3001/comments

const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/Authmiddleware")

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
   // sequelize va chercher dans la table Comments, le postId
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username   //req.user qui nous vient de validateToken
  comment.username = username // le commentaire contient donc aussi le username
  await Comments.create(comment);
  res.json(comment);
});

// pour supprimer un commentaire, on a besoin d'être connecté
router.delete("/:commentId", validateToken, async (req, res) => {
  console.log(req.params.commentId)
  const commentId = req.params.commentId

  // sequelize supprime le commentaire ciblé dans la base de données
 await Comments.destroy({
    where: {
      id: commentId,
    }
  }) 
  res.json("commentaire supprimé du backend") 
})

module.exports = router;




