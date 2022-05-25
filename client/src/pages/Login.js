import React, { useState, useContext } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../helpers/AuthContext"


function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {setAuthState} = useContext(AuthContext)

    let navigate = useNavigate()
    

    const login = () => {
        const data = { username: username, password: password }
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if (response.data.error) {                                        // si il n'y a pas d'erreur (backend User.js) 
                return alert(response.data.error)            
            } else {localStorage.setItem("accesToken", response.data.accessToken)
                    localStorage.setItem("refreshToken", response.data.refreshToken)    // alors token envoyé au LocalStorage
                    setAuthState({                                                    // contexte d'affichage authentification
                        username: response.data.username,
                        id: response.data.id,
                        status: true
                    })                                                            
                    navigate("/")                                                     // puis on est redirigé vers l'acceuil
            }                                                         
        })
    }
    return <div className="loginContainer">
        <label>Nom d'utilisateur :</label>
        <input
            type="text"
            onChange={(event) => {
                setUsername(event.target.value)                   // on entre les identifiants
            }} />
        <label>Mot de passe :</label>
        <input
            type="password"
            onChange={(event) => {
                setPassword(event.target.value)                    // on entre les identifiants
            }} />

        <button onClick={login} >Se connecter</button>
    </div>
}

export default Login