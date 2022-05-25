// sequelize nous aide a définir le modèle pour les posts

module.exports = (sequelize, DataTypes) => {
   
    const Posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    // la table Posts est associée avec la table Comments
    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade"  // si Posts est supprimée, les commentaires le sont aussi
        })
    // la table Posts est associée avec la table Likes
        Posts.hasMany(models.Likes, {
            onDelete: "cascade"  // si Posts est supprimée, les likes le sont aussi
        })
    }



    return Posts;
}