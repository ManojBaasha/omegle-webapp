/////////////////////////////////////////////////
// Socket.io

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchuserdata();
    
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
