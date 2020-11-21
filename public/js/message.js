const messages = document.querySelector('#messages');
const input = document.querySelector('#input');
const send = document.querySelector('#send');
const sendMessage = function() {
    socket.emit('messageSended', {author: username, content: input.value});
    input.value='';
}
send.addEventListener("click", sendMessage)
input.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        sendMessage()
    }
})


socket.on("connect", () => {
    socket.emit('join', {room, username: username});
});

socket.on("message", (message) => {
    if(message.type == 'message') {
        messages.innerHTML += `<div class="message"><b class="author">${message.author}</b><p class="content">${message.content}<p></div>`;
    } else {
        messages.innerHTML += `<span>${message.content}</span>`
    }
    messages.scrollTo(0,messages.scrollHeight);
});



window.onunload = window.onbeforeunload = () => {
    socket.emit('leave', {room, username: username});
    socket.close();
};



