import { Link } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
    return (
        <div className="welcome">

            <div className="welcome-card">

                <h1>AI Smart Fashion</h1>

                <p>
                    Discover outfits powered by Artificial Intelligence.
                </p>

                <Link to="/login">
                    <button>Login</button>
                </Link>

                <Link to="/register">
                    <button className="register-btn">
                        Register
                    </button>
                </Link>

            </div>

        </div>
    );
}

export default Welcome;