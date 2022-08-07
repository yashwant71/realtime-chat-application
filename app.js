const users = {};
const express =require('express')
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

app.set('view engine', 'html');//for app.render
app.engine('html', require('ejs').renderFile);//for app.render

app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

const params ={}
app.get('/',(req,res)=>{
    console.log("working")
    res.render(__dirname+'/index.html',params)
})

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        console.log("New user",name)
        users[socket.id]= name;
        socket.broadcast.emit('user-joined',name);
    });
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
const port =4000
httpServer.listen(port,()=>{
    console.log(`localhost:${port}`)
});


