const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
require('dotenv').config();


const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
const roomManager = new (require('./resources/js/roomManager'))();

// support request
app.use(bodyParser.json());                         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());                            // to support JSON-encoded bodies
app.use(express.urlencoded());                      // to support URL-encoded bodies

//add the router folders
app.use(express.static(__dirname + '/public'));             // Store all assets, js and css files in public folder.
app.use(express.static(__dirname + '/resources/views'));    // Store all HTML files in view folder.

app.use('/', router);       // add the router

//routes and ioController
require('./resources/js/routes')(router, roomManager);          
require('./resources/js/ioController')(io, roomManager);

// app.listen(process.env.port || 80);

io.sockets.on("error", e => console.log(e));
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
