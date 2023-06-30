const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

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

function add_message_to_mongodb(chatroomID, sender, message) {
  client.connect();
  client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  const dbName = "chat";
  const collectionName = "Chatrooms";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const timestamp_now = new Date();

  const findQuery = { chatroomID: chatroomID };
  let chatroom = "";

  try {
    const cursor = collection.find(findQuery).sort({ chatroomID: 1 });
    //   console.log(cursor);
    cursor.forEach((chats) => {
      console.log(
        `Chatroom ID ${chats.chatroomID} with ${chats.User1} and ${chats.User2}`
      );
      chatroom = chats.chatroomID;
    });
    // add a linebreak
    console.log();
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  }
}

add_message_to_mongodb("1", "elotes", "hello");
