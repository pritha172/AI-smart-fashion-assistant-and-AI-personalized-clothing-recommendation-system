import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const registerUser = async (e) => {

    e.preventDefault();

    const userData = {
      name: name,
      email: email,
      password: password,
      gender: gender
    };

    console.log(userData);

    try {

      const response = await API.post(
        "/register",
        userData
      );

      console.log(response.data);

      // Remember that user is logged in
      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem(
    "user",
    JSON.stringify({
        name: name,
        email: email,
        gender: gender
    })
);

      alert("Registration Successful");

      // Open Home page
      navigate("/home");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");

    }

  };

  return (

    <div className="auth-container">

      <h1>Create Account</h1>

      <form onSubmit={registerUser}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >

          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

        </select>

        <button type="submit">
          Register
        </button>

      </form>

      {/* Login message */}

      <p className="login-message">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>

    </div>

  );
}

export default Register;