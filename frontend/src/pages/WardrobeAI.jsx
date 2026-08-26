import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./WardrobeAI.css";

function WardrobeAI() {
    const navigate = useNavigate();

    const [clothes, setClothes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [likedItems, setLikedItems] = useState({});

    const BACKEND_URL = "http://127.0.0.1:8000";

    const getUser = () => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) return null;

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return "";

        const cleanPath = String(imageUrl)
            .replaceAll("\\", "/")
            .replace(/^\/+/, "");

        if (cleanPath.startsWith("http")) {
            return cleanPath;
        }

        return `${BACKEND_URL}/${cleanPath}`;
    };

    useEffect(() => {
        fetchWardrobe();
    }, []);

    const fetchWardrobe = async () => {
        try {
            setLoading(true);
            setError("");

            const user = getUser();

            if (!user || !user.id) {
                setError("Please login first.");
                return;
            }

            const response = await API.get(
                `/wardrobe/my-wardrobe?user_id=${user.id}`
            );

            const wardrobe = response.data.wardrobe || [];

            setClothes(wardrobe);

            const likeState = {};

            wardrobe.forEach((item) => {
                likeState[item.id] = item.liked === true;
            });

            setLikedItems(likeState);
        } catch (err) {
            console.error("Wardrobe error:", err);
            setError("Unable to load your wardrobe.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        const user = getUser();

        if (!user || !user.id) {
            alert("Please login first.");
            return;
        }

        if (!searchQuery.trim()) {
            fetchWardrobe();
            return;
        }

        try {
            setSearching(true);
            setError("");

            const response = await API.get(
                `/wardrobe/search?user_id=${user.id}&query=${encodeURIComponent(
                    searchQuery
                )}`
            );

            setClothes(response.data.wardrobe || []);
        } catch (err) {
            console.error("Search error:", err);
            setError("Unable to search wardrobe.");
        } finally {
            setSearching(false);
        }
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        fetchWardrobe();
    };

    const toggleLike = async (wardrobeId) => {
        try {
            const user = getUser();

            if (!user || !user.id) {
                alert("Please login first.");
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

            const newLiked = response.data.liked;

            setLikedItems((previous) => ({
                ...previous,
                [wardrobeId]: newLiked
            }));

            setClothes((previous) =>
                previous.map((item) =>
                    item.id === wardrobeId
                        ? {
                              ...item,
                              liked: newLiked
                          }
                        : item
                )
            );
        } catch (err) {
            console.error("Like error:", err);

            alert(
                err.response?.data?.detail ||
                    "Unable to update like status."
            );
        }
    };

    const deleteItem = async (wardrobeId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this clothing item?"
        );

        if (!confirmDelete) return;

        try {
            const user = getUser();

            if (!user || !user.id) {
                alert("Please login first.");
                return;
            }

            await API.delete(`/wardrobe/${wardrobeId}`, {
                params: {
                    user_id: user.id
                }
            });

            setClothes((previous) =>
                previous.filter(
                    (item) => item.id !== wardrobeId
                )
            );

            setLikedItems((previous) => {
                const updated = { ...previous };
                delete updated[wardrobeId];
                return updated;
            });
        } catch (err) {
            console.error("Delete error:", err);

            alert(
                err.response?.data?.detail ||
                    "Unable to delete wardrobe item."
            );
        }
    };

    if (loading) {
        return (
            <div className="wardrobe-page wardrobe-state">
                <div className="wardrobe-loader">
                    <div className="loader-icon">✦</div>
                    <h2>Curating Your Wardrobe</h2>
                    <p>AI is loading your personal collection...</p>
                </div>
            </div>
        );
    }

    if (error && clothes.length === 0) {
        return (
            <div className="wardrobe-page wardrobe-state">
                <div className="wardrobe-error">
                    <div className="state-icon">👗</div>
                    <h2>My Digital Wardrobe</h2>
                    <p>{error}</p>

                    <button
                        onClick={() => navigate("/login")}
                        className="gradient-button"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wardrobe-page">

            {/* HERO */}
            <section className="wardrobe-hero">

                <div>
                    <p className="wardrobe-eyebrow">
                        AI SMART FASHION
                    </p>

                    <h1>
                        Your Style.
                        <br />
                        <span>Your Wardrobe.</span>
                    </h1>

                    <p className="wardrobe-intro">
                        Every piece in your closet, organized
                        and understood by AI.
                    </p>
                </div>

                <button
                    className="add-clothes-button"
                    onClick={() =>
                        navigate("/wardrobe-upload")
                    }
                >
                    + Add Clothes
                </button>

            </section>

            {/* SEARCH */}
            <section className="wardrobe-toolbar">

                <div className="wardrobe-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search category, color, season..."
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(e.target.value)
                        }
                        onKeyDown={handleSearchKeyDown}
                    />

                    {searchQuery && (
                        <button onClick={clearSearch}>
                            ×
                        </button>
                    )}

                </div>

                <button
                    className="search-button"
                    onClick={handleSearch}
                    disabled={searching}
                >
                    {searching ? "Searching..." : "Search"}
                </button>

            </section>

            {/* STATS */}
            <section className="wardrobe-stats">

                <div className="wardrobe-stat">
                    <span className="stat-number">
                        {clothes.length}
                    </span>

                    <span className="stat-label">
                        TOTAL ITEMS
                    </span>
                </div>

                <div className="wardrobe-stat">
                    <span className="stat-number">
                        {
                            clothes.filter(
                                (item) =>
                                    likedItems[item.id]
                            ).length
                        }
                    </span>

                    <span className="stat-label">
                        FAVORITES
                    </span>
                </div>

                <div className="wardrobe-stat">
                    <span className="stat-number">
                        AI
                    </span>

                    <span className="stat-label">
                        STYLE POWERED
                    </span>
                </div>

            </section>

            {/* HEADER */}
            <section className="collection-heading">

                <div>
                    <p className="section-eyebrow">
                        YOUR COLLECTION
                    </p>

                    <h2>
                        My Digital Wardrobe
                    </h2>
                </div>

                <button
                    className="ai-style-button"
                    onClick={() => navigate("/analysis")}
                >
                    ✨ Style Me With AI
                </button>

            </section>

            {/* EMPTY */}
            {clothes.length === 0 ? (
                <div className="empty-wardrobe">

                    <div className="empty-icon">
                        👗
                    </div>

                    <h2>
                        Your wardrobe is waiting
                    </h2>

                    <p>
                        Add your clothes and let AI understand
                        your personal style.
                    </p>

                    <button
                        className="gradient-button"
                        onClick={() =>
                            navigate("/wardrobe-upload")
                        }
                    >
                        + Add Your First Item
                    </button>

                </div>
            ) : (

                <div className="wardrobe-grid">

                    {clothes.map((item) => (

                        <article
                            className="wardrobe-card"
                            key={item.id}
                        >

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
                                    className={`heart-button ${
                                        likedItems[item.id]
                                            ? "liked"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleLike(item.id)
                                    }
                                >
                                    {likedItems[item.id]
                                        ? "♥"
                                        : "♡"}
                                </button>

                            </div>

                            <div className="wardrobe-card-content">

                                <p className="item-category">
                                    {item.category ||
                                        "CLOTHING"}
                                </p>

                                <h3>
                                    {item.color ||
                                        "Unknown"}{" "}
                                    {item.category ||
                                        "Item"}
                                </h3>

                                <div className="item-details">

                                    <div>
                                        <span>COLOR</span>
                                        <strong>
                                            {item.color ||
                                                "Unknown"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>SEASON</span>
                                        <strong>
                                            {item.season ||
                                                "All"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>OCCASION</span>
                                        <strong>
                                            {item.occasion ||
                                                "Any"}
                                        </strong>
                                    </div>

                                </div>

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteItem(item.id)
                                    }
                                >
                                    🗑 Remove Item
                                </button>

                            </div>

                        </article>

                    ))}

                </div>
            )}

            {/* BOTTOM AI CTA */}
            <section className="wardrobe-ai-cta">

                <div>
                    <p>AI STYLE ASSISTANT</p>

                    <h2>
                        Don't know what to wear?
                    </h2>

                    <span>
                        Let AI create an outfit using
                        the clothes you already own.
                    </span>
                </div>

                <button
                    onClick={() => navigate("/analysis")}
                >
                    ✨ Create My Outfit
                </button>

            </section>

        </div>
    );
}

export default WardrobeAI;