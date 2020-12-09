import React, { useEffect } from "react";
import "./contact.css";
import Avatar from "@material-ui/core/avatar";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import db from "../../../firebase";
import { useStateValue } from "../../utilities/StateProvider";
import { actionTypes } from "../../utilities/Reducer";

function Contact({ contact, id, contactId }) {
    const history = useHistory();
    const [{ receiver }, dispatch] = useStateValue();

    const selectContact = async () => {
        if (id) {
            history.push(`/room/${id}`);
        } else {
            alert("no page");
        }

        console.log("contact", contact);

        console.log(contactId);
        db.collection("users")
            .where("id", "==", contact.id)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.data());
                    const data = doc.data();
                    dispatch({
                        type: actionTypes.SET_RECEIVER,
                        receiver: doc.data()
                    });
                });
            })
            .catch((error) => {
                console.log("error from contact.js", error);
            });
    };

    return (
        <div className="sidebar__contact" onClick={selectContact}>
            <Avatar src={contact?.avatar} className="sidebar__contactAvatar" />
            <div className="sidebar__contactInfo">
                {/* <h3>{receiver === null ? contact : receiver.name}</h3> */}
                <h3>{contact?.name}</h3>

                <p>Hello World</p>
            </div>
        </div>
    );
}

export default Contact;
