import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Profile.css";


function getInitials(name = "") {

    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

}


function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getLoggedInUser = () => {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {
            return null;
        }


        try {

            return JSON.parse(savedUser);

        }
        catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            return null;

        }

    };


    // =====================================================
    // FETCH PROFILE
    // =====================================================

    const fetchProfile = async () => {

        const user =
            getLoggedInUser();


        if (!user || !user.id) {

            setError(
                "Please login to view your profile."
            );

            setLoading(false);

            return;

        }


        try {

            setLoading(true);
            setError("");


            const response = await API.get(
                `/profile/${user.id}`
            );


            console.log(
                "Profile API response:",
                response.data
            );


            setProfile(
                response.data
            );

        }
        catch (error) {

            console.error(
                "Profile error:",
                error
            );


            setError(
                "Unable to load your profile. Please try again."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );


        alert(
            "Logged out successfully."
        );


        navigate(
            "/login"
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="profile-page">

                <div className="profile-loading-card">

                    <div className="loading-avatar">
                        ✨
                    </div>

                    <h2>
                        Loading Your Profile
                    </h2>

                    <p>
                        Preparing your personal fashion dashboard...
                    </p>

                    <div className="profile-loader"></div>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="profile-page">

                <div className="profile-error-card">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Load Profile
                    </h2>

                    <p>
                        {error}
                    </p>


                    <div className="error-actions">

                        <button
                            className="retry-btn"
                            onClick={fetchProfile}
                        >
                            Try Again
                        </button>


                        <button
                            className="login-btn"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Go to Login
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // NO PROFILE
    // =====================================================

    if (!profile || !profile.user) {

        return (

            <div className="profile-page">

                <div className="profile-error-card">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Profile Not Available
                    </h2>

                    <p>
                        Profile information could not be found.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // USER DATA
    // =====================================================

    const user = profile.user;

    const analysis =
        profile.analysis || {};


    // =====================================================
    // PROFILE UI
    // =====================================================

    return (

        <div className="profile-page">


            {/* =============================================
                HERO SECTION
            ============================================= */}

            <section className="profile-hero">

                <p className="profile-label">
                    MY FASHION PROFILE
                </p>


                <h1>
                    Your Personal Style Space ✨
                </h1>


                <p className="profile-hero-text">
                    View your fashion preferences, AI style
                    analysis and wardrobe activity all in one place.
                </p>

            </section>


            <div className="profile-container">


                {/* =========================================
                    PROFILE MAIN CARD
                ========================================= */}

                <section className="profile-main-card">


                    {/* =====================================
                        PROFILE HEADER
                    ===================================== */}

                    <div className="profile-cover">

                        <div className="profile-cover-pattern">
                            ✦ &nbsp; ✧ &nbsp; ✦
                        </div>

                    </div>


                    <div className="profile-user-section">


                        <div className="profile-avatar">

                            {getInitials(
                                user.name
                            )}

                        </div>


                        <div className="profile-user-info">

                            <p className="welcome-text">
                                Welcome back
                            </p>


                            <h2>
                                {user.name || "Fashion Lover"}
                            </h2>


                            <p className="profile-email">

                                {user.email || "No email available"}

                            </p>


                            <span className="fashion-member">

                                ✨ AI Fashion Member

                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        STATISTICS
                    ===================================== */}

                    <div className="profile-stats">


                        <div className="profile-stat-card">

                            <div className="stat-icon wardrobe-icon">
                                👗
                            </div>


                            <div>

                                <p className="stat-number">

                                    {profile.wardrobe_count ?? 0}

                                </p>


                                <p className="stat-title">

                                    Wardrobe Items

                                </p>

                            </div>

                        </div>


                        <div className="profile-stat-card">

                            <div className="stat-icon cart-icon">
                                🛍️
                            </div>


                            <div>

                                <p className="stat-number">

                                    {profile.cart_count ?? 0}

                                </p>


                                <p className="stat-title">

                                    Cart Items

                                </p>

                            </div>

                        </div>


                        <div className="profile-stat-card">

                            <div className="stat-icon ai-icon">
                                ✨
                            </div>


                            <div>

                                <p className="stat-number">

                                    {analysis.body_shape
                                        ? "✓"
                                        : "—"}

                                </p>


                                <p className="stat-title">

                                    AI Style Analysis

                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    TWO COLUMN CONTENT
                ========================================= */}

                <div className="profile-content-grid">


                    {/* =====================================
                        PERSONAL INFORMATION
                    ===================================== */}

                    <section className="profile-section-card">


                        <div className="section-heading">

                            <div>

                                <p className="section-label">
                                    ACCOUNT DETAILS
                                </p>

                                <h2>
                                    Personal Information
                                </h2>

                            </div>


                            <span className="section-icon">
                                👤
                            </span>

                        </div>


                        <div className="profile-info-list">


                            <div className="profile-info-item">

                                <div className="info-icon">
                                    👤
                                </div>


                                <div>

                                    <p>
                                        Full Name
                                    </p>

                                    <h4>
                                        {user.name || "—"}
                                    </h4>

                                </div>

                            </div>


                            <div className="profile-info-item">

                                <div className="info-icon">
                                    ✉️
                                </div>


                                <div>

                                    <p>
                                        Email Address
                                    </p>

                                    <h4>
                                        {user.email || "—"}
                                    </h4>

                                </div>

                            </div>


                            <div className="profile-info-item">

                                <div className="info-icon">
                                    ⚧
                                </div>


                                <div>

                                    <p>
                                        Gender
                                    </p>

                                    <h4>
                                        {user.gender || "Not specified"}
                                    </h4>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        AI FASHION PROFILE
                    ===================================== */}

                    <section className="profile-section-card ai-profile-card">


                        <div className="section-heading">

                            <div>

                                <p className="section-label">
                                    AI PERSONALIZATION
                                </p>

                                <h2>
                                    Your AI Fashion Profile
                                </h2>

                            </div>


                            <span className="section-icon">
                                ✨
                            </span>

                        </div>


                        <p className="ai-profile-description">

                            Your AI analysis helps create personalized
                            fashion recommendations based on your
                            unique features.

                        </p>


                        <div className="ai-style-grid">


                            <div className="ai-style-card">

                                <span>
                                    🧍
                                </span>

                                <p>
                                    Body Shape
                                </p>

                                <h4>
                                    {analysis.body_shape ||
                                        "Not analyzed"}
                                </h4>

                            </div>


                            <div className="ai-style-card">

                                <span>
                                    🙂 
                                </span>

                                <p>
                                    Face Shape
                                </p>

                                <h4>
                                    {analysis.face_shape ||
                                        "Not analyzed"}
                                </h4>

                            </div>


                            <div className="ai-style-card">

                                <span>
                                    🎨
                                </span>

                                <p>
                                    Skin Tone
                                </p>

                                <h4>
                                    {analysis.skin_tone ||
                                        "Not analyzed"}
                                </h4>

                            </div>

                        </div>


                        <button
                            className="analyze-style-btn"
                            onClick={() =>
                                navigate("/analysis")
                            }
                        >

                            ✨ Analyze My Style

                        </button>

                    </section>

                </div>


                {/* =========================================
                    QUICK ACTIONS
                ========================================= */}

                <section className="quick-actions-section">

                    <div className="section-heading">

                        <div>

                            <p className="section-label">
                                QUICK ACCESS
                            </p>

                            <h2>
                                Explore Your Fashion Space
                            </h2>

                        </div>

                    </div>


                    <div className="quick-actions-grid">


                        <button
                            className="quick-action-card"
                            onClick={() =>
                                navigate("/wardrobe")
                            }
                        >

                            <span>
                                👗
                            </span>

                            <div>

                                <h3>
                                    My Wardrobe
                                </h3>

                                <p>
                                    Manage your clothing collection
                                </p>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            className="quick-action-card"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >

                            <span>
                                🛒
                            </span>

                            <div>

                                <h3>
                                    My Cart
                                </h3>

                                <p>
                                    View your selected fashion items
                                </p>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            className="quick-action-card"
                            onClick={() =>
                                navigate("/history")
                            }
                        >

                            <span>
                                🕒
                            </span>

                            <div>

                                <h3>
                                    Style History
                                </h3>

                                <p>
                                    View your previous AI analyses
                                </p>

                            </div>

                            <b>
                                →
                            </b>

                        </button>

                    </div>

                </section>


                {/* =========================================
                    LOGOUT
                ========================================= */}

                <div className="profile-footer">

                    <div>

                        <h3>
                            Want to switch accounts?
                        </h3>

                        <p>
                            You can safely logout from your account here.
                        </p>

                    </div>


                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >

                        Logout →

                    </button>

                </div>


            </div>

        </div>

    );

}


export default Profile;