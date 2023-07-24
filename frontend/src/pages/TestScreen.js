/////////////////////////////////////////////////
// Chat Component
//
// Copyright (c) [2023], Manoj Elango
// This project is open-source.
//
// Purpose: This component represents the chat screen of the application, allowing users
// to view and send messages in a conversation. It connects to the Socket.io server for real-time
// communication and fetches chat messages from the server.

/* example of conversations array
contact: "Anonymous Dragon"
timestamp: "2021-09-02T18:30:00.000Z"
group_id: "6140c1c0a6b3c3e6b4a0a0a0"
user: "TheRealManoj"
content: "Hello"
_id: "6140c1c0a6b3c3e6b4a0a0a1"
*/

// Import necessary dependencies and styles
import React, { useContext, useEffect, useState, useRef } from "react";
import "../assets/TestScreen.css";
import { UserContext } from "../contexts/user.context";
import socket from "../contexts/socket.js";
import bird from "../assets/profilepics/bird.png";

// Component for the chat screen
function Test({ conversation }) {
  const { fetchCustomData } = useContext(UserContext);
  const [chatMessages, setChatMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [newMessage, setNewMessage] = useState(""); // State variable to store the new message
  const messageRef = useRef(null);

  // Store the previous conversation ID in a ref
  const previousConversationId = useRef(conversation._id);

  useEffect(() => {
    // Function to fetch chat messages and user data
    const fetchChatmessages = async () => {
      try {
        // Disconnect from the previous room ID if it exists
        if (previousConversationId.current) {
          socket.emit("leaveRoom", previousConversationId.current);
        }

        // Emit an event to request user data from the server
        socket.emit("fetchuserdata", await fetchCustomData());

        // Listen for the response from the server containing the user data
        socket.on("userdata", (data) => {
          setSender(data); // Update the 'sender' state with the user data received
        });

        // Emit an event to request chat messages for a specific conversation
        socket.emit("fetchchatmessages", conversation._id);

        // Listen for the response from the server containing the chat messages
        socket.on("chatmessages", (data) => {
          setChatMessages(data); // Update the 'chatMessages' state with the data received from Socket.io
        });
      } catch (error) {
        console.log(error);
      }
      messageRef.current.scrollTop = messageRef.current.scrollHeight; // Scroll to the bottom of the messages
    };

    // Call the fetchChatmessages function
    fetchChatmessages();

    // Listener for new incoming messages
    const messageListener = (message) => {
      // Check if the message already exists in chatMessages
      const messageExists = chatMessages.some((msg) => msg._id === message._id);

      // If the message with the same key (_id) doesn't exist, add it to chatMessages
      if (!messageExists) {
        setChatMessages((prevChatMessages) => [...prevChatMessages, message]);
        console.log("New message received:", message);
      }
      messageRef.current.scrollTop = messageRef.current.scrollHeight; // Scroll to the bottom of the messages
    };
    socket.on("newmessage", messageListener);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("newmessage", messageListener);

      // Disconnect from the current room ID
      socket.emit("leaveRoom", conversation._id);
    };
  }, [conversation._id]);

  // Function to handle sending a new message
  const handleMessageSend = (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    if (newMessage.trim() === "") return; // Ignore empty messages

    const messageData = {
      content: newMessage,
      group_id: conversation._id,
      timestamp: new Date().getTime(),
      user: sender, // Assuming 'sender' is the username of the current user
    };

    // Emit an event to send the new message data to the server
    socket.emit("sendmessage", messageData);

    // Add the new message to the chatMessages state
    setChatMessages((prevChatMessages) => [...prevChatMessages, messageData]);
    setNewMessage(""); // Clear the message input after sending
    messageRef.current.scrollTop = messageRef.current.scrollHeight; // Scroll to the bottom of the messages
  };

  const homescreen = () => { 
    window.location.href = "/chat";
  }

  return (
    <div className="chat-box">
      {/* Navbar */}
      <div className="navbar">
        <div>
          {/* User's profile and name */}
          <img src={bird} alt="Profile" />
          <span style={{ fontWeight: "bold" }}>{conversation.user}</span>
        </div>
        <button onClick={homescreen}>Back</button>
      </div>

      {/* Messages */}
      <div className="messages" ref={messageRef}>
        {chatMessages.map((message) => (
          <div
            key={message._id} // Assuming '_id' is a unique identifier for each message
            className={`message ${
              message.user === sender ? "sender-message" : "receiver-message"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Message form */}
      <div className="message-form">
        <form onSubmit={handleMessageSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button onClick={handleMessageSend}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default Test;
