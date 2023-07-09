import React from "react";
import "../assets/ChatScreen.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";

/* example of conversations array
0: 
  IsMessageRead: true
  last_message_sent: ""
  last_message_time: ""
  user: "Anonymous Dragon"  
  user1: "TheRealManoj"
  user2: "guacs"
  _id: "64a60c1397d0e3e7474d9562"
  __proto__: Object
1:
  IsMessageRead: true
  last_message_sent: ""
  last_message_time: ""
  user: "Anonymous Dragon"
  user1: "TheRealManoj"
  user2: "jonam"
  _id: "64a9e283fa86df03b1f3aa38"
  __proto__: Object
length: 2
*/

import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function Chat() {
  const { fetchCustomData } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchchatdata = async () => {
      try {
        //call the socket.io server
        socket.emit("fetchuserdata", await fetchCustomData());

        socket.on("userdata", (data) => {
          // console.log("Chat user: ", data);
          //fetch chat_collection from the database
          socket.emit("fetchchatdata", data);

          socket.on("chatdata", (conversations) => {
            console.log("Chat data: ", conversations);
            setConversations(conversations); // set the conversations data
          });
        });
      } catch (error) {
        alert("Error in fetching usernmae", error);
      }
    };
    fetchchatdata();
  }, []);

  return (
    <div className="MainBox">
      <div className="LeftBox">
        <h1>Header</h1>
        <div>
          {conversations.map((conversation) => (
            <div class = "ChatBox">
            <div key={conversation._id}>
              <p>User: {conversation.user}</p>
              <p>User1: {conversation.user1}</p>
              <p>User2: {conversation.user2}</p>
              <p>Last Message: {conversation.last_message_sent}</p>
              <p>Last Message Time: {conversation.last_message_time}</p>
            </div>
            </div>
          ))}
        </div>
      </div>

      <div className="RightBox">
        <nav>
          <ul>
            <li>Back</li>
            <li>Whoever you chatting with</li>
            <li>Idk button</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Chat;
