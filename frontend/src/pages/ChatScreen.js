import React from "react";
import "../assets/ChatScreen.css";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import bird from "../assets/profilepics/bird.png";
import Loading from "./LoadingScreen";
import Test from "./TestScreen";
import Welcome from "./WelcomeScreen";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleClick = (conversation) => {
    // Handle the click event
    setSelectedConversation(conversation);
    setIsLoading(false);
    // Perform any action you want based on the clicked conversation
  };

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
        <div className="LeftBoxNav">
        <h1>Header</h1>
        <Button
          variant="contained"
          color="primary"
          onClick= {() => {
            setIsLoading(true);
            setSelectedConversation(null);
          }}
          style={{
            background:
              "linear-gradient(90deg, rgb(198.69, 82.06, 18.21) 0%, rgb(232.69, 148.14, 21.33) 100%)",
            borderRadius: "6px",
            color: "#ffffff",
            fontFamily: "Inter",
            fontSize: "20px",
            fontWeight: "600",
            letterSpacing: "0",
            lineHeight: "normal",
            position: "relative",
            whiteSpace: "nowrap",
            height: "60px",
            marginTop: "1rem",
            width: "200px",
          }}
        >
          Find Somebody
        </Button>
        </div>
        {/* <div>
          {conversations.map((conversation) => (
            <div class="ChatBox">
              <div key={conversation._id}>
                <p>User: {conversation.user}</p>
                <p>User1: {conversation.user1}</p>
                <p>User2: {conversation.user2}</p>
                <p>Last Message: {conversation.last_message_sent}</p>
                <p>Last Message Time: {conversation.last_message_time}</p>
              </div>
            </div>
          ))}
        </div> */}
        {conversations.map((conversation) => (
          <button
            className="OuterBox"
            key={conversation._id}
            onClick={() => handleClick(conversation)}
          >
            <img src={bird} alt="bird" className="profilePic" />
            <div className="InnerChatBox">
              <div className="ChatName">{conversation.user}</div>
              <div className="innerInnerChatBox">
                <div className="ChatMessage">
                  {conversation.last_message_sent}
                </div>
                <div className="ChatTime">
                  - {conversation.last_message_time}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="RightBox">
        {selectedConversation ? (
          <Test conversation={selectedConversation} />
        ) : !isLoading ? (
          <Welcome setIsLoading={setIsLoading} />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default Chat;
