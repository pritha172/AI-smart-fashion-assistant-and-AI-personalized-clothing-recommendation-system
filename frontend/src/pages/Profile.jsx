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

        const user = getLoggedInUser();

        if (!user || !user.id) {

            setError(
                "Please login to view your profile."
            );

            setLoading(false);

            return;

        }


        try {

            console.log(
                "Fetching profile for user:",
                user.id
            );


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
                "Unable to load your profile."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD PROFILE WHEN PAGE OPENS
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

                <div className="profile-card">

                    <p className="profile-loading">
                        Loading profile...
                    </p>

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

                <div className="profile-card">

                    <p className="profile-error">
                        {error}
                    </p>

                    <button
                        className="logout-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Go to Login
                    </button>

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

                <div className="profile-card">

                    <p>
                        Profile information not available.
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

            <div className="profile-card">


                {/* =========================================
                    PROFILE HEADER
                ========================================= */}

                <div className="profile-header">

                    <div className="profile-avatar">

                        {getInitials(
                            user.name
                        )}

                    </div>


                    <div>

                        <p className="profile-name">

                            {user.name}

                        </p>


                        <p className="profile-email">

                            {user.email}

                        </p>

                    </div>

                </div>


                {/* =========================================
                    PROFILE BODY
                ========================================= */}

                <div className="profile-body">


                    {/* =====================================
                        STATISTICS
                    ===================================== */}

                    <div className="stat-grid">


                        <div className="stat-card stat-pink">

                            <p className="stat-value">

                                {profile.wardrobe_count ?? 0}

                            </p>

                            <p className="stat-label">

                                Wardrobe items

                            </p>

                        </div>


                        <div className="stat-card stat-purple">

                            <p className="stat-value">

                                {profile.cart_count ?? 0}

                            </p>

                            <p className="stat-label">

                                Cart items

                            </p>

                        </div>

                    </div>


                    {/* =====================================
                        PERSONAL INFORMATION
                    ===================================== */}

                    <p className="section-label">

                        Personal information

                    </p>


                    <div className="info-list">


                        <div className="info-row">

                            <span className="info-key">

                                Name

                            </span>

                            <span className="info-value">

                                {user.name || "—"}

                            </span>

                        </div>


                        <div className="info-row">

                            <span className="info-key">

                                Email

                            </span>

                            <span className="info-value">

                                {user.email || "—"}

                            </span>

                        </div>


                        <div className="info-row">

                            <span className="info-key">

                                Gender

                            </span>

                            <span className="info-value">

                                {user.gender || "—"}

                            </span>

                        </div>


                        <div className="info-row">

                            <span className="info-key">

                                Skin tone

                            </span>

                            <span className="info-value">

                                {analysis.skin_tone || "Not analyzed"}

                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        AI FASHION PROFILE
                    ===================================== */}

                    <p className="section-label">

                        AI Fashion Profile

                    </p>


                    <div className="badge-row">


                        <span className="badge">

                            Body:{" "}

                            {analysis.body_shape ||
                                "Not analyzed"}

                        </span>


                        <span className="badge">

                            Face:{" "}

                            {analysis.face_shape ||
                                "Not analyzed"}

                        </span>


                        <span className="badge">

                            Skin:{" "}

                            {analysis.skin_tone ||
                                "Not analyzed"}

                        </span>

                    </div>


                    {/* =====================================
                        LOGOUT
                    ===================================== */}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >

                        Logout

                    </button>


                </div>

            </div>

        </div>

    );

}

export default Profile;