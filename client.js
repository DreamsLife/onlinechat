const socket = io();
const chatBox = document.getElementById("chat-box");

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (message !== "") {
    socket.emit("chat message", message);
    input.value = "";
  }
}

socket.on("chat message", (msg) => {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = msg;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Basic simulated voice using getUserMedia
let mediaStream;

async function startVoiceCall() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioTrack = mediaStream.getAudioTracks()[0];
    console.log("Voice call started", audioTrack);
    alert("Voice call started (audio is captured locally)");
    // For real WebRTC implementation, peer connection goes here
  } catch (error) {
    alert("Voice call failed: " + error.message);
  }
}

function stopVoiceCall() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    alert("Voice call stopped");
  }
}
