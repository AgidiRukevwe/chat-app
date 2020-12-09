import React, { useState, useEffect } from "react";
import "./input.css";

import MoodIcon from "@material-ui/icons/Mood";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import db, { firebaseApp } from "../../../firebase";
import firebase from "firebase";
import { useStateValue } from "../../utilities/StateProvider";

function Input({ roomId, messages, setMessages }) {
    const [input, setInput] = useState("");
    // const [file, setfile] = useState(null);
    const [fileUrl, setfileUrl] = useState("");
    const [{ user }] = useStateValue();
    let file;

    const fileInput = async (e) => {
        file = e.target.files[0];
        const storageRef = firebaseApp.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        setfileUrl(await fileRef.getDownloadURL());

        db.collection("messages").doc(roomId).collection("message").add({
            image: fileUrl,
            sentBy: user.uid,
            sentAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        file = "";
        console.log(fileUrl);
    };

    const sendMessage = (event) => {
        event.preventDefault();
        if (input !== "") {
            db.collection("messages").doc(roomId).collection("message").add({
                message: input,
                image: fileUrl,
                sentBy: user.uid,
                sentAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            setMessages([input, ...messages]);
            setInput("");
            file = "";
        }
    };

    return (
        <div className="input">
            <div className="chat__input">
                <form type="submit">
                    <ul className="chat__inputInner">
                        <li>
                            <MoodIcon />
                        </li>
                        <li>
                            <label htmlFor="file">
                                <AttachFileIcon />
                            </label>
                        </li>
                        <li>
                            <input
                                className="chat__fileInput"
                                onChange={fileInput}
                                id="file"
                                type="file"
                            />
                        </li>
                        <li className="chat__text">
                            <input
                                className="chat__textInput"
                                value={input}
                                onChange={(event) => {
                                    setInput(event.target.value);
                                }}
                                placeholder="Type a message"
                            />
                        </li>

                        <li className="micIcon">
                            <MicIcon />
                        </li>
                    </ul>

                    <button className="input__button" onClick={sendMessage}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Input;
