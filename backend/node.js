/////////////////////////////////////////////////
// Socket.io
//
// Copyright (c) [2023], Manoj Elango
// This project is open-source.
//
// Purpose: This file contains the server-side code for Socket.io integration. It sets up
// a server and handles various events such as user connections, fetching user data,
// creating new users, fetching chat data, sending and receiving messages, and managing
// rooms for the chat application.

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors("http://localhost:3000"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    autoConnect: false,
  },
});

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
};

/////////////////////////////////////////////////
// Realm App ID and MongoDB Realm API Key
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
const envPath = path.resolve(__dirname, "../.env");

require("dotenv").config({ path: envPath });

const uri = process.env.mongodb_uri;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// The connect() method does not attempt a connection; instead, it instructs
// the driver to connect using the settings provided when a connection
// is required.
client.connect();

// Provide the name of the database and collection you want to use.
// If the database and/or collection do not exist, the driver and Atlas
// will create them automatically when you first write data.
const dbName = "chat"; // the only database we have

// Create references to the database and collection to run operations on them.
const database = client.db(dbName);
const user_collection = database.collection("user_collection"); // has the collection of all the users usernames and ids
const chat_collection = database.collection("chat_collection"); // has the collection of all the chats created
const message_collection = database.collection("message_collection"); // has the collection of all the messages sent

const anonymousAnimals = [
  "Anonymous Monkey",
  "Anonymous Parrot",
  "Anonymous Elephant",
  "Anonymous Tiger",
  "Anonymous Giraffe",
  "Anonymous Dolphin",
  "Anonymous Koala",
  "Anonymous Penguin",
  "Anonymous Panther",
  "Anonymous Bear",
  "Anonymous Cheetah",
  "Anonymous Gorilla",
  "Anonymous Owl",
  "Anonymous Seahorse",
  "Anonymous Fox",
];

/////////////////////////////////////////////////

// Function to fetch the username of the user from the user collection
async function fetchUserData(socket, data) {
  const findUserQuery = { _id: data };
  try {
    const result = await user_collection.findOne(findUserQuery);
    if (result) {
      socket.emit("userdata", result.username);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log("Error fetching user data:", error);
    socket.emit("error", "Error fetching user data");
  }
}

// Function to create a new user with data in the user_collection
async function addUserdata(id, username) {
  const newUser = {
    _id: id,
    username: username,
  };
  try {
    const result = await user_collection.insertOne(newUser);
    console.log("New User Created: ", result);

    // create a new chat with the user "TheRealManoj" in the chat_collection (default for everyone who creates a new account)
    const newChat = {
      user1: "TheRealManoj",
      user2: username,
      user: "Anonymous Dragon",
      last_message_sent: "",
      last_message_time: "",
      IsMessageRead: true,
    };
    await chat_collection.insertOne(newChat);
  } catch (error) {
    console.log("Failed to create new user or chat:", error);
    // You can choose to emit an error event here if needed
  }
}

// Function to fetch the chat data from the chat_collection
async function fetchChatData(socket, data) {
  const findChatQuery = {
    $or: [
      { user1: data }, // Check if user1 matches the data
      { user2: data }, // Check if user2 matches the data
    ],
  };
  try {
    const final_chatdata = await chat_collection.find(findChatQuery).toArray();
    socket.emit("chatdata", final_chatdata);
  } catch (error) {
    console.log("Error fetching chat data:", error);
  }
}

// Function to fetch the chat messages from the message_collection
async function fetchChatMessages(socket, data) {
  const findMessageQuery = { group_id: data };
  try {
    const final_chatmessages = await message_collection
      .find(findMessageQuery)
      .toArray();
    socket.emit("chatmessages", final_chatmessages);
    socket.join(data); // Join the room with name group_id
    console.log(`Joined room with name ${data}`);
  } catch (error) {
    console.log("Error fetching chat messages:", error);
  }
}

// Function to handle "sendmessage" event
async function sendMessage(socket, messageData) {
  try {
    // Store the received message in the database (assuming you have a MongoDB-like database)
    await message_collection.insertOne(messageData);
    console.log("Message saved to the database:", messageData);

    // Emit the message to the specific room (room name is the group_id)
    socket.to(messageData.group_id).emit("newmessage", messageData);
  } catch (error) {
    console.error("Error saving or sending the message:", error);
  }
}

// Function to close a room if it's empty
function closeRoom(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (room && room.size === 0) {
    io.of("/").adapter.del(roomId);
    console.log(`Room ${roomId} closed.`);
  }
}

// Function to handle a client leaving a specific room
function leaveRoom(socket, roomId) {
  socket.leave(roomId);
  console.log(`User with socket ID ${socket.id} left room ${roomId}`);
}

// Define a pool to store connected users who want to be paired randomly
const userPool = [];

// Function to pair two random users from the pool
function pairRandomUsers() {
  if (userPool.length >= 2) {
    let users = [];

    // Convert the userPool Set to an array for easier random selection
    for (let i = 0; i < userPool.length; i++) {
      users.push(userPool[i][1]);
    }

    // Select two random users from the pool
    const user1 = users[Math.floor(Math.random() * users.length)];
    socketid1 = getsocketidfromusername(user1, userPool);
    removeRowByElement(userPool, user1);
    users = users.filter((user) => user !== user1);

    const user2 = users[Math.floor(Math.random() * users.length)];
    socketid2 = getsocketidfromusername(user2, userPool);
    removeRowByElement(userPool, user2);

    console.log("Paired users:", user1, user2);

    // You can customize the conversation object as per your application needs
    const newChat = {
      user1: user1,
      user2: user2,
      user: getRandomAnimal(),
      last_message_sent: "",
      last_message_time: "",
      IsMessageRead: true,
    };

    try {
      // Assuming chat_collection is your MongoDB collection
      // Replace 'chat_collection' with your actual collection variable
      chat_collection.insertOne(newChat, (error, result) => {
        if (error) {
          console.log("Error in inserting new chat", error);
        } else {
          console.log("Chat inserted successfully ");
        }
      });
    } catch (error) {
      console.log("Error in inserting new chat", error);
    }

    // Emit the "paired" event to both users
    io.to(socketid1).to(socketid2).emit("paired", newChat);
  }
}


function removeRowByElement(array, element) {
  const rowIndex = array.findIndex((row) => row.includes(element));

  if (rowIndex !== -1) {
    array.splice(rowIndex, 1);
  } else {
    console.log("couldnt find array");
  }
}

function getsocketidfromusername(username, userPooltemp) {
  for (let i = 0; i < userPooltemp.length; i++) {
    if (userPooltemp[i][1] == username) {
      return userPooltemp[i][0];
    }
  }
}


// Periodically try to pair users every 5 seconds (adjust the interval as needed)
setInterval(pairRandomUsers, 5000);
setInterval(() => {}, 5000);

// Function to get a random animal from the array
function getRandomAnimal() {
  // Generate a random index within the range of the array
  const randomIndex = Math.floor(Math.random() * anonymousAnimals.length);

  // Return the animal at the random index
  return anonymousAnimals[randomIndex];
}

function addUsertoPool(userPool, newRow) {
  //if userPool is empty
  if (userPool.length == 0) {
    userPool.push(newRow);
    return true;
  }
  console.log("userPool", userPool);

  //check if user exists
  for (let i = 0; i < userPool.length; i++) {
    if (userPool[i][0] == newRow[0]) {
      return false;
    }
  }
  userPool.push(newRow);
}

// Socket.io connection event
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Socket event listeners
  socket.on("fetchuserdata", (data) => {
    fetchUserData(socket, data);
  });

  socket.on("adduserdata", (id, username) => {
    addUserdata(id, username);
  });

  socket.on("fetchchatdata", (data) => {
    fetchChatData(socket, data);
  });

  socket.on("fetchchatmessages", (data) => {
    fetchChatMessages(socket, data);
  });

  socket.on("sendmessage", (messageData) => {
    sendMessage(socket, messageData);
  });

  // Listener for the "leaveRoom" event
  socket.on("leaveRoom", (roomId) => {
    leaveRoom(socket, roomId);
  });

  // Listener for "pair_with_random_user" event from the frontend
  socket.on("pair_with_random_user", (data) => {
    // Add the user to the pool
    row = [socket.id, data];
    if (addUsertoPool(userPool, row)) {
      console.log(`added row ${row} successfully`);
    } else {
      console.log("could not add dublicate user");
    }

    console.log(`User with socket ID ${data} added to the pool.`);
  });

  // Socket disconnect event
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    // Clean up any room IDs the user is still connected to when they disconnect
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      leaveRoom(socket, room);
    });
  });
});

// Start the server
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
