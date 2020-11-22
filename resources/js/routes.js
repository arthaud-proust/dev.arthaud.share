const path = require('path');
// const utils = require('./utils');

module.exports = function(router, roomManager) {

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        // console.log((new Date()).toLocaleTimeString('fr-FR', {minute: '2-digit', hour: '2-digit', second:'2-digit'})+': '+req.path);
        // console.log(req.path);
        next();
    });

    router.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/index.html'));
    });

    router.get('/choose-a-name/:room', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/name.html'));
    });

    router.get('/choose-a-name/:room/:adminCode', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/adminName.html'));
    });

    router.get('/message/:room', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/message.html'));
    });

    router.post('/create', function(req, res) {
        const room = roomManager.create(req.body.code);
        res.redirect(`/admin/${room.code}/${room.adminCode}` );
    });

    router.post('/join', function(req, res) {
        let room = roomManager.getRoom(req.body.code);
        if (room) {
            res.redirect(`/room/${room.code}`);
        } else {
            res.redirect('/404' );
        }
    });

    router.get('/admin/:roomCode/:adminCode', function(req, res) {
        if(req.params.roomCode==null || !roomManager.validCode(req.params.roomCode) || !roomManager.roomExist(req.params.roomCode)) {
            res.redirect('/404' );
        } else {
            const room = roomManager.getRoom(req.params.roomCode);
            if (room.validAdminCode(req.params.adminCode)) {
                res.sendFile(path.join(__dirname, '/../views/admin.html'));
            } else {
                res.redirect('/403' );
            }
        }
    });
    router.post('/admin/:roomCode/:adminCode/stream', function(req, res) {
        if(req.params.roomCode==null || !roomManager.validCode(req.params.roomCode) || !roomManager.roomExist(req.params.roomCode)) {
            res.redirect('/404' );
        } else {
            const room = roomManager.getRoom(req.params.roomCode);
            if (room.validAdminCode(req.params.adminCode)) {
                res.sendFile(path.join(__dirname, '/../views/room.html'));
            } else {
                res.redirect('/403' );
            }
        }
    });

    router.get('/room/:code', function(req, res) {
        if(req.params.code==null || !roomManager.validCode(req.params.code) || !roomManager.roomExist(req.params.code)) {
            res.redirect('/404' );
        } else {
            res.locals.room = roomManager.getRoom(req.params.code);
            res.sendFile(path.join(__dirname, '/../views/room.html'));
        }
    });

    router.get('/room/:code/object', function(req, res) {
        res.send(roomManager.getRoom(req.params.code).json);
    });


    router.get('/:error', function(req, res) {
        res.sendFile(path.join(__dirname, `/../views/${req.params.error}.html`));
    });
};