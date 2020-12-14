import React, { useState, useEffect } from "react";
import "./receiverInfo.css";

import { Avatar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useParams } from "react-router-dom";
import { useStateValue } from "../utilities/StateProvider";
import { actionTypes } from "../utilities/Reducer";

function ReceiverInfo({ showReceiverInfo }) {
    const roomId = useParams();
    const [{ receiver, isVisible, room_Id }, dispatch] = useStateValue();

    useEffect(() => {
        dispatch({
            type: actionTypes.SET_ROOM_ID,
            room_Id: roomId
        });
    }, []);
    // if (roomId) {
    //     db.collection("users")
    //         .where("id", "==", receiver.uid)
    //         .onSnapshot((snapshot) => setRoomDetails(snapshot.data()));

    return (
        <div className={isVisible ? "receiver" : "hidden"}>
            <div className="receiver__header">
                <div className="receiver__close">
                    <CloseIcon onClick={showReceiverInfo} />
                </div>
                <h4>Contact Info</h4>
            </div>
            <div className="receiverInfo">
                <Avatar src={receiver === null ? "" : receiver.avatar} />
                <p>
                    <strong>{receiver === null ? "" : receiver.name}</strong>
                </p>
                <p>{receiver === null ? "" : receiver?.email}</p>
                <p>online</p>
            </div>

            <div className="receive__media"></div>
        </div>
    );
}

export default ReceiverInfo;
