import React, { useEffect, useState } from "react";

import "./sidebar.css";
import db from "../../firebase";
import firebase from "firebase";

import { actionTypes } from "../utilities/Reducer";
import { useStateValue } from "../utilities/StateProvider";
import Contact from "./Contact/Contact";

import Avatar from "@material-ui/core/avatar";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import { Button, Modal, TextField } from "@material-ui/core";
import { SpeedDial } from "@material-ui/lab";

function Sidebar(props) {
    const [{ user, isVisible }] = useStateValue();
    const [{ receiver, chatId }, dispatch] = useStateValue();
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const [closeModal, setCloseModal] = useState(null);
    const [contactEmail, setContactEmail] = useState(null);
    // const [newContact, setNewContact] = useState();
    const [channels, setChannels] = useState([]);
    // const [combinedUsersId, setCombinedUsersId] = useState();

    //update search input
    const updateSearch = (e) => {
        setSearch(e.target.value);
        console.log(search);
    };

    //toggle modal
    const handleModalOpen = () => {
        setOpenModal(true);
    };
    const handleModalClose = () => {
        setOpenModal(false);
    };
    //toggle modal  above

    const addContact = () => {
        // setOpenModal("open");

        //toggle addContact modal on
        handleModalOpen();

        //validate email Input
        if (contactEmail === user.email) {
            alert(`you can't add yourself`);
            return false;
        } else if (contactEmail === "") {
            alert(console.log("field empty"));
        }

        //creating new room between user and the new below
        db.collection("users")
            .where("email", "==", contactEmail)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
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

    //get all the chat rooms that contains the user and map them in the sidebar component below
    useEffect(() => {
        db.collection("chatrooms")
            .where("membersId", "array-contains", user.uid)
            .get()
            .then((snapshot) => {
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

    //filter contents when searched
    const filteredContacts = channels.filter((channel) => {
        return (
            channel.contactDetails.name
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
        );
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

                        <AddIcon onClick={addContact} />

                        <MoreVertIcon onClick={props.showReceiverInfo} />
                    </div>
                </div>

                {/* this is the sidebar search */}
                <div className="sidebar__search">
                    <input
                        placeholder="Search or start new chat"
                        onChange={updateSearch}
                    />
                </div>
            </div>

            {/*  sidebar contactlist below */}

            {filteredContacts.map((channel) => (
                <div className="sidebar__contactList" key={channel.id}>
                    <Contact
                        // contactId={channel.contactDetails.id}
                        contactId={channel.contactDetails.id}
                        id={channel.id}
                        newContact={contactEmail}
                        contact={channel.contactDetails}
                    />
                </div>
            ))}

            {/*  sidebar contactlist above */}

            <Button color="primary" onClick={addContact}>
                <AddIcon />
            </Button>

            <Modal
                disablePortal
                open={openModal}
                onClose={handleModalClose}
                disableEnforceFocus
                disableAutoFocus
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={"sidebar__modal"}
            >
                <div className={"modal__modal"}>
                    <CloseIcon
                        className="modal__close"
                        onClick={handleModalClose}
                    />
                    <h2 className="modal__title" id="server-modal-title">
                        Add Email
                    </h2>
                    <TextField
                        id="standard-basic"
                        className="modal__input"
                        label="Contact List"
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                    <Button
                        variant="outlined"
                        className="modal__btn"
                        color="primary"
                        onClick={addContact}
                    >
                        Add Friend
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default Sidebar;
