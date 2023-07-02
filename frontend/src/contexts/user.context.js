import { createContext, useState } from "react";
import { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";

import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

// Creating a Realm App Instance
const app = new App(APP_ID);

// Creating a user context to manage and access all the user related functions
// across different component and pages.
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to login user into our Realm using their email & password
  const emailPasswordLogin = async (email, password) => {
    const credentials = Credentials.emailPassword(email, password);
    const authedUser = await app.logIn(credentials);
    setUser(authedUser);
    return authedUser;
  };

  // Function to signup user into our Realm using their email & password
  const emailPasswordSignup = async (email, password, username) => {
    try {
      // let email_add = string(email);
      // let password_add = string(password);
      await app.emailPasswordAuth.registerUser({ email, password });

      // Since we are automatically confirming our users we are going to login
      // the user using the same credentials once the signup is complete.
      const credentials = Credentials.emailPassword(email, password);
      const authedUser = await app.logIn(credentials);
      setUser(authedUser);
      let id = app.currentUser.id;
      console.log(id, username);
      socket.emit("adduserdata", id, username );
      // unset user 
      setUser(null);
      emailPasswordLogin(email, password);
      return authedUser;  
    } catch (error) {
      throw error;
    }
  };

  // Function to fetch-user(if the user is already logged in) from local storage
  const fetchUser = async () => {
    if (!app.currentUser) return false;
    try {
      await app.currentUser.refreshCustomData();
      // Now if we have a user we are setting it to our user context
      // so that we can use it in our app across different components.
      setUser(app.currentUser);
      return app.currentUser;
    } catch (error) {
      throw error;
    }
  };

  // Function to logout user from our Realm
  const logOutUser = async () => {
    if (!app.currentUser) return false;
    try {
      await app.currentUser.logOut();
      // Setting the user to null once loggedOut.
      setUser(null);
      return true;
    } catch (error) {
      throw error;
    }
  };

  //function to fetch custom data from user
  const fetchCustomData = async () => {
    if (!app.currentUser) return false;
    try {
      //return user data
      return app.currentUser.id;
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        emailPasswordLogin,
        emailPasswordSignup,
        logOutUser,
        fetchCustomData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
