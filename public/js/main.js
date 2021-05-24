// DOM Model
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//QS for username and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

//Creating a connection instance
const socket = io();

// Sending username and room to the server
socket.emit('joinroom', { username, room });

//Message from Server
socket.on('message', text => {
  outputMessage(text)

  //Scrolling message and display the last message
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//adding new user and room to the client side
// received from the server
socket.on('roomusers', ({ room, users }) => {
  addusers(users)
  addroom(room)
})

//Adding new room to the client side
function addroom(room) {
  roomName.innerHTML = `${room}`
}

//Adding new user to the client side
function addusers(user) {
  userList.innerHTML = `${user.map(user => `<li>
  ${user.username}
  </li>`).join('')} `
}

//While submitting the message
chatForm.addEventListener('submit', (e) => {
  //preventing the default action of the submit button
  e.preventDefault();

  //Storing the message typed by the client 
  const msg = e.target.elements.msg.value;

  //clearing the input message field and targetting on it only
  e.target.elements.msg.value = null
  e.target.elements.msg.focus();

  //Sending the message to the server
  socket.emit('chatMessage', msg);
})


//Display the message to the chatBox inbox
function outputMessage(text) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${text.username} <span>${text.time}</span></p>
  <p class="text">
    ${text.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}

