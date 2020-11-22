const u = require('./utils');

module.exports = function(io, roomManager) {
    // let broadcaster
    io.sockets.on("connection", socket => {
        
        socket.on('join', function (data) {

            if(roomManager.getRoom(data.room).join(u.escape(data.username)) == 'exist') {
                console.log('Already connected');
                socket.emit('redirect', '/choose-a-name/'+data.room);
            }

            socket.join(data.room);
            console.log(`${data.username} joined the room ${data.room}`);
            socket.room = data.room

            

            io.sockets.in(data.room).emit('users', roomManager.getRoom(data.room).users);
            // socket.emit('message', {type:'annoucement', content:`${data.username} joined the room`});
            io.sockets.in(data.room).emit('message', {type:'annoucement', content: u.escape(`${data.username} joined the room`)});
        });

        socket.on('leave', function (data) {
            socket.leave(data.room);
            console.log(`${data.username} left the room ${data.room}`);
            socket.room = undefined

            roomManager.getRoom(data.room).leave(u.escape(data.username));


            io.sockets.in(data.room).emit('users', roomManager.getRoom(data.room).users);
            // socket.emit('message', {type:'annoucement', content:`${data.username} joined the room`});
            io.sockets.in(data.room).emit('message', {type:'annoucement', content: u.escape(`${data.username} left the room`)});
        });

        socket.on('userConnected', function (data) {
            socket.emit('canTakeUsername', !roomManager.getRoom(data.room).connected(data.username));
        });

        socket.on('users', function (room) {
            socket.emit('users', roomManager.getRoom(room).users);
        });

        socket.on('delete', function (data) {
            io.sockets.in(data.room).emit('message', {type:'annoucement', content:`Video ended`});
            io.sockets.in(data.room).emit('ended');
            socket.leave(data.room);
            roomManager.delete(data.room);
            console.log(`Room ${data.room} ended`);
            socket.room = undefined
        });

        socket.on('messageSended', function (message) {
            console.log(`[${socket.room}] ${message.author}: "${message.content}" `);
            // socket.emit('message', {type:'message', author:message.author, content: message.content});
            io.sockets.to(socket.room).emit('message', {type:'message', author: u.escape(message.author), content: u.escape(message.content)});
        });

        socket.on("broadcaster", () => {
            // broadcaster = socket.id;
            // socket.broadcast.emit("broadcaster");
            io.sockets.in(socket.room).emit("broadcaster")
            io.sockets.in(socket.room).emit('message', {
                type:'annoucement', 
                content:`
                    <h1>Hi there!</h1>
                    <h3>How can you invite people to join you?</h3>
                    <p>By sharing this link: <code>share.arthaud.dev/room/${socket.room}</code></p>
                    <p>Or by giving them the code of the room: <code>${socket.room}</code></p>
                    <span style="color:#9c3d3d">Note for admin: don't share the link of your actual page, it's the admin page.</span>
                    `
                });
        });
        
        socket.on("watcher", () => {
            // socket.to(broadcaster).emit("watcher", socket.id);
            io.sockets.in(socket.room).emit("watcher", socket.id);
        });

        socket.on("disconnect", () => {
            // socket.to(broadcaster).emit("disconnectPeer", socket.id);
            io.sockets.in(socket.room).emit("disconnectPeer", socket.id);
        });

        socket.on("offer", (id, message) => {
            socket.to(id).emit("offer", socket.id, message);
        });
        socket.on("answer", (id, message) => {
            socket.to(id).emit("answer", socket.id, message);
        });
        socket.on("candidate", (id, message) => {
            socket.to(id).emit("candidate", socket.id, message);
        });
    });
}



