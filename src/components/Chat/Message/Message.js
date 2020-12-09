import React from "react";
import "./message.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useStateValue } from "../../utilities/StateProvider";
import db from "../../../firebase";

function Message({ text, sender, image }) {
    const [{ user }] = useStateValue();
    const isUser = sender === user.uid;

    return (
        <div className="message">
            <div className={`message_other ${isUser && "message_user"}`}>
                <Typography>
                    {text}</Typography>
                <div className="message__img-container">
                    {image && <img className="message__img" src={image} />}
                </div>

                {/* <p>{text}</p> */}
            </div>
        </div>
    );
}

export default Message;
