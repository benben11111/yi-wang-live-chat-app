const socket = io();

// Encapsulate HTML Elements
const $messageForm = document.querySelector("#send-chat-messages-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $shareLocationButton = document.querySelector("#share-location");
const $messages = document.querySelector("#messages");

// Encapsulate HTML templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

// Get user input, username and chat room, by parsing the query string
const queryString = location.search;
console.log(queryString);
const parsedQueryString = Qs.parse(queryString, {
  ignoreQueryPrefix: true
});
console.log(parsedQueryString);
let username = parsedQueryString.username;
let chatRoom = parsedQueryString.chatRoom;
// const parsedObject = {
//   username,
//   chatRoom
// }
// console.log(`${username} and ${chatRoom}`)



// Qs.parse(location.search);

socket.on("message", message => {
  console.log(message);
  const html = Mustache.render($messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", locationMessage => {
  console.log(locationMessage.url);
  const html = Mustache.render($locationMessageTemplate, {
    url: locationMessage.url,
    createdAt: moment(locationMessage.createdAt).format("h:mm A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  // Disable the form to prevent multiple sendings of message
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    // Enable the form again to be able to send message
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("This message was successfully delivered!");
  });
});

$shareLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported on your browser!");
  }

  $shareLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "shareLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        $shareLocationButton.removeAttribute("disabled");
        console.log("Your location is successfully shared!");
      }
    );
  });
});

// Send username and requested chat room to server
socket.emit("join a chat room", {
  username,
  chatRoom
});