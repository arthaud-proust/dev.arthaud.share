const username = localStorage.getItem('share.username');



if (window.location.pathname.startsWith("/choose-a-name")) {
    document.querySelector('#room-code').innerHTML = room;
    const name = document.querySelector('#name');
    const continueButton = document.querySelector('#continue');
    const infoName = document.querySelector('#info-name');
    let canContinue = false;

    function saveName() {
        let uName = name.value.trimLeft()
        if(/\S/gm.test(uName)) {
            if(!canContinue) return
            localStorage.setItem('share.username', uName);
            console.log(uName);
            if(adminCode) {
                window.location.href=`/admin/${room}/${adminCode}`;
            } else {
                window.location.href='/room/'+room;
            }
        } else {
            console.log('e')
            infoName.innerHTML = 'Please provide a name';
            infoName.style.color = '#9c3d3d';
        }
    }

    socket.on('canTakeUsername', function(can) {
        canContinue = can
        infoName.innerHTML = can?'Username available':'Username unavailable';
        infoName.style.color = can?'#3d9c44':'#9c3d3d';
    })

    name.addEventListener("keyup", function(e) {
        socket.emit('userConnected', {room, username:name.value});
        if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
            saveName()
            e.preventDefault()
        }
    })
    continueButton.addEventListener('click', saveName)
} else if(username == undefined && adminCode) {
    window.location.href=`/choose-a-name/${room}/${adminCode}`;
} else if(username == undefined) {
    window.location.href="/choose-a-name/"+room;
}