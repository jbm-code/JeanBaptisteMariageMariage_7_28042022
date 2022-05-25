import React from "react"
// Axios est une bibliothèque JavaScript fonctionnant comme un client HTTP. 
// Elle permet de communiquer avec des API en utilisant des requêtes. 
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
// icone de like
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
//import { AuthContext } from "../helpers/AuthContext"

function Home() {
  const [listOfPosts, setListOfPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  //const { authState } = useContext(AuthContext)
  let navigate = useNavigate()


  useEffect(() => {
    if (!localStorage.getItem("accesToken")) {       // si on n'est pas connecté, alors on est redirigé vers le login
      navigate("/login")
    } else {
      // dans le frontend, axios va chercher les données du backend/serveur.
      axios.get("http://localhost:3001/posts",
        { headers: { accesToken: localStorage.getItem("accesToken") } }
      ).then((response) => {
        setListOfPosts(response.data.listOfPosts)
        // console.log(response.data.listOfPosts);
        // on récupère les PostsId de tous les likes d'un utilisateur
        setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostsId
        }))
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const likeAPost = (postId) => {
    axios.post(
      "http://localhost:3001/likes",
      { PostId: postId },
      { headers: { accesToken: localStorage.getItem("accesToken") } }
    ).then((response) => {
      setListOfPosts(
        listOfPosts.map((post) => {
          if (post.id === postId) {               //grace au if, on trouve le post dont le id correspond
            if (response.data.liked) {            // si liked = true
              return { ...post, Likes: [...post.Likes, 0] }
            } else {                              // sinon liked = false
              const likesArray = post.Likes
              likesArray.pop()                    // pop() est une fonction JS, qui supprime un élément (de length)        
              return { ...post, Likes: likesArray }
            }
          } else {
            return post
          }
        })
      )
      if (likedPosts.includes(postId)) {
        setLikedPosts(
          likedPosts.filter((id) => {    // si le like est enlevé, on le supprime de la liste
            return id !== postId;
          })
        );
      } else {
        setLikedPosts([...likedPosts, postId]); // si le like est nouveau, on l'ajoute a la liste
      }
    });
  }

  return (
    <div className="homeListOfPost">
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
                        <a href={value.file} target="_blank"  rel="noopener noreferrer">
                        < img src={value.file} alt="document fourni par l'utilisateur" />
                        </a>
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
                <div className="userName">
                  <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
                  <div className="date">. posté le {date2}</div>
                </div>
                <div className="buttons">
                  <ThumbUpIcon
                    onClick={() => {
                      likeAPost(value.id)
                    }}
                    // on change l'affichage du pouce
                    className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                  />
                  {/* affichage du nombre de likes, présents dans res de get("3001/posts") */}
                  <label> {value.Likes.length} </label>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default Home