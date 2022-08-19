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
const append =(message,position)=>{//TO APPEND MESSAGES IN CLIENT
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
const appendsaved =(message,giventime,position)=>{//TO APPEND SAVED MESSAGES FROM DATABASE
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
    if(name===null){
        name =proxynameis;
    }

    const namebox= document.querySelector('.yourName')
    namebox.innerText=name;

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

//TOGGLE DARK MODE LIGHT MODE
var backImg =document.getElementById('backImg');
var toggleMode =document.querySelector('.toggleMode');
var backcontainer=document.querySelector('.backcontainer')
var formContainer =document.querySelector('.form-container')

var navbar =document.querySelector('#navbar')
toggleMode.addEventListener('click',()=>{
    if(toggleMode.classList.contains('fa-sun')){//add dark mode stuff
        toggleMode.classList.remove('fa-sun');
        toggleMode.classList.add('fa-moon');
        
        backImg.src ="static/dark_pc.jpg";
        backImg.style.opacity="1";
        
        backcontainer.style.background = "linear-gradient(34deg, rgba(2,82,45,1) 20%, rgb(12 25 50) 50%, rgba(118,31,48,1) 80%)";
        navbar.style.backgroundColor = 'black';
        formContainer.style.background='linear-gradient(34deg, rgba(2,82,45,1) 20%, rgb(57 28 49) 80%)';
    }
    else{//add light mode stuff
        toggleMode.classList.remove('fa-moon');
        toggleMode.classList.add('fa-sun');

        backImg.src ="static/chatbg.jpg";
        backImg.style.opacity="0.2";
        
        backcontainer.style.background = "linear-gradient(to bottom,rgb(0,200,15,1), rgb(0,200,15,0))";
        navbar.style.backgroundColor = 'rgb(0 200 15)';
        formContainer.style.background='white';
    }
})
function myFunction(x) {
    if (x.matches) { // If media query matches
        toggleMode.addEventListener('click',()=>{
            if(toggleMode.classList.contains('fa-sun')){//add dark mode stuff
                backImg.src ="static/chatbg.jpg";
                backImg.style.opacity="0.2";
            }
            else{//add light mode stuff
                backImg.src ="static/dark_phone.jpg";
                backImg.style.opacity="1";
            }
        })
    } 
    else {
        
    }
  }
  var x = window.matchMedia("(max-width: 420px)") // 420 or less
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction)