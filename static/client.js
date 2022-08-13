// const socket = io('http://localhost:4000');
const socket = io('https://group-chit-chat-app.herokuapp.com');

const form =document.getElementById('send-container');
const messageInput =document.getElementById('messageInp');
const messageContainer =document.querySelector(".container");

var audio = new Audio('static/ting.mp3');
var idd = undefined;
function gettime(){
    //getting current time
    var curtime=undefined;
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
    return curtime = hh+":"+mm+session;
}
const append =(message,position)=>{
    const messageElement =document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);

    var timeElement =document.createElement('div');
    timeElement.classList.add("timebox");
    timeElement.classList.add(position+"time")

    timeElement.innerText = gettime();
    messageElement.append(timeElement)
    // messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){
        audio.play();
    }
    
    var random = Math.random()
    messageElement.setAttribute('id',`${random}`)
    var smoothscroll =document.getElementById(`${random}`)
    smoothscroll.scrollIntoView({behavior: "smooth", block: "start"});
}
const appendsaved =(message,giventime,position)=>{
    const messageElement =document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);

    var timeElement =document.createElement('div');
    timeElement.classList.add("timebox");
    timeElement.classList.add(position+"time")

    timeElement.innerText = giventime;
    messageElement.append(timeElement)
    // messageElement.classList.add(position);
    messageContainer.append(messageElement);  
    var random = Math.random()
    messageElement.setAttribute('id',`${random}`)
    var smoothscroll =document.getElementById(`${random}`)
    smoothscroll.scrollIntoView({behavior: "smooth", block: "start"});
}


socket.on('proxyNameGet',proxynameis=>{
    console.log(proxynameis)
    const name =prompt("enter your name",proxynameis);
    socket.emit('new-user-joined', name);
})

socket.on('appenddata',(data)=>{
    data.forEach((item)=>{
        appendsaved(`${item.name} ${item.message}`,item.Date,item.pos)
    })
})
socket.on('user-joined', name =>{
append(`${name} joined the chat`, 'right' );
})

form.addEventListener('submit' ,(e)=>{
    e.preventDefault(); 
    const message =messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})


socket.on('receive',data =>{
    append(`${data.name}: ${data.message}`,'left');
})

socket.on('left', name =>{
    append(`${name} left the chat`,'right')
})