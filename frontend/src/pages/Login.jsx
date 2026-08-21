import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();

        const loginData = {
            email: email,
            password: password
        };

        try {

            const response = await API.post(
                "/login",
                loginData
            );

            console.log("Login response:", response.data);

            // Check for backend error
            if (response.data.error) {

                alert(response.data.error);
                return;
            }

            // Check whether user information was received
            if (!response.data.user) {

                alert("Login successful, but user information was not received.");
                return;
            }

            // Save login status
            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            // Save logged-in user's information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            console.log(
                "Saved user:",
                response.data.user
            );

            alert("Login Successful");

            // Go to Home page
            navigate("/home");

        }
        catch (error) {

            console.log("Login error:", error);

            if (error.response) {

                console.log(
                    "Backend error:",
                    error.response.data
                );

            }

            alert("Login Failed");

        }

    };


    return (

        <div className="auth-container">

            <h1>Login</h1>

            <form onSubmit={loginUser}>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            <p style={{ marginTop: "20px" }}>

                Don't have an account?{" "}

                <span
                    onClick={() => navigate("/register")}
                    style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline"
                    }}
                >
                    Register here
                </span>

            </p>

        </div>

    );

}

export default Login;