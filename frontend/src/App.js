// import logo from "./logo.svg";
import "./App.css";

import Home from "./pages/HomeScreen";
import Login from "./pages/LoginScreen";
import Chat from "./pages/ChatScreen";
import Settings from "./pages/SettingsScreen";
import Test from "./pages/TestScreen";
import Loading from "./pages/LoadingScreen";
import NavBar from "./pages/NavBar";
import Register from "./pages/SignupScreen";
import PrivateRoute from "./pages/PrivateRoute.page";
import { UserProvider } from "./contexts/user.context";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App(props) {
  return (
    <Router>
      <div className="App">
        <NavBar />
        {/* We are wrapping our whole app with UserProvider so that */}
        {/* our user is accessible through out the app from any page*/}
        <UserProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              {/* We are protecting our Home Page from unauthenticated */}
              {/* users by wrapping it with PrivateRoute here. */}
              <Route exact path="/" element={<Home />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/test" element={<Test />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
