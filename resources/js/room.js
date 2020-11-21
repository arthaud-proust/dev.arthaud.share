module.exports = class Room {
    constructor(roomManager, code, admins) {
        this.roomManager = roomManager;
        this.code = code;
        this.admins = admins;
        this._users = [];

        this.adminCode = Array(20).fill('-').map(()=>{
            return this.roomManager.codeChars[Math.floor(Math.random()*this.roomManager.codeChars.length)];
        }).join('');
    }

    get json() {
        return JSON.stringify({
            code: this.code,
            admins: this.admins
        });
    }

    get users() {
        return this._users
    }

    validAdminCode(adminCode) {
        return adminCode === this.adminCode;
    }

    connected(username) {
        return this._users.includes(username)
    }

    join(username) {
        if(this.connected(username)) {
            return 'exist'
        } else {
            this._users.push(username)
            return 'done'
        }
    }

    leave(username) {
        const index = this._users.indexOf(username);
        if (index > -1) {
            this._users.splice(index, 1);
        }
    }
}