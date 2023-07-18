import { Button, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import LoginIcon from '@mui/icons-material/Login';
import "../assets/LoginScreen.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // We are consuming our user-management context to
  // get & set the user details here
  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);

  // We are using React's "useState" hook to keep track
  //  of the form values.
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // This function will be called whenever the user edits the form.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // This function will redirect the user to the
  // appropriate page once the authentication is done.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  // Since there can be chances that the user is already logged in
  // but whenever the app gets refreshed the user context will become
  // empty. So we are checking if the user is already logged in and
  // if so we are redirecting the user to the home page.
  // Otherwise we will do nothing and let the user to login.
  const loadUser = async () => {
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        // Redirecting them once fetched.
        redirectNow();
      }
    }
  };

  // This useEffect will run only once when the component is mounted.
  // Hence this is helping us in verifying whether the user is already logged in
  // or not.
  useEffect(() => {
    loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function gets fired when the user clicks on the "Login" button.
  const onSubmit = async (event) => {
    try {
      // Here we are passing user details to our emailPasswordLogin
      // function that we imported from our realm/authentication.js
      // to validate the user credentials and login the user into our App.
      const user = await emailPasswordLogin(form.email, form.password);
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
        flexDirection: "row",
        maxWidth: "300px",
        margin: "auto",
      }}
    >
      <div className="sign-in">
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
        <h1 className="chat-app">
          <span className="text-wrapper-7">🗨️ </span>
          <span className="text-wrapper-8">ChatApp</span>
        </h1>
        <p className="text-wrapper">Sign in to your account</p>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          name="email"
          value={form.email}
          onChange={onFormInputChange}
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
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          value={form.password}
          onChange={onFormInputChange}
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
          startIcon={<LoginIcon />}
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
          Login
        </Button>
        {/* <p>
          Don't have an account?{" "}
          <Link className="text-wrapper-5" to="/register">
            Signup
          </Link>
        </p> */}
        <p className="don-t-have-an">
          <span className="span-letter">Don’t have an account?</span>
          <span className="text-wrapper-4">&nbsp;</span>
          <Link className="text-wrapper-5" to="/register">Sign up</Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
