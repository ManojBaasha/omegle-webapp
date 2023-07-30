import React from "react";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import socket from "../contexts/socket.js";

function Loading({ setIsLoading, setSelectedConversation }) {
  const { fetchCustomData } = useContext(UserContext);
  useEffect(() => {
    const join_connect_pool = async () => {
      try {
        //call the socket.io server
        socket.emit("fetchuserdata", await fetchCustomData());
        // Emit an event to add user to the queue
        socket.on("userdata", (data) => {
          // console.log("Chat user: ", data);
          //fetch chat_collection from the database
          socket.emit("pair_with_random_user", data );
        });
      } catch (error) {
        console.log(error);
      }
    };
    join_connect_pool();
  }, []);

  useEffect(() => {
    // Event listener for pairing with another user
    socket.on("paired", (conversation) => {
      console.log("Paired with user: ", conversation);
      // Redirect to the main chat page (ChatRoom)
      setSelectedConversation(conversation);
      setIsLoading(false);

      // Remove the event listener
      socket.off("paired");

    });
  }, [socket]);

  return (
    <div>
      <h1>Loading Screen</h1>
      <p>Waiting to connect with a random user...</p>
    </div>
  );
}

export default Loading;
