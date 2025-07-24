
const socket = io();
const form = document.getElementById('chat-form');
const input = document.getElementById('m');
const messages = document.getElementById('messages');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg) {
    appendMessage("You: " + msg);
    socket.emit('chat message', msg);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  appendMessage("Stranger: " + msg);
});

function appendMessage(text) {
  const item = document.createElement('li');
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
