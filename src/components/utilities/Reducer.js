export const initialState = {
    user: null,
    receiver: null,
    isVisible: false,
    showReceiverInfo: null,
    videoCall: false,
    answerCall: false,
    hangUp: false,
    room_Id: null
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_RECEIVER: "SET_RECEIVER",
    SET_VISIBLE: "SET_VISIBLE",
    SET_SHOW_RECEIVER_INFO: "SET_SHOW_RECEIVER_INFO",
    SET_VIDEOCALL: "SET_VIDEOCALL",
    SET_ANSWERCALL: "SET_ANSWERCALL",
    SET_HANGUP: "SET_HANGUP",
    SET_ROOM_ID: "SET_ROOM_ID"
};

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            };

        case actionTypes.SET_RECEIVER:
            return {
                ...state,
                receiver: action.receiver
            };
        case actionTypes.SET_VISIBLE:
            return {
                ...state,
                isVisible: action.isVisible
            };
        case actionTypes.SET_SHOW_RECEIVER_INFO:
            return {
                ...state,
                showReceiverInfo: action.showReceiverInfo
            };
        case actionTypes.SET_VIDEOCALL:
            return {
                ...state,
                videoCall: action.videoCall
            };
        case actionTypes.SET_ANSWERCALL:
            return {
                ...state,
                answerCall: action.answerCall
            };
        case actionTypes.SET_HANGUP:
            return {
                ...state,
                hangUp: action.hangUp
            };

        case actionTypes.SET_ROOM_ID:
            return {
                ...state,
                room_Id: action.room_Id
            };
            break;

        default:
            return state;
            break;
    }
};

export default reducer;
