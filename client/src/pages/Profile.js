import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../helpers/AuthContext"
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Link } from "react-router-dom"

function Profile() {
    let { id } = useParams()    //on récupère le id de l'url grace a useParams
    let navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])
    const { authState } = useContext(AuthContext)     // appel du state
    const { setAuthState } = useContext(AuthContext)    //permet de redefinir le state

    useEffect(() => {
        axios
            .get(`http://localhost:3001/auth/basicinfo/${id}`)
            .then((response) => {
                setUsername(response.data.username)
            })
        axios
            .get(`http://localhost:3001/posts/byuserId/${id}`)
            .then((response) => {
                setListOfPosts(response.data)
            })

    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    const deleteUser = () => {
    
        axios.delete(`http://localhost:3001/auth/basicinfo/${id}`, {
            headers: { accesToken: localStorage.getItem("accesToken") }
        })
            .then(() => {

                if (authState.username === username || authState.username === !"isAdmin") {
                    localStorage.removeItem("accesToken")
                    setAuthState({                                                    // contexte d'affichage authentification
                        username: "",
                        id: 0,
                        status: false
                    })
                    navigate("/login")
                } else {
                    navigate("/")
                }   
            })
        alert("le compte a été supprimé")    
    }

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1> Compte de {username}</h1>
                {(authState.username === username || authState.username === "isAdmin") && (  //le bouton n'est visible que pour le bon utilisateur
                    <button onClick={() => { deleteUser(authState.id) }} > Supprimer le compte</button>
                )}
            </div>
            <div className="listOfPosts">
                {listOfPosts.map((value, key) => {
                    var t = value.createdAt
                    var d = t.split(/[T]/) 
                    var date =(d[0])
                    var d2 = date.split(/[-]/)
                    var date2 = (d2[2]+-d2[1]+-d2[0])

                    return (
                        // le hook useNavigate nous permet d'inserer dans l'url la value.id
                        <div key={key} className="postContainer">
                            <div  className="post">
                                <div className="title"> {value.title}
                                </div>
                                <div className="body">
                                    <div className="LinkPreview">

                                        <div>
                                            {value.postLink ? (         // si il n'y a pas de postLink, la div est vide
                                                < LinkPreview url={value.postLink} />
                                            ) : (<></>)}
                                        </div>
                                        <div className="ContainerFile">
                                            <div className="borderFile">
                                                {value.file ? (         // si il n'y a pas de fileLink, la div est vide
                                                    < img src={value.file} alt="document fourni par l'utilisateur" />
                                                ) : (<></>)}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="bodyText">

                                        {value.postText}

                                        <div> <Link to={(`/post/${value.id}`)}> Commenter...</Link> </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <div className="userName"> {value.username}  <div className="date">. posté le {date2}</div></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Profile