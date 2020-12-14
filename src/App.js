import React from "react";
import "./App.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Media from "react-media";

import Home from "./components/Home/Home";
import Sidebar from "./components/SideBar/SideBar";
import Chat from "./components/Chat/Chat";
import { useStateValue } from "./components/utilities/StateProvider";
import Login from "./components/Login/Login";
import IncomingVideoCall from "./components/Chat/VideoCall/IncomingVideoCall/IncomingVideoCall";

function App() {
    const [{ user }] = useStateValue();
    return (
        <div className="App">
            <Router>
                <Media query="(max-width: 870px)">
                    {(matches) =>
                        matches ? (
                            !user ? (
                                <Login />
                            ) : (
                                <>
                                    <Switch>
                                        <Route exact path="/sidebar">
                                            <Sidebar />
                                        </Route>
                                        <Route path="/room/:roomId">
                                            <Chat />
                                        </Route>

                                        <Redirect from="/" to="/sidebar" />
                                    </Switch>
                                </>
                            )
                        ) : (
                            <Home />
                        )
                    }
                </Media>
            </Router>
        </div>
    );
}

export default App;
