import logo from "./logo.svg";
import "./App.css";

import Home from "./components/HomeScreen";
import Login from "./components/LoginScreen";
import Chat from "./components/ChatScreen";
import Settings from "./components/SettingsScreen";
import Test from "./components/TestScreen";
import Loading from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

function App(props) {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/test" element={<Test/>} />
          <Route path="/loading" element={<Loading/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
