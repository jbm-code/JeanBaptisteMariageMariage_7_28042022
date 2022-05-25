// sequelize nous aide a définir le modèle pour les commentaires

module.exports = (sequelize, DataTypes) => {
   
    const Comments = sequelize.define("Comments", {
        commentBody: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false  // il est necessaire d'avoir un username pour commenter
        }
    })
    return Comments;
}