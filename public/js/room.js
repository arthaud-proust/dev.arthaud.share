let peerConnection;
const config = {
    iceServers: [
        { 
            "urls": "stun:stun.l.google.com:19302",
        },
        // { 
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
    ]
};
const videoElement = document.querySelector("#video-element");
const leaveSessionButton = document.querySelector('#leave-session');

leaveSessionButton.addEventListener("click", function () {
    socket.emit('leave', {room, username: username});
    socket.close();
    document.location.href = '/'
});



socket.on("offer", (id, description) => {
    peerConnection = new RTCPeerConnection(config);
    peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socket.emit("answer", id, peerConnection.localDescription);
        });

    peerConnection.ontrack = event => {
        videoElement.srcObject = event.streams[0];
    };
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
        }
    };
});


socket.on("candidate", (id, candidate) => {
    peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
});

socket.on("connect", () => {
    socket.emit('room', room);
    socket.emit("watcher");
});

socket.on("broadcaster", () => {
    socket.emit("watcher");
});

socket.on("disconnectPeer", () => {
    peerConnection.close();
});

socket.on("ended", () => {
    console.log('Video ended');
    videoElement.srcObject = null;
    videoElement.src = '/videos/no-signal-2.mp4';
    videoElement.play();
});

window.onunload = window.onbeforeunload = () => {
    socket.emit('leave', {room, username: username});
    socket.close();
};
videoElement.src= '/videos/no-signal-1.mp4';

