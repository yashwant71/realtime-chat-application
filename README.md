# Realtime-group-chat-application
## Overview
it is an web application that lets you chat between multi-client/Group with a simple and responsive UI ,also the messages are stored in MongoDB database in a collection of named by YOUR NAME ,also auto retrieves the chats whenever user/client relog with his name back.

## Deployed at
https://group-chit-chat-app.herokuapp.com/

## How it works
by using Socket.io (which is library for javascript to make bidirection communication between server and client)
we setup the proper communication such that the data is shared between clients and server ,and send back to either one or more client also at the same time saving the data in database in realtime at the server side.

whenever a client relogs by his name ,server checks for the data on that name if exist it sends the whole data to that client and there is used to append on the interface like it was when he closed the window.

we make get request at random name generator api using axios ,and suggest a name from that requested data to the client who logs in ,in the prompt.

## extra-features
1) random-name is suggested whenever client run the app ,via a random name generator API.
2) emoji sharing is added.
3) shows how many/who clients are currently connected to the application in realtime

## softwares/languages used
NODEJS,MongoDB,JavaScript,Css,HTML

node modules used-
ExpressJS ,Socket.io,ejs,axios ,dotenv ,mongoose

Database used-
MongoDB

database name: "chatdb"
collection name: YOUR NAME

connected to mongoDB Atlas

## About Socket.io
socket.io => Socket.IO is an event-driven JavaScript library for real-time web applications. It enables real-time, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js. Both components have a nearly identical API.

