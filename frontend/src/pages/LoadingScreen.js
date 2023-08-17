import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { UserContext } from "../contexts/user.context";
import "../assets/LoadingScreen.css";
import socket from "../contexts/socket";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router";

function Loading() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { fetchCustomData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUserData = (data) => {
    setUsername(data);
    console.log("userdata: ", data);
  };

  useEffect(() => {
    const fetchchatdata = async () => {
      try {
        const customData = await fetchCustomData();
        socket.emit("fetchuserdata", customData);

        socket.on("userdata", handleUserData);

        return () => {};
      } catch (error) {
        // Handle error appropriately
        console.error("Error fetching data:", error);
      }
    };

    fetchchatdata();
  }, []);

  useEffect(() => {
    const handlePaired = (conversationId) => {
      console.log("Paired with user: ", conversationId);

      socket.emit("stop_loading", username);

      // Perform any action you want based on the clicked conversation
      let navigate_string = "/chat/" + conversationId;
      // Remove spaces in the string
      navigate_string = navigate_string.replace(/\s/g, "");
      console.log("Navigating to: ", navigate_string);
      navigate(navigate_string);
    };

    // Event listener for pairing. paired receives the conversation id
    socket.on("paired", (conversationId) => {
      handlePaired(conversationId);
    });
    return () => {};
  }, [socket, navigate, username]);

  const handleStartLoading = async () => {
    // Logic to start loading
    setIsLoading(true);
    console.log("Start loading with username: ", username);
    socket.emit("pair_with_random_user", username);
  };

  const handleStopLoading = () => {
    // Logic to stop loading
    setIsLoading(false);
    socket.emit("stop_loading", username);
  };

  return (
    <div className="container">
      <h1 className="title">Hello World from Loading Screen</h1>
      <p>Username: {username}</p>
      {isLoading ? (
        <div>
          <p>Loading...</p>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleStopLoading}
          >
            Stop Loading
          </Button>
        </div>
      ) : (
        <div className="buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartLoading}
          >
            Start Loading
          </Button>
        </div>
      )}
    </div>
  );
}

export default Loading;
