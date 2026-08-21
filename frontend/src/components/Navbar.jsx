import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    return (

        <nav className="navbar">

            {/* Logo */}

            <Link to="/home" className="fashion-logo">

                <span className="logo-main">
                    AI Smart
                </span>

                <span className="logo-sub">
                    FASHION
                </span>

            </Link>


            {/* Navigation */}

            <div className="nav-links">

                <Link to="/home">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/analysis">
                    AI Assistant
                </Link>

                <Link to="/cart">
                    Cart
                </Link>

                <Link to="/wardrobe-ai">
                    My Wardrobe
                </Link>


                {/* Not logged in */}

                {!isLoggedIn && (

                    <Link
                        to="/register"
                        className="register-btn"
                    >
                        Get Started
                    </Link>

                )}


                {/* Logged in */}

                {isLoggedIn && (

                    <Link
                        to="/profile"
                        className="profile-icon"
                        title="My Profile"
                    >
                        👤
                    </Link>

                )}

            </div>

        </nav>

    );

}

export default Navbar;