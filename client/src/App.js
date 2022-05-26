import "./App.css";
import logo1 from "./images/icon-left-font-monochrome-black.png"
// import logo2 from "./images/icon-left-font.png"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home.js"
import CreatePost from "./pages/CreatePost.js";
import PostAddIcon from '@mui/icons-material/PostAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Post from "./pages/Post.js";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile"

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // par defaut, utilisateur non authentifié -> affichage registration et login
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false
  })

  useEffect(() => {
    axios.interceptors.response.use((response) => { return response },
      function (error) {
        const originalRequest = error.config;

        // if (error.response.status === 401 && originalRequest.url === 
        //   "http://localhost:3001/auth/refreshToken" ){   // ????????????????????????????????????????
        //          Router.push('/login');
        //          return Promise.reject(error);
        //      }

        if (error.response.status === 401 && !originalRequest._retry) {

          originalRequest._retry = true;
          return axios.post("http://localhost:3001/auth/refreshToken",
          {
            "refresh_token" : localStorage.getItem("refreshToken")
          })
          .then (res => {
            if (res.status === 200) {
              localStorage.setItem("accesToken", res.data.accessToken)
              localStorage.setItem("refreshToken", res.data.refreshToken)
              axios.defaults.headers.common['accesToken'] = { accesToken:  localStorage.getItem("accesToken")}
              // setAuthState({
              //   username: res.data.username,
              //   id: res.data.id,
              //   status: true
              // })
              return axios(originalRequest)
            }
          })
        }
      })    

    axios.get("http://localhost:3001/auth/authUser", {
      headers: { accesToken: localStorage.getItem("accesToken") }
      // si d'authentification est correcte -> registration et login ne s'affichent pas    
    })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false })  // on destructure authState pour ne modifier que le status
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true
          })
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    localStorage.removeItem("accesToken")
    localStorage.removeItem("refreshToken")
    setAuthState({
      username: "",
      id: 0,
      status: false
    })

  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <BrowserRouter>
          <div className="navbar">
            <div className="links">

              {!authState.status ? 
                (
                    <>
                      <div className="logo1">
                        <img src={logo1} alt="logo"
                          
                        ></img>
                      </div>
                      <Link to="/registration" > Créer un compte </Link>
                      <Link to="/login"> Se connecter </Link>
                    </>
                ) : (
                    <>
                      <div className="logo1">
                        <Link to="/" ><img src={logo1} alt="logo"
                          
                        ></img></Link>
                      </div>
                      <div className="createPost">
                        <Link to="/createpost" ><PostAddIcon /></Link>
                      </div>
                    
                      <div className="loggedInContainer">
                        <h1>
                          <Link to={`/profile/${authState.id}`}> {authState.username} </Link>
                        </h1>
                        <div className="logout">
                          <Link to={"/login"}>
                          {authState.status && <ExitToAppIcon onClick={logout} />}
                          </Link>
                        </div>
                      </div>
                    </>
                 )}
                 </div>

          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
