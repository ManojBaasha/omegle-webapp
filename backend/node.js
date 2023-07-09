/////////////////////////////////////////////////
// Socket.io

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

// The connect() method does not attempt a connection; instead it instructs
// the driver to connect using the settings provided when a connection
// is required.
client.connect();

// Provide the name of the database and collection you want to use.
// If the database and/or collection do not exist, the driver and Atlas
// will create them automatically when you first write data.
const dbName = "chat";

// Create references to the database and collection in order to run
// operations on them.
const database = client.db(dbName);
const user_collection = database.collection("user_collection");
const chat_collection = database.collection("chat_collection");

/////////////////////////////////////////////////

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  // });

  // socket.on("send_message", (data) => {
  //   socket.to(data.room).emit("receive_message", data);
  // });

  socket.on("fetchuserdata", (data) => {
    async function fetchuserdata() {
      const findUserQuery = { _id: data };
      try {
        const result = await user_collection.findOne(findUserQuery);
        // console.log("Username : ",result.username );
        socket.emit("userdata", result.username);
      } catch (error) {
        console.log(error);
      }
    }
    fetchuserdata();
  });

  socket.on("adduserdata", (id, username) => {
    async function createusername() {
      //create a new user with data in the user_collection
      const newUser = {
        _id: id,
        username: username,
      };
      console.log("New User: ", newUser);
      try {
        const result = await user_collection.insertOne(newUser);
        console.log("New User Created: ", result);
      } catch (error) {
        console.log("failed to create new user: ", error);
      }

      // create a new chat with the user "TheRealManoj" in the chat_collection
      const newChat = {
        user1: "TheRealManoj",
        user2: username,
        user: "Anonymous Dragon",
        last_message_sent: "",
        last_message_time: "",
        IsMessageRead: true,
      };

      try {
        const result = await chat_collection.insertOne(newChat);
        console.log("New Chat Created: ", result);
      } catch (error) {
        console.log("failed to create new chat: ", error);
      }
    }
    createusername();
  });

  socket.on("fetchchatdata", (data) => {
    async function fetchchatdata() {
      //fetch chat data from chat_collection. the data should be either user1 or user2
      console.log("username from backend : ", data);
      const findChatQuery = { user2: data };
      try {
        let final_chatdata = [];
        const result = await chat_collection.find(findChatQuery);
        if (result === null) {
          console.log(
            "Couldn't find any chat that contain {user} as the user.\n"
          );
        } else {
          await result.forEach((chatinbox) => {
            console.log(
              `${chatinbox.user1} and ${chatinbox.user2} are chatting with ${chatinbox.user}`
            );
            //append the chat data to the final_chatdata array
            final_chatdata.push(chatinbox);
          });
          // console.log("chat data : ", result);
          socket.emit("chatdata", final_chatdata);
        }
        // socket.emit("chatdata", result.user);
      } catch (error) {
        console.log("failed to fetch chat data: ", error);
      }
    }
    fetchchatdata();
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
