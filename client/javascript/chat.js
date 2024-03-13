
const socket = io.connect("http://localhost:8500");


let username = prompt("Enter Your Name");
// let username = "Tirtha";
let messageInput = document.querySelector('#message_input');
let sendButton = document.querySelector('#send');
let chatSection = document.querySelector('#chat-section');
let chatHeading = document.querySelector('#chat-heading-p');
let activeUserList = document.querySelector('.onlineuserlist');
let system = document.querySelector('#whole-system');
let noti_sound = document.querySelector('#notification_sound');


chatHeading.textContent = `${username}`;

socket.emit('user',username);

let msg  = messageInput.value.trim();
if(msg.length==0){
    socket.emit('stop_typing',username);
}

let isTyping = false;
messageInput.addEventListener('input',(e)=>{
    isTyping = !isTyping;
    socket.emit('typing',`${username} is Typing......`)
})

sendButton.addEventListener("click",(e)=>{
    let message  = messageInput.value.trim();
    if(!message){
        return;
    }
    let time = new Date().getHours()+":"+new Date().getMinutes();
    let renderData = {
        message:message,
        username:username,
        currenttime:time
    }
    var messageSound = new Audio('/music/sound.mp3');
    messageSound.play();
    socket.emit("chat_messsage",renderData);
    let myMessage = `<div class="message-box">
                            <div class="avatar">
                                ${username.charAt(0)}
                            </div>
                            <div class="message my-message">
                                <div class="message-heading">
                                    <strong class="name">${username}</strong> <span class="time">${time}</span>
                                </div>
                                <p>${ messageInput.value}</p>
                            </div>
                        </div>`;
    chatSection.insertAdjacentHTML("beforeend",myMessage);
    socket.emit('stop_typing',username);
    messageInput.value = '';
});

socket.on('typing',(data)=>{
    chatHeading.textContent = data;
});

socket.on('stop_typing',(data)=>{
    chatHeading.textContent = username;
})



socket.on('oldmessages', (oldmessages) => {
    oldmessages.forEach((curr) => {
        let otherMessage;
        if(curr.username==username){
            otherMessage = `<div class="message-box">
                                <div class="avatar">${curr.username.charAt(0)}</div>
                                <div class="message my-message">
                                    <div class="message-heading">
                                        <strong class="name">${curr.username}</strong> <span class="time">${curr.currenttime}</span>
                                    </div>
                                    <p>${curr.message}</p>
                                </div>
                            </div>`;
        }
        else{
            otherMessage = `<div class="message-box-right">
                                <div class="avatar">${curr.username.charAt(0)}</div>
                                <div class="message">
                                    <div class="message-heading">
                                        <strong class="name">${curr.username}</strong> <span class="time">${curr.currenttime}</span>
                                    </div>
                                    <p>${curr.message}</p>
                                </div>
                            </div>`;
        }
        
        chatSection.insertAdjacentHTML("beforeend", otherMessage);
    });
});


socket.on('server_messsage',(data)=>{
    let otherMessage = `<div class="message-box-right">
                            <div class="avatar">
                                ${data.username.charAt(0)}
                            </div>
                            <div class="message">
                                <div class="message-heading">
                                    <strong class="name">${data.username}</strong> <span class="time">${data.currenttime}</span>
                                </div>
                                <p>${data.message}</p>
                            </div>
                        </div>`;
    chatSection.insertAdjacentHTML("beforeend",otherMessage);
});

socket.on('activeUsersClient',(users)=>{
    activeUserList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('li');
        userDiv.textContent = user;
        activeUserList.appendChild(userDiv);
    });
})
        
socket.on('activeUsers', (users) => {
    activeUserList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('li');
        userDiv.textContent = user;
        activeUserList.appendChild(userDiv);
    });
});



socket.on('newJoinedUser',(username)=>{
    let newUserMessage = `<div class="newjoineemessage">
                                ${username} has joined the chat
                          </div>`;
    chatSection.insertAdjacentHTML("beforeend",newUserMessage);
})

socket.on('newJoinedUserClient',(username)=>{
    let newUserMessage = `<div class="newjoineemessage">
                                ${username} has joined the chat
                          </div>`;
    chatSection.insertAdjacentHTML("beforeend",newUserMessage);
})

socket.on('userLeft',(username)=>{
    let newUserMessage = `<div class="userleftmessage">
                                ${username} has left the chat
                          </div>`;
    chatSection.insertAdjacentHTML("beforeend",newUserMessage);
})
