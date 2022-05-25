import React, { useEffect } from "react"
// Formik est une bibliothèque conçu pour gérer des formulaires avec une validation complexe ou simple. 
// Formik supporte la validation synchrone et asynchrone au niveau du formulaire et du champ. 
// Les formulaires nous permettent de récuperer les données des utilisateurs 
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function CreatePost() {

    const initialValues = {
        title: "",
        postText: "",
        postLink: "",
        file: ""
    }
    let navigate = useNavigate()

    useEffect(() => {              // si l'utilisateur n'est pas connecté, alors redirection vers login
        if (!localStorage.getItem("accesToken")) {
            navigate("/login")
        }
    })

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, "le titre doit contenir entre 3 et 20 caractères")
            .max(40, "le titre doit contenir entre 3 et 20 caractères")
            .required("Ce champ est obligatoire"),
        postText: Yup.string()
            .min(3, "le post doit contenir entre 3 et 200 caractères")
            .max(250, "le post doit contenir entre 3 et 250 caractères"),
        postLink: Yup.string()
            .matches(
                /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                "le format de votre lien n'est pas valide"),
        file: Yup.mixed()
    });

    return <div className="createPage">
        <Formik
            initialValues={initialValues}
            onSubmit={async (values) => {
                // console.log(values);
                // console.log(values.file);

                let data = new FormData()
                data.append ("file", values.file)
                data.append ("title", values.title)
                data.append ("postText", values.postText)
                data.append ("postLink", values.postLink)

                    axios.post("http://localhost:3001/posts", data, {
                        headers: { accesToken: localStorage.getItem("accesToken") }
                    })
                    // .then((console.log("larequête axios sont finies", values)))
                    .then ( navigate("/"))



            }}
            validationSchema={validationSchema}>
            {(formProps) => (
                <Form className="formContainer" >

                    <label>Titre </label>
                    <ErrorMessage name="title" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="title"
                        placeholder="(Ex. titre...)">
                    </Field>

                    <label>Créer un post </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="postText"
                        placeholder="(Ex. post...)">
                    </Field>

                    <label>Insérer un lien</label>
                    <ErrorMessage name="postLink" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="postLink"
                        placeholder="( Ex. https://Groupomania.com/article... )">
                    </Field>

                    <label>Télécharger un fichier</label>
                    <input
                        type="file"
                        name="file"
                        onChange={(event) =>
                            formProps.setFieldValue("file", event.target.files[0])
                        }

                    />
                    <button type="submit">Valider</button>
                </Form>
            )}
        </Formik>
    </div>
}

export default CreatePost