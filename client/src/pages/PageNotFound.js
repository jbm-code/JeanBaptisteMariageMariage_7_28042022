import React from "react"
import { Link } from "react-router-dom"

function PageNotFound() {
    return [
        <div>
            <h1>La page n'existe pas :</h1>
            <h3>Aller au lien :<Link to="/" > Page d'acceuil </Link></h3>
        </div>
    ]
}

export default PageNotFound