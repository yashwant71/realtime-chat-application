# realtime-chat-application
process to run-

0> npm i
1> run the "app.js" file in terminal with nodemon
2> localhost:4000 on chrome(preferrably)

features:
1> data is stored of the chat in database for every client,and once you restart and give your name ,your old chats will be there.

database named: "chatdb"
collection name: your name
collections hold the chat and time data ,
mongoose and socket works to make your chat visible to the user.

intro- we "npm install socket.io" after"npm init" .

socket.io => Socket.IO is an event-driven JavaScript library for real-time web applications. It enables real-time, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js. Both components have a nearly identical API.

