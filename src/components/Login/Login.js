import React, { useEffect, useState } from "react";
import "./login.css";

import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import { Button } from "@material-ui/core";
import db, { auth, provider } from "../../firebase";
import { useStateValue } from "../utilities/StateProvider";
import { actionTypes } from "../utilities/Reducer";

function Login() {
    const [{ user, chatId }, dispatch] = useStateValue();

    let userEmail = localStorage.getItem("email");
    let userUid = localStorage.getItem("uid");

    useEffect(() => {
        if (userUid) {
            db.collection("users")
                .doc(userUid)
                .get()
                .then((doc) => {
                    dispatch({
                        type: actionTypes.SET_USER,
                        user: doc.data()
                    });
                    console.log(chatId);
                });
        }
    });

    const signIn = (e) => {
        // e.preventDefault();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log(result);
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user
                });
                db.collection("users").doc(result.user.uid).set({
                    name: result.user.displayName,
                    email: result.user.email,
                    id: result.user.uid,
                    uid: result.user.uid,
                    avatar: result.user.photoURL
                });
                localStorage.setItem("email", result.user.email);
                localStorage.setItem("uid", result.user.uid);
            })
            .catch((error) => {
                console.log(error.message);
            });
    };
    return (
        <div className="login">
            <div className="login__container">
                <WhatsAppIcon className="login__logo" />
                <Button
                    className="login__button"
                    variant="outlined"
                    color="primary"
                    onClick={signIn}
                >
                    Sign Up With Google
                </Button>
            </div>
        </div>
    );
}

export default Login;
