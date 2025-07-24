const socket = io();
const messageInput = document.getElementById("message");
const messages = document.getElementById("messages");

// Send message
function sendMessage() {
  const msg = messageInput.value;
  if (msg) {
    socket.emit("chat", msg);
    appendMessage(`You: ${msg}`);
    messageInput.value = "";
  }
}

// Receive message
socket.on("chat", (msg) => {
  appendMessage(`Stranger: ${msg}`);
});

function appendMessage(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  messages.appendChild(li);
}

// Voice Call with WebRTC
let localStream, peer;

async function startCall() {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  peer = new RTCPeerConnection();

  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice", event.candidate);
    }
  };

  peer.ontrack = (event) => {
    document.getElementById("remoteAudio").srcObject = event.streams[0];
  };

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  socket.emit("offer", offer);
}

socket.on("offer", async (offer) => {
  peer = new RTCPeerConnection();

  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice", event.candidate);
    }
  };

  peer.ontrack = (event) => {
    document.getElementById("remoteAudio").srcObject = event.streams[0];
  };

  await peer.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  socket.emit("answer", answer);
});

socket.on("answer", async (answer) => {
  await peer.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("ice", async (candidate) => {
  if (peer) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }
});
