// sequelize nous aide a définir le modèle pour les likes

module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define("Likes");
  
    return Likes;
  };