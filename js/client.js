const socket = io('http://localhost:8000');

const form =document.getElementById('send-container');
const messageInput =document.getElementById('messageInp');
const messageContainer =document.querySelector(".container");

var audio = new Audio('ting.mp3');
var idd = undefined;
const append =(message,position)=>{
    const messageElement =document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);

    var timeElement =document.createElement('div');
    timeElement.classList.add("timebox");
    timeElement.classList.add(position+"time")

    //getting current time
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
    var curtime = hh+":"+mm+session;
    timeElement.innerText =curtime;
    messageElement.append(timeElement)
    // messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){
        audio.play();
    }
    
    var random = Math.random()
    messageElement.setAttribute('id',`${random}`)
    var smoothscroll =document.getElementById(`${random}`)
    console.log(smoothscroll);
    smoothscroll.scrollIntoView({behavior: "smooth", block: "start"});

}
// function addbtn(){
// form.append('<button class="btn"><i class="fa-solid fa-2x fa-paper-plane"></i></button>')
// }

form.addEventListener('submit' ,(e)=>{
    e.preventDefault();
    const message =messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})
const name = prompt("enter your name");
socket.emit('new-user-joined', name);

socket.on('user-joined', name =>{
append(`${name} joined the chat`, 'right' );
})

socket.on('receive',data =>{
    append(`${data.name}: ${data.message}`,'left');
})

socket.on('left', name =>{
    append(`${name} left the chat`,'right')
})