import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../helpers/AuthContext"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { LinkPreview } from '@dhaiwat10/react-link-preview';


function Post() {
    let { id } = useParams() // le hook useParams va nous permettre de chercher l'id dans l'url
    const [postObject, setPostObject] = useState({})
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const { authState } = useContext(AuthContext)
    let navigate = useNavigate()

    useEffect(() => {
        //---1--- dans le frontend, axios va chercher les données du backend/serveur.
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            //---2--- ces données sont rangées dans la const postObject
            setPostObject(response.data);
        });
        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, [id]);

    const addComment = () => {
        axios
            .post("http://localhost:3001/comments", {
                commentBody: newComment,
                PostId: id },
                { headers: { accesToken: localStorage.getItem("accesToken") }
            })
            .then((response) => {
                if (response.data.error) {
                    alert("vous devez vous connecter pour poster un commentaire");
                } else {
                    const commentToAdd = {
                        id: response.data.id,
                        commentBody: newComment,
                        username: response.data.username
                    };
                    setComments([...comments, commentToAdd]);
                    setNewComment(""); //on reinitialise l'input 
                }
            });
    };
    const deleteComment = (id) => {
        // console.log(id) // id récupéré de la bdd, correct !
        axios.delete(`http://localhost:3001/comments/${id}`, {
            headers: { accesToken: localStorage.getItem("accesToken") }
        })
            .then(() => {
                setComments(
                    comments.filter((val) => {
                        return val.id !== id // on ne conserve que les id qui sont différents de celui ciblé
                    })
                )
            })
    }
    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: { accesToken: localStorage.getItem("accesToken") }
        })
            .then(() => {
                navigate("/")
            })
    }
    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Entrez le nouveau titre")
                if (newTitle) {
                    axios.put("http://localhost:3001/posts/title",
                        {
                            newTitle: newTitle,
                            id: id                  //id de useParams() 
                        },
                        {
                            headers: { accesToken: localStorage.getItem("accesToken") }
                        })
                    setPostObject({ ...postObject, title: newTitle })  // on destructure sePostObject, puis on met a jour title
                } else if (newTitle === null) return false
        } else {
            let newPostText = prompt("Entrez le nouveau texte")
                if (newPostText) {
                    axios.put("http://localhost:3001/posts/postText",
                        {
                            newText: newPostText,
                            id: id                  //id de useParams() 
                        },
                        {
                            headers: { accesToken: localStorage.getItem("accesToken") }
                        })
                    setPostObject({ ...postObject, postText: newPostText })  // on destructure puis on met a jour title       
                } else if (newPostText === null) return false
        }
    }
    return (

        <div className="postPage">
            <div className="postContainer">
                <div className="leftSide">
                    <div className="post" >
                        <div className="title"
                            onClick={() => {
                                if (authState.username === postObject.username) {
                                    editPost("title")
                                }
                            }}
                        > {postObject.title}</div>
                        <div className="body">

                            <div className="LinkPreview">
                                {postObject.postLink ? (         
                                    < LinkPreview url={postObject.postLink} />
                                ) : (<></>)}
                                
                                {postObject.file ? (  
                                <div className="ContainerFile">
                                    <div className="borderFile">
                                                
                                            <a href={postObject.file} target="_blank" rel="noopener noreferrer">
                                                < img src={postObject.file} alt="document fourni par l'utilisateur" />
                                            </a>
                                         </div>
                                         </div>   
                                        ) : (<></>)}
                                    
                            </div>
                            <div className="bodyText"
                                onClick={() => {
                                    if (authState.username === postObject.username) {
                                        editPost("body")
                                    }
                                }}
                            > {postObject.postText}</div>
                        </div>
                        <div className="footer">
                            <Link to={`/profile/${postObject.UserId}`}> {postObject.username} </Link>
                            {/* si l'ulisateur connecté est l'auteur du post, alors le bouton apparait */}
                            {(authState.username === postObject.username || authState.username === "isAdmin")
                                && (<div className="buttons" id="delete">
                                    <DeleteForeverIcon onClick={() => { deletePost(postObject.id) }}
                                    />


                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input className="comment"
                        type="text"
                        placeholder="Ajouter un commentaire..."
                        autoComplete="off"
                        value={newComment} // l'input reprend la valeur par defaut
                        // la valeur de l'input est récupérée pour le State de setNewComment
                        onChange={(event) => { setNewComment(event.target.value) }}
                    />
                    <button onClick={addComment} >Commenter <DoneOutlineIcon /></button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return <div key={key} className="comment">
                            <div className="commentLeft">
                                <PersonOutlineIcon />
                                <label>{comment.username} : </label>
                                {comment.commentBody}
                            </div>
                            <div className="commentRight">
                                {/* l'utilisateur qui a créé le commentaire, a accés au bouton*/}
                                {(authState.username === comment.username || authState.username === "isAdmin")
                                    && <DeleteForeverIcon onClick={() => { deleteComment(comment.id) }} />}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
export default Post