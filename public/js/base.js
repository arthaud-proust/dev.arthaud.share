const room = window.location.pathname.split('/')[2];
const adminCode = window.location.pathname.split('/')[3];
const socket = io.connect(window.location.origin);

socket.emit('users', room);


socket.on('redirect', to=>{
    window.location.href = to;
})

socket.on('users', users=>{
    const usersCount = document.querySelector('#users-count');
    const usersList = document.querySelector('#users-list');
    if(usersCount) usersCount.innerHTML =`${users.length} connected`;
    if(usersList) usersList.innerHTML = users.map(user=>`<span class="user">${user}</span>`).join('');

})