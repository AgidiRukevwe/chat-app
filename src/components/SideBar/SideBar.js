import React, { useEffect, useState } from "react";
import "./sidebar.css";
import db from "../../firebase";

import Contact from "./Contact/Contact";
import firebase from "firebase";

import Avatar from "@material-ui/core/avatar";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Button } from "@material-ui/core";
import { actionTypes } from "../utilities/Reducer";
import { useStateValue } from "../utilities/StateProvider";

function Sidebar(props) {
    const [{ user, isVisible }] = useStateValue();
    const [{ receiver, chatId }, dispatch] = useStateValue();
    // const [newContact, setNewContact] = useState();
    const [channels, setChannels] = useState([]);
    // const [combinedUsersId, setCombinedUsersId] = useState();

    let newContact;
    const addContact = () => {
        newContact = prompt("add contact");

        if (newContact === user.email) {
            alert(`you can't add yourself`);
            console.log(`you can't add yourself`);
            return false;
        }

        //creating new room between user and the new below
        db.collection("users")
            .where("email", "==", newContact)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(window.innerWidth);
                    let combinedUsersId;
                    let data = doc.data();

                    if (user.uid > data.id) {
                        combinedUsersId = user.uid + data.id;
                    } else {
                        combinedUsersId = data.id + user.uid;
                    }

                    console.log(combinedUsersId);
                    dispatch({
                        type: actionTypes.SET_ROOM_ID,
                        room_Id: combinedUsersId
                    });
                    db.collection("chatrooms")
                        .doc(combinedUsersId)
                        .set({
                            createdBy: user.uid,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            chatRoomId: combinedUsersId,

                            membersId: [user.id, data.id],

                            members: [
                                {
                                    id: data.id,
                                    name: data.name,
                                    avatar: data.avatar
                                },
                                {
                                    id: user.id,
                                    name: user.name,
                                    avatar: user.avatar
                                }
                            ]
                        });
                });
            });
    };

    //creating new room between user and the new above

    //getting all the rooms that contains the user and mapping them in the sidebar component below
    useEffect(() => {
        db.collection("chatrooms")
            .where("membersId", "array-contains", user.uid)
            .get()
            .then((snapshot) => {
                // console.log(snapshot.docs);
                setChannels(
                    snapshot.docs.map((doc) => ({
                        id: doc.data().chatRoomId,

                        contactDetails: doc
                            .data()
                            .members.find((member) => member.id !== user.id)
                    }))
                );
            });
    });

    //getting all the rooms that contains the user and mapping them in the sidebar component above

    return (
        <div className="sidebar">
            {/* this is the sidebar header */}
            <div className="sidebar__top">
                <div className="sidebar__header">
                    <div className="sidebar__headerLeft">
                        <Avatar src={user?.photoURL || user.avatar} />
                    </div>
                    <div className="sidebar__headerRight">
                        <DataUsageIcon />
                        <ChatIcon />
                        <MoreVertIcon onClick={props.showReceiverInfo} />
                    </div>
                </div>

                {/* this is the sidebar search */}
                <div className="sidebar__search">
                    <input placeholder="Search or start new chat" />
                </div>
            </div>

            {/*  sidebar contactlist below */}

            {channels.map((channel) => (
                <div className="sidebar__contactList" key={channel.id}>
                    <Contact
                        contactId={channel.contactDetails.id}
                        id={channel.id}
                        newContact={newContact}
                        contact={channel.contactDetails}
                    />
                </div>
            ))}

            {/*  sidebar contactlist below */}

            <Button color="primary" onClick={addContact}>
                Add Contact
            </Button>
        </div>
    );
}

export default Sidebar;
