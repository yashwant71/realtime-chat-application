require("dotenv").config()
const users = {};
const express = require('express')
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const mongoose = require('mongoose');
const axios =require('axios')
const params = {}

app.set('view engine', 'html'); //for app.render
app.engine('html', require('ejs').renderFile); //for app.render

app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.render(__dirname + '/index.html', params)
})

// mongoose.connect("mongodb://0.0.0.0:27017/chatdb")
mongoose
    .connect(process.env.DATABASE,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("DB CONNECTED")
    });
function checkcollection(name) {
    //  mongoose.connection.on('open', (ref)=> {  
        console.log('ola amigos')
        mongoose.connection.db.listCollections().toArray(function (err, names) {//GETTING EXISTING COLLECTIONS 'S NAMES
            console.log("working inside")
            // return names
            names.forEach((item)=>{
                console.log(item.name)
                // console.log('check function')
            })
            // console.log(myCollections[0].name); // [{ name: 'dbname.myCollection' }]
            // console.log(myCollections)
        });
    // })
}

const chatSchema = mongoose.Schema({
    name: String,
    message: String,
    Date: String,
    pos: String
});

function store(collname, Name, Message, Pos) {
    const chatModel = mongoose.model(`${collname}`, chatSchema, `${collname}`);
    const saveInDB = async () => {
        let data = new chatModel({
            name: Name,
            message: Message,
            Date: gettime(),
            pos: Pos
        })
        let result = await data.save();
        console.log(collname, result);
    }
    saveInDB();
}
const req = async () => {//TO GET RANDOM NAME FROM API
    const response = await axios.get('http://names.drycodes.com/10?nameOptions=starwarsFirstNames')
    return response.data
}

io.on('connection', socket => {

    req().then((data)=>{//TO GET RANDOM NAME GENERATED IN PROMPT
        var proxynameis =data[1]
        socket.emit('proxyNameGet',proxynameis)
        })
    
    socket.on('new-user-joined', name => {
        console.log("New user", io.engine.clientsCount, name)
        users[socket.id] = name;

        mongoose.connection.db.listCollections().toArray(function (err, names) {
            names.forEach((item)=>{
                if(name===item.name){
                    const chatModel = mongoose.model(`${name}`, chatSchema, `${name}`);
                    const findInDB =async ()=>{
                        let data =await chatModel.find();
                        // console.log(data);
                        socket.emit('appenddata',data)
                    }
                    findInDB();
                }
            })
        });
        console.log("yeh its good")
        socket.broadcast.emit('user-joined', name);
        //FOR STORING THE DATA ->
        Object.entries(users).forEach(([prop]) => { //prop is socket.id
            if (users[prop] != users[socket.id]) {
                store(users[prop], users[socket.id], ":Joined the chat", "right")
            }
        });
    });
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id] //who sent the message
        })
        //FOR STORING THE DATA ->
        Object.entries(users).forEach(([prop]) => { //prop is socket.id
            if (users[prop] != users[socket.id]) {
                store(users[prop], users[socket.id], message, 'left') //recieved data clients
            } else {
                store(users[socket.id], 'You',":"+ message, 'right') //sent data client
            }
        });
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        //FOR STORING THE DATA ->
        Object.entries(users).forEach(([prop]) => { //prop is socket.id
            if (users[prop] != users[socket.id]) {
                store(users[prop], users[socket.id], ":Left the chat", "left")
            }
        });
        delete users[socket.id];
    });
})

function gettime() {
    //getting current time
    var curtime = undefined;
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let session = "AM";

    if (hh > 12) {
        hh = hh - 12;
        session = "PM";
    }
    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    ss = (ss < 10) ? "0" + ss : ss;
    return curtime = hh + ":" + mm + session;
}
const port = process.env.PORT || 4000
httpServer.listen(port, () => {
    console.log(`http://localhost:${port}`)
});