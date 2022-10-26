const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const {username , room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
})

socket.on('message',message =>{
  outputMessage(message);
  //scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
})

//emit room data when a new user joins any room
socket.emit('joinRoom',{username,room});

//get user data for a room and add user to list and show room name
socket.on('roomUsers',({room,users}) => {
  outputRoomName(room);
  outputUsers(users);
})

function outputRoomName(room){
  roomName.innerHTML = room;
}

function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

chatForm.addEventListener('submit',e =>{
  e.preventDefault();
  //get text from form submit
  const msg = e.target.elements.msg.value;
  //emit msg to server
  socket.emit('chatMessage',msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = ` <p class="meta">${message.userName}
                    <span>${message.time}</span>
                    </p>
                     <p class="text">
                     ${message.text}
                     </p>`;
  document.querySelector('.chat-messages').appendChild(div);          
}