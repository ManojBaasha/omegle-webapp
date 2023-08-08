import { Button } from "@mui/material";
import { useContext, useEffect } from "react";
import React, { useState } from "react";
import { UserContext } from "../contexts/user.context";
import io from "socket.io-client";
import { Link, useLocation, useNavigate } from "react-router-dom";

import socket from "../contexts/socket.js";

export default function Home() {
  const { logOutUser, fetchCustomData } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // console.log("Home Screen");
    //print the custom data of the user
    const printuserdata = async () => {
      try {
        //call the socket.io server
        socket.emit("fetchuserdata", await fetchCustomData());

        socket.on("userdata", (data) => {
          // console.log("Username : ", data);
          setUsername(data);
        });
        // const customData = await fetchCustomData();
        // console.log("Custom Data: ", customData);
      } catch (error) {
        alert(error);
      }
    };
    printuserdata();
    // Clean up the socket connection and listeners
    return () => {
      socket.disconnect();
      socket.off("userdata");
    };
  }, []);

  // This function is called when the user clicks the "Logout" button.
  const logOut = async () => {
    try {
      // Calling the logOutUser function from the user context.
      const loggedOut = await logOutUser();
      // Now we will refresh the page, and the user will be logged out and
      // redirected to the login page because of the <PrivateRoute /> component.
      if (loggedOut) {
        window.location.reload(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  // this function is called to redirect to chat screen
  const sendtochat = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/chat");
  };

  return (
    <>
      <h1>Welcome to {username}! You have logged in Successfully</h1>
      <Button variant="contained" onClick={logOut}>
        Logout
      </Button>
      <Button variant="contained" onClick={sendtochat}>
        Go to CHats
      </Button>
    </>
  );
}
