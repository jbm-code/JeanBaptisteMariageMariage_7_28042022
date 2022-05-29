// Express.js est un framework pour construire des applications web basées sur Node.js. 
const express = require("express")
const app = express()
const cors = require("cors")
// path = plugin pour charger des images
const path = require('path')

app.use(express.json())
app.use(cors()) 


const db = require("./models")

// Routers
const postRouter = require("./routes/Posts.js")
app.use("/posts", postRouter)   // sur l'url "http://localhost:3001/posts", l'api appelle le middelware Posts,js

const commentsRouter = require("./routes/Comments.js")
app.use("/comments", commentsRouter)

const usersRouter = require("./routes/Users.js")
app.use("/auth", usersRouter)

const likesRouter = require("./routes/Likes.js")
app.use("/likes", likesRouter)

//gestion  de la ressource image de facon statique
app.use('/images', express.static(path.join(__dirname, 'images')))



// Sequelize est un ORM (Object Relational Mapping), qui permet l'utilisation de la base de données MySQL. 
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Votre server fonctionne sur le port 3001 !");
    })
})