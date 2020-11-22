const room = window.location.pathname.split('/')[2];
const socket = io.connect(window.location.origin);

socket.emit('users', room);


socket.on('redirect', to=>{
    window.location.href = to;
})

const testUsers = ['LOrem', 'Ipsum', 'Dolor', 'SIr', 'Amet'];

socket.on('users', users=>{
    const usersCount = document.querySelector('#users-count');
    const usersList = document.querySelector('#users-list');
    if(usersCount) usersCount.innerHTML =`${users.length} connected`;
    if(usersList) usersList.innerHTML = [...users, ...testUsers].map(user=>`<span class="user">${user}</span>`).join('');

})