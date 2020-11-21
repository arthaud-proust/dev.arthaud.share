const path = require('path')
const fs = require('fs');

module.exports = {
    escape: function(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    },
    sendNoSignalStream: function(req, res) {
        const random = Math.floor(Math.random()*2);
        const videoPath = path.join(__dirname, `/../assets/no-signal-${random}.mp4`);
        const stat = fs.statSync(videoPath)
        const fileSize = stat.size
        const range = req.headers.range
      
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1
        
            if(start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
                return
            }
            
            const chunksize = (end-start)+1
        
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            })

            const file = fs.createReadStream(videoPath, {start, end})
            file.pipe(res)
        } else {
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            })
            fs.createReadStream(videoPath).pipe(res)
        }
    },


}