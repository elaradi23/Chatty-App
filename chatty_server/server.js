const WebSocket = require("ws");
const express = require("express");
const SocketServer = require("ws").Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server });

let onlineUsers = { numberOfUsers: 0, type: "numberOfUsers" };
let colors = ["red", "blue", "green", "yellow", "purple", "black"];

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on("connection", ws => {
  console.log("Client connected");
  onlineUsers.numberOfUsers = wss.clients.size;
  userColor = colors[Math.floor((Math.random()*5))];
  wss.broadcast(onlineUsers);

  console.log(userColor);

  ws.on("message", function incoming(data) {
    let message = JSON.parse(data);

    switch (message.type) {
      case "postMessage":
        // handle incoming message
        message.type = "incomingMessage";
        message.color = userColor;
        break;
      case "postNotification":
        // handle incoming notification
        message.type = "incomingNotification";
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + message.type);
    }

    console.log(`User ${message.username} said ${message.content}`);
    wss.broadcast(message);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
    console.log("Client disconnected");
    onlineUsers.numberOfUsers = wss.clients.size;
    wss.broadcast(onlineUsers);
  });
});
