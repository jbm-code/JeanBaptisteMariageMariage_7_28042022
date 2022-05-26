import React, { useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../helpers/AuthContext"

function Registration() {
    let navigate = useNavigate()
    const { setAuthState } = useContext(AuthContext)
    const initialValues = {
        username: "",
        postText: "",
        password: ""
    }


    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, "trop petit")
            .max(8, "trop long!")
            .required("Ce champ est obligatoire"),
        email: Yup.string()
            .email("#l'email doit avoir un format valide")
            .max(100, "trop long")
            .required("Ce champ est obligatoire"),
        password: Yup.string()
            .min(5, "trop petit")
            .max(20, "trop long!")
            .required("Ce champ est obligatoire"),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then((response) => {
            if (response.data.error) {                                        // si il n'y a pas d'erreur (backend User.js) 
                return alert(response.data.error)
            } else {
                axios.post("http://localhost:3001/auth/login", data).then((response) => {
                    if (response.data.error) {                                        // si il n'y a pas d'erreur (backend User.js) 
                        return alert(response.data.error)
                    } else {
                        localStorage.setItem("accesToken", response.data.accessToken)
                        localStorage.setItem("refreshToken", response.data.refreshToken)// alors token envoyé au LocalStorage
                        setAuthState({                                                  // contexte d'affichage authentification
                            username: response.data.username,
                            id: response.data.id,
                            status: true
                        })
                        navigate("/")                                                     // puis on est redirigé vers l'acceuil
                    }

                })
            }
        })
    }

    return <div className="registerPage">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <div >
                <Form className="formContainer">

                    <label>Nom d'utilisateur</label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="username"
                        placeholder="(Ex. John...)">
                    </Field>

                    <label>E-Mail</label>
                    <ErrorMessage name="email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="email"
                        placeholder="(Ex. John@groupomania.com...)">
                    </Field>

                    <label>Mot de passe: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        autoComplete="off"
                        type="password"
                        id="inputCreatePost"
                        name="password"
                        placeholder="Votre mot de passe..."
                    />


                    <button type="submit">Créer un compte</button>
                </Form>
            </div>
        </Formik>
    </div>
}

export default Registration