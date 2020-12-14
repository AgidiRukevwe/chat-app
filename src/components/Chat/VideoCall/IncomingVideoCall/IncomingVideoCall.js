import React, { useState, useEffect } from "react";
import db from "../../../../firebase";
import firebase from "firebase";
import { useStateValue } from "../../../utilities/StateProvider";
import { Button, Modal } from "@material-ui/core";
import { actionTypes } from "../../../utilities/Reducer";
import { Link } from "react-router-dom";

function IncomingVideoCall(props) {
    const [{ user, answerCall, hangUp }, dispatch] = useStateValue();

    const [callerRoom, setCallerRoom] = useState();
    const [openModal, setOpenModal] = useState(false);

    const userRoom = db.collection("users").doc(user.id);
    let receiverRoom;
    let caller;

    //check if there's a call offer from a contact
    useEffect(() => {
        userRoom.onSnapshot((snap) => {
            if (snap.data().offer) {
                setOpenModal(true);
                // setCaller(snap.data().caller);
                setCallerRoom(snap.data().room_Id.roomId);
            }
            caller = snap.data().caller;

            // console.log(callerRoom);

            console.log(caller);
        });
    }, []);

    //dismiss call
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const changeAnswerCallState = () => {
        dispatch({
            type: actionTypes.SET_ANSWERCALL,
            answerCall: !answerCall
        });
        handleModalClose();
    };

    const changeHangUp = () => {
        caller && (receiverRoom = db.collection("users").doc(caller));

        dispatch({
            type: actionTypes.SET_HANGUP,
            hangUp: true
        });

        const deleteField = firebase.firestore.FieldValue.delete();
        // receiverRoom.update({
        //     candidate: deleteField,
        //     room_Id: deleteField
        // });
        userRoom.update({
            offer: deleteField,
            caller: deleteField,
            room_Id: deleteField
        });

        handleModalClose();
    };

    return (
        <div>
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
                    <p>Incoming Call</p>
                    <h2 className="modal__title" id="server-modal-title">
                        Server-side modal
                    </h2>
                    <Link to={`/room/${caller}/video`}>
                        <Button className="modal__close" onClick={changeHangUp}>
                            Dismiss
                        </Button>
                    </Link>

                    <Link to={`/room/${caller}/video`}>
                        <Button
                            variant="outlined"
                            className="modal__btn"
                            color="primary"
                            onClick={changeAnswerCallState}
                        >
                            Answer
                        </Button>
                    </Link>
                </div>
            </Modal>
        </div>
    );
}

export default IncomingVideoCall;
