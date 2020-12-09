import React, { useState, useEffect } from "react";

import "./videoCall.css";
import CloseIcon from "@material-ui/icons/Close";
import db from "../../../firebase";
import { useStateValue } from "../../utilities/StateProvider";
import { actionTypes } from "../../utilities/Reducer";
import CallEndIcon from "@material-ui/icons/CallEnd";
import firebase from "firebase";

function VideoCall(props) {
    const [{ videoCall, user, receiver, room_Id }, dispatch] = useStateValue();

    const configuration = {
        iceServers: [
            {
                urls: [
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302"
                ]
            }
        ],
        iceCandidatePoolSize: 10
    };

    let mediaStream;
    let localStreams;
    let peerConnection;
    let streams;
    const remoteStream = new MediaStream();
    const remoteVideo = document.querySelector(".video__receiver");

    let roomWithOffer;

    useEffect(() => {
        videoCall
            ? (async () => {
                  console.log(user);
                  peerConnection = new RTCPeerConnection(configuration);
                  //   const video = document.querySelector(".video__video");

                  navigator.mediaDevices
                      .getUserMedia({
                          video: {
                              width: 1280,
                              height: 720
                          },
                          audio: true
                      })
                      .then(async (stream) => {
                          mediaStream = document.querySelector(
                              ".video__video"
                          ).srcObject = stream;

                          peerConnection.addStream(stream);
                          peerConnection.onaddstream = (e) => {
                              document.querySelector(
                                  ".video__receiver"
                              ).srcObject = e.stream;
                              console.log(e.stream);
                          };

                          //code for creating room
                          const offer = await peerConnection.createOffer();
                          await peerConnection.setLocalDescription(offer);

                          roomWithOffer = {
                              offer: {
                                  type: offer.type,
                                  sdp: offer.sdp
                              }
                          };

                          const roomRef = db
                              .collection("users")
                              .doc(receiver.id);
                          roomRef.update(roomWithOffer);
                      })
                      .then(() => {
                          collectIceCandidates(
                              peerConnection,
                              user.id,
                              receiver.id
                          );

                          db.collection("users")
                              .doc(user.uid)
                              .onSnapshot(async (snapshot) => {
                                  console.log(
                                      "Got updated room:",
                                      snapshot.data()
                                  );
                                  const data = snapshot.data();
                                  if (
                                      !peerConnection.currentRemoteDescription &&
                                      data.answer
                                  ) {
                                      console.log(
                                          "Set remote description: ",
                                          data.answer
                                      );
                                      const answer = new RTCSessionDescription(
                                          data.answer
                                      );

                                      console.log(answer, data.answer);

                                      await peerConnection.setRemoteDescription(
                                          answer
                                      );
                                  }
                              });
                      })
                      .then(() => {
                          collectIceCandidates(
                              peerConnection,
                              user.id,
                              receiver.id
                          );
                      });

                  registerPeerConnectionListeners(peerConnection);

                  console.log(peerConnection);
              })()
            : console.log("videoCall not active");
    }, [videoCall]);

    const answerCall = async () => {
        await db
            .collection("users")
            .doc(user.uid)
            .get()
            .then(async (doc) => {
                peerConnection = new RTCPeerConnection(configuration);

                peerConnection.onaddstream = (e) => {
                    document.querySelector(".video__receiver").srcObject =
                        e.stream;
                    console.log(e.stream);
                };

                const offer = doc.data().offer;
                console.log(offer);
                await peerConnection.setRemoteDescription(offer);
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);

                collectIceCandidates(peerConnection, user.id, receiver.id);

                const roomWithAnswer = {
                    answer: {
                        type: answer.type,
                        sdp: answer.sdp
                    }
                };
                console.log(peerConnection);

                await db
                    .collection("users")
                    .doc(receiver.id)
                    .update(roomWithAnswer);

                collectIceCandidates(peerConnection, user.id, receiver.id);

                registerPeerConnectionListeners(peerConnection);
            });
        console.log(peerConnection);
    };

    async function hangUp(e) {
        const tracks = document
            .querySelector(".video__video")
            .srcObject.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });

        const userRoom = db.collection("users").doc(user.id);
        userRoom.get().then((doc) => {
            doc.data().answer
                ? userRoom.update({
                      answer: firebase.firestore.FieldValue.delete(),
                      candidate: firebase.firestore.FieldValue.delete()
                  })
                : userRoom.update({
                      offer: firebase.firestore.FieldValue.delete(),
                      candidate: firebase.firestore.FieldValue.delete()
                  });
        });

        const receiverRoom = db.collection("users").doc(receiver.id);
        receiverRoom.get().then((doc) => {
            doc.data().answer
                ? receiverRoom.update({
                      answer: firebase.firestore.FieldValue.delete(),
                      candidate: firebase.firestore.FieldValue.delete()
                  })
                : receiverRoom.update({
                      offer: firebase.firestore.FieldValue.delete(),
                      candidate: firebase.firestore.FieldValue.delete()
                  });
        });

        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }

        if (peerConnection) {
            peerConnection.close();
        }
    }

    return (
        <div className={`video`}>
            <div className="endCall__center">
                <CallEndIcon className="endCall red" onClick={hangUp} />
                <CallEndIcon className="endCall blue" onClick={answerCall} />
            </div>
            <video muted className={`video__receiver`} autoPlay></video>
            <video muted className={`video__test`} autoPlay></video>
            <video className={`video__video`} autoPlay></video>
        </div>
    );
}

export default VideoCall;

const collectIceCandidates = (peerConnection, userRoom, receiverRoom) => {
    const candidatesCollection = db.collection("users").doc(userRoom);
    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            candidatesCollection.update({
                candidate: event.candidate.toJSON()
            });
        } else console.log("all candidates have been sent");
    });

    db.collection("users")
        .doc(receiverRoom)
        .onSnapshot((snapshot) => {
            if (snapshot.data().candidate) {
                console.log(snapshot.data().candidate);
                peerConnection.addIceCandidate(
                    new RTCIceCandidate(snapshot.data().candidate)
                );
            }
        });
};

function registerPeerConnectionListeners(peerConnection) {
    peerConnection.addEventListener("icegatheringstatechange", () => {
        console.log(
            `ICE gathering state changed: ${peerConnection.iceGatheringState}`
        );
    });

    peerConnection.addEventListener("connectionstatechange", () => {
        console.log(
            `Connection state change: ${peerConnection.connectionState}`
        );
    });

    peerConnection.addEventListener("signalingstatechange", () => {
        console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener("iceconnectionstatechange ", () => {
        console.log(
            `ICE connection state change: ${peerConnection.iceConnectionState}`
        );
    });
}
