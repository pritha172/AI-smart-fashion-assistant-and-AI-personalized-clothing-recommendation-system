import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Wardrobe.css";

function Wardrobe() {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const BACKEND_URL = "http://127.0.0.1:8000";

    // =====================================================
    // CREATE IMAGE URL
    // =====================================================

    const getImageUrl = (imagePath) => {

        if (!imagePath) {
            return "";
        }

        const cleanPath = String(imagePath)
            .replaceAll("\\", "/")
            .replace(/^\/+/, "");

        return `${BACKEND_URL}/${cleanPath}`;
    };


    // =====================================================
    // GET USER
    // =====================================================

    const getUser = () => {

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        }
        catch {
            return null;
        }
    };


    // =====================================================
    // LOAD WARDROBE
    // =====================================================

    useEffect(() => {
        loadWardrobe();
    }, []);


    const loadWardrobe = async () => {

        try {

            setLoading(true);
            setError("");

            const user = getUser();

            if (!user) {
                setError("Please login first.");
                setLoading(false);
                return;
            }

            if (!user.id) {
                setError(
                    "User ID not found. Please login again."
                );
                setLoading(false);
                return;
            }

            const response = await API.get(
                `/wardrobe/my-wardrobe?user_id=${user.id}`
            );

            setItems(
                response.data.wardrobe || []
            );

        }
        catch (error) {

            console.error(
                "Wardrobe loading error:",
                error
            );

            setError(
                "Unable to load your wardrobe."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = async () => {

        if (!search.trim()) {
            loadWardrobe();
            return;
        }

        try {

            const user = getUser();

            if (!user) {
                alert("Please login first.");
                return;
            }

            const response = await API.get(
                `/wardrobe/search?user_id=${user.id}&query=${encodeURIComponent(search)}`
            );

            setItems(
                response.data.wardrobe || []
            );

        }
        catch (error) {

            console.error(
                "Search error:",
                error
            );

            alert(
                "Unable to search wardrobe."
            );

        }

    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = () => {

        setSearch("");
        loadWardrobe();

    };


    // =====================================================
    // LIKE / UNLIKE
    // =====================================================

    const handleLike = async (wardrobeId) => {

        try {

            const user = getUser();

            if (!user) {
                alert("Please login first.");
                return;
            }

            if (!user.id) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            const response = await API.put(
                `/wardrobe/${wardrobeId}/like`,
                null,
                {
                    params: {
                        user_id: user.id
                    }
                }
            );

            const updatedLiked =
                response.data.liked;

            setItems(
                previousItems =>
                    previousItems.map(item =>
                        item.id === wardrobeId
                            ? {
                                ...item,
                                liked: updatedLiked
                            }
                            : item
                    )
            );

        }
        catch (error) {

            console.error(
                "Like error:",
                error
            );

            alert(
                "Unable to update like."
            );

        }

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (wardrobeId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this clothing item?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const user = getUser();

            if (!user) {
                alert("Please login first.");
                return;
            }

            if (!user.id) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            await API.delete(
                `/wardrobe/${wardrobeId}`,
                {
                    params: {
                        user_id: user.id
                    }
                }
            );

            setItems(
                previousItems =>
                    previousItems.filter(
                        item =>
                            item.id !== wardrobeId
                    )
            );

        }
        catch (error) {

            console.error(
                "Delete error:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data.detail ||
                    "Unable to delete wardrobe item."
                );

            }
            else {

                alert(
                    "Unable to delete wardrobe item."
                );

            }

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="wardrobe-page">

                <div className="wardrobe-loading">

                    <div className="wardrobe-loading-icon">
                        ✨
                    </div>

                    <h1>
                        MY WARDROBE
                    </h1>

                    <p>
                        Organizing your fashion collection...
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

            <div className="wardrobe-page">

                <div className="wardrobe-message">

                    <div className="wardrobe-message-icon">
                        👗
                    </div>

                    <h1>
                        MY WARDROBE
                    </h1>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="wardrobe-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="wardrobe-hero">

                <div>

                    <p className="wardrobe-eyebrow">
                        YOUR PERSONAL COLLECTION
                    </p>

                    <h1>
                        MY <span>WARDROBE.</span>
                    </h1>

                    <p className="wardrobe-subtitle">
                        Your clothes, your style, your possibilities.
                        Manage everything in one place and let AI
                        help you create the perfect look.
                    </p>

                </div>

                <div className="wardrobe-hero-badge">

                    <span>✨</span>

                    <div>
                        <strong>
                            {items.length}
                        </strong>

                        <small>
                            {items.length === 1
                                ? "ITEM"
                                : "ITEMS"}
                        </small>
                    </div>

                </div>

            </section>


            {/* =================================================
                AI BANNER
            ================================================= */}

            <section className="wardrobe-ai-banner">

                <div className="wardrobe-ai-icon">
                    ✨
                </div>

                <div className="wardrobe-ai-text">

                    <p>
                        AI STYLE ASSISTANT
                    </p>

                    <h2>
                        Ready to create your next look?
                    </h2>

                    <span>
                        Let AI analyze your wardrobe and
                        recommend an outfit made for you.
                    </span>

                </div>

                <button
                    onClick={() => navigate("/analysis")}
                >
                    GET AI LOOK →
                </button>

            </section>


            {/* =================================================
                SEARCH
            ================================================= */}

            <section className="wardrobe-tools">

                <div className="wardrobe-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search category, color, season..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                handleSearch();
                            }

                        }}
                    />

                    {search && (

                        <button
                            className="search-clear"
                            onClick={clearSearch}
                        >
                            ✕
                        </button>

                    )}

                </div>

                <button
                    className="wardrobe-search-btn"
                    onClick={handleSearch}
                >
                    SEARCH
                </button>

            </section>


            {/* =================================================
                COUNT
            ================================================= */}

            <div className="wardrobe-heading-row">

                <div>

                    <p className="wardrobe-section-label">
                        YOUR COLLECTION
                    </p>

                    <h2>
                        All Pieces
                    </h2>

                </div>

                <span className="wardrobe-count">
                    {items.length}{" "}
                    {items.length === 1
                        ? "piece"
                        : "pieces"}
                </span>

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {items.length === 0 ? (

                <div className="wardrobe-empty">

                    <div className="empty-icon">
                        👗
                    </div>

                    <h2>
                        Your wardrobe is waiting.
                    </h2>

                    <p>
                        No clothing items were found.
                        Try another search or add clothes
                        to your wardrobe.
                    </p>

                    <button
                        onClick={() => navigate("/analysis")}
                    >
                        ✨ GO TO AI ASSISTANT
                    </button>

                </div>

            ) : (

                /* =================================================
                   GRID
                ================================================= */

                <div className="wardrobe-grid">

                    {items.map((item) => (

                        <article
                            className="wardrobe-card"
                            key={item.id}
                        >

                            {/* IMAGE */}

                            <div className="wardrobe-image-wrap">

                                <img
                                    src={getImageUrl(
                                        item.image_url
                                    )}
                                    alt={
                                        item.category ||
                                        "Wardrobe item"
                                    }
                                    className="wardrobe-image"
                                    onError={(e) => {

                                        e.currentTarget.style.display =
                                            "none";

                                    }}
                                />

                                <button
                                    className={
                                        item.liked
                                            ? "wardrobe-like liked"
                                            : "wardrobe-like"
                                    }
                                    onClick={() =>
                                        handleLike(item.id)
                                    }
                                    title="Like"
                                >
                                    {item.liked
                                        ? "❤️"
                                        : "♡"}
                                </button>

                                <span className="wardrobe-category">
                                    {item.category ||
                                        "CLOTHING"}
                                </span>

                            </div>


                            {/* INFORMATION */}

                            <div className="wardrobe-card-content">

                                <h3>
                                    {item.category ||
                                        "Clothing"}
                                </h3>

                                <div className="wardrobe-details">

                                    <div>
                                        <span>
                                            COLOR
                                        </span>

                                        <strong>
                                            {item.color ||
                                                "Unknown"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            SEASON
                                        </span>

                                        <strong>
                                            {item.season ||
                                                "All"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            OCCASION
                                        </span>

                                        <strong>
                                            {item.occasion ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                </div>


                                <div className="wardrobe-card-actions">

                                    <button
                                        className="wardrobe-delete"
                                        onClick={() =>
                                            handleDelete(
                                                item.id
                                            )
                                        }
                                    >
                                        🗑️ DELETE
                                    </button>

                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Wardrobe;