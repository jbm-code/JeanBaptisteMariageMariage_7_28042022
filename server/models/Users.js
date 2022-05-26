// sequelize nous aide a définir le modèle pour les users

module.exports = (sequelize, DataTypes) => {
   
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    // la table Users est associée avec la table Likes et la table Posts
    Users.associate = (models) => {
        Users.hasMany(models.Likes, {
            onDelete: "cascade"  // si Users est supprimée, les Likes le sont aussi
        })
        Users.hasMany(models.Posts, {  
            onDelete: "cascade"  // si Users est supprimé, les posts le sont aussi
        })
    }

    return Users;

}