import React, { useState, useEffect } from "react";
import "./chat.css";
import { Link, useParams } from "react-router-dom";
import db from "../../firebase";
import call from "./VideoCall/VideoCall";
import { useStateValue } from "../utilities/StateProvider";

import Input from "./Input/Input";
import Message from "./Message/Message";
import VideoCall from "./VideoCall/VideoCall";

//material ui components and icons

import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Avatar from "@material-ui/core/avatar";
import VideocamIcon from "@material-ui/icons/Videocam";
import ReceiverInfo from "../ReceiverInfo/ReceiverInfo";
import { actionTypes } from "../utilities/Reducer";

function Chat(props) {
    const [
        { user, receiver, isVisible, videoCall, room_Id },
        dispatch
    ] = useStateValue();
    const { roomId } = useParams();

    const [messages, setMessages] = useState([]);
    const [roomDetails, setRoomDetails] = useState(null);
    const [state, setState] = useState();

    useEffect(() => {
        db.collection("messages")
            .doc(roomId)
            .collection("message")
            .orderBy("sentAt")
            .onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map((doc) => doc.data()));
            });
    }, [roomId]);

    const startCall = () => {
        dispatch({
            type: actionTypes.SET_VIDEOCALL,
            videoCall: !videoCall
        });
        console.log(room_Id.roomId);
    };

    return (
        <div className="chat__global">
            <div className={`chat ${isVisible && "chat_flex"}`}>
                {/* <VideoCall /> */}
                {/* <div className={`chat`}> */}
                <div className="chat__header">
                    <div className="chat__headerLeft">
                        <Avatar src={receiver?.avatar} />
                        <div className="chat__info">
                            <h4>{receiver?.name}</h4>
                            <p>Last Seen</p>
                        </div>
                    </div>

                    <div className="chat__headerRight">
                        <ul>
                            <li>
                                <VideocamIcon
                                    className="video__icon"
                                    onClick={startCall}
                                />
                            </li>

                            <li>
                                <SearchIcon className="chat__headerRight--searchIcon" />
                            </li>
                            <li>
                                <MoreVertIcon
                                    className="chat__headerRight--moreVertIcon"
                                    onClick={props.showReceiverInfo}
                                />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={`chat__body ${isVisible && "chat__body2"}`}>
                    {messages.map(({ message, sentBy, image }) => (
                        <Message sender={sentBy} text={message} image={image} />
                    ))}
                </div>
                <Input
                    className="chat__inputComponent"
                    messages={messages}
                    setMessages={setMessages}
                    roomId={roomId}
                />
            </div>

            <ReceiverInfo
                className="chatRight"
                showReceiverInfo={props.showReceiverInfo}
            />

            {/* <VideoCall
                roomId={roomId}
                display={display}
                setDisplay={setDisplay}
            /> */}
        </div>
    );
}

export default Chat;
