const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  createMessage,
  createLocationMessage
} = require("./helperFunctions/messages");
const {
  addNewUser,
  removeUser,
  getUser,
  getAllUsersInTheChatRoom
} = require("./helperFunctions/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

const welcomeMessage = "Welcome!";
// const newUserJoiningMessage = "A new user has joined!";
// const userLeavingMessage = "A user has just left!";

io.on("connection", socket => {
  console.log("New WebSocket connection");

  socket.on("join a chat room", ({
    username,
    chatRoom
  }, callback) => {
    const
      newUser = addNewUser({
        id: socket.id,
        username,
        chatRoom
      })

    // const {
    //   err,
    //   newUser
    // } = addNewUser({
    //   id: socket.id,
    //   ...options
    // });

    console.log(newUser);

    // join the chat room
    socket.join(newUser.chatRoom);
    // console.log(newUser.chatRoom);
    // console.log(newUser.username);

    // send welcome messages and notifying others in the same chat room that a new user has joined 
    socket.emit("message", createMessage(welcomeMessage));
    socket.broadcast.to(newUser.chatRoom).emit("message", createMessage(`${newUser.username} just joined your chat room!`));

    // call back when successfully joining the chat room
    // callback();

  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.chatRoom).emit("message", createMessage(message));
    callback();
  });

  socket.on("shareLocation", (coordinates, callback) => {
    io.to(user.chatRoom).emit(
      "locationMessage",
      createLocationMessage(
        `https://google.com/maps?q=${coordinates.latitude},${
          coordinates.longitude
        }`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {

    // remove the user being disconnected
    const userToBeRemoved = removeUser(socket.id);

    if (userToBeRemoved) {
      io.to(userToBeRemoved.chatRoom).emit("message", createMessage(`${userToBeRemoved.username} just left the chat room.`));

    }

  });
});

server.listen(port, err => {
  if (err) {
    console.log(err);
  }

  console.log(`App started on Port ${port}`);
});