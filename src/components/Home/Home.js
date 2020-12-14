import React, { useEffect, useState } from "react";
import Media from "react-media";
import "./Home.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//components
import Sidebar from "../SideBar/SideBar";
import Chat from "../Chat/Chat";
import Login from "../Login/Login";
import { useStateValue } from "../utilities/StateProvider";
import { Modal } from "@material-ui/core";
import AddContact from "../SideBar/AddContact/AddContact";
import ReceiverInfo from "../ReceiverInfo/ReceiverInfo";
import { actionTypes } from "../utilities/Reducer";
import VideoCall from "../Chat/VideoCall/VideoCall";
import IncomingVideoCall from "../Chat/VideoCall/IncomingVideoCall/IncomingVideoCall";

function Home() {
    // const [user, setUser] = useState(null);
    const [{ user, isVisible, room_Id }, dispatch] = useStateValue();
    const [userEmail, setUserEmail] = useState("");

    const showReceiverInfo = () => {
        dispatch({
            type: actionTypes.SET_VISIBLE,
            isVisible: !isVisible
        });
        console.log(isVisible);
    };

    return (
        <div className="home">
            {!user ? (
                <Login />
            ) : (
                <Router>
                    <IncomingVideoCall />
                    <Sidebar
                        className="sidebar"
                        showReceiverInfo={showReceiverInfo}
                    />

                    <Switch>
                        <Route exact path={`/room/:roomId/video`}>
                            <VideoCall />
                        </Route>
                        <Route exact path={`/room/:roomId`}>
                            <Chat
                                className="chat"
                                showReceiverInfo={showReceiverInfo}
                            />
                        </Route>
                    </Switch>
                </Router>
            )}
        </div>
    );
}

export default Home;
