//http://localhost:3001/likes

const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/Authmiddleware")

router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;  // req.user qui nous vient du middleware validateToken

  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });
  if (!found) {                                                // si l'utilisateur n'a pas encore liké, il peut le faire
    await Likes.create({ PostId: PostId, UserId: UserId });
    res.json({liked: true});
  } else {                                                      // sinon il peut supprimer son like
    await Likes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    res.json({liked: false});
  }
});

module.exports = router;