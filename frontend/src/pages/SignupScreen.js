import { Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import "../assets/SignupScreen.css";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // As explained in the Login page.
  const { emailPasswordSignup } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  // As explained in the Login page.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // As explained in the Login page.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  // As explained in the Login page.
  const onSubmit = async () => {
    try {
      const user = await emailPasswordSignup(
        form.email,
        form.password,
        form.username
      );
      if (user) {
        redirectNow();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        margin: "auto",
      }}
    >
      <div className="sign-in">
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
        <h1 className="chat-app">
          <span className="text-wrapper-7">🗨️ </span>
          <span className="text-wrapper-8">ChatApp</span>
        </h1>
        <p className="text-wrapper">Sign up for an account</p>
        <TextField
          label="Username"
          type="text"
          variant="outlined"
          name="username"
          value={form.username}
          onInput={onFormInputChange}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#12131e",
            color: "#ffffff",
            fontFamily: "Inter Regular",
            fontSize: "20px",
            fontWeight: "400",
            letterSpacing: "0",
            lineHeight: "normal",
            position: "relative",
            whiteSpace: "nowrap",
            width: "524px",
            marginTop: "1rem",
          }}
          InputProps={{ inputProps: { style: { color: "#fff" } } }}
          color="primary"
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          name="email"
          value={form.email}
          onInput={onFormInputChange}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#12131e",
            color: "#ffffff",
            fontFamily: "Inter Regular",
            fontSize: "20px",
            fontWeight: "400",
            letterSpacing: "0",
            lineHeight: "normal",
            position: "relative",
            whiteSpace: "nowrap",
            width: "524px",
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          value={form.password}
          onInput={onFormInputChange}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#12131e",
            color: "#ffffff",
            fontFamily: "Inter Regular",
            fontSize: "20px",
            fontWeight: "400",
            letterSpacing: "0",
            lineHeight: "normal",
            position: "relative",
            whiteSpace: "nowrap",
            width: "524px",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
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
            height: "72px",
            marginTop: "4rem",
            width: "524px",
          }}
        >
          Signup
        </Button>
        <p className="don-t-have-an">
          <span className="span-letter">Have an account already?</span>
          <span className="text-wrapper-4">&nbsp;</span>
          <Link className="text-wrapper-5" to="/login">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Signup;
