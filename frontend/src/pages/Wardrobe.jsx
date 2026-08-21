import { useEffect, useState } from "react";
import API from "../api";

function Wardrobe() {

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
    // LOAD MY WARDROBE
    // =====================================================

    useEffect(() => {
        loadWardrobe();
    }, []);


    const loadWardrobe = async () => {

        try {

            setLoading(true);
            setError("");

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                setError("Please login first.");
                setLoading(false);
                return;

            }

            const user =
                JSON.parse(savedUser);

            if (!user.id) {

                setError(
                    "User ID not found. Please login again."
                );

                setLoading(false);
                return;

            }

            const response =
                await API.get(
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

        try {

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                alert("Please login first.");
                return;

            }

            const user =
                JSON.parse(savedUser);

            const response =
                await API.get(
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

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                alert("Please login first.");
                return;

            }

            const user =
                JSON.parse(savedUser);

            if (!user.id) {

                alert(
                    "User ID not found. Please login again."
                );

                return;

            }

            const response =
                await API.put(
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
                (previousItems) =>
                    previousItems.map(
                        (item) =>
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

            if (error.response) {

                console.error(
                    "Backend response:",
                    error.response.data
                );

            }

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

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                alert("Please login first.");
                return;

            }

            const user =
                JSON.parse(savedUser);

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
                (previousItems) =>
                    previousItems.filter(
                        (item) =>
                            item.id !== wardrobeId
                    )
            );

            alert(
                "Wardrobe item deleted successfully."
            );

        }
        catch (error) {

            console.error(
                "Delete error:",
                error
            );

            if (error.response) {

                console.error(
                    "Backend response:",
                    error.response.data
                );

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

            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >

                <h1>
                    My Wardrobe
                </h1>

                <p>
                    Loading your wardrobe...
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >

                <h1>
                    My Wardrobe
                </h1>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "0 auto"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "30px"
                }}
            >

                <h1>
                    My Wardrobe
                </h1>

                <p>
                    Manage your personal clothing collection
                </p>

            </div>


            {/* =================================================
                SEARCH BAR
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "30px",
                    flexWrap: "wrap"
                }}
            >

                <input
                    type="text"
                    placeholder="Search by category, color, season..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            handleSearch();
                        }

                    }}
                    style={{
                        width: "350px",
                        padding: "12px 15px",
                        border: "1px solid #ccc",
                        borderRadius: "25px",
                        fontSize: "15px"
                    }}
                />


                <button
                    onClick={handleSearch}
                    style={{
                        padding: "12px 22px",
                        border: "none",
                        borderRadius: "25px",
                        background: "#222",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}
                >

                    🔍 Search

                </button>


                {search && (

                    <button
                        onClick={clearSearch}
                        style={{
                            padding: "12px 22px",
                            border: "1px solid #ccc",
                            borderRadius: "25px",
                            background: "white",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >

                        Clear

                    </button>

                )}

            </div>


            {/* =================================================
                ITEM COUNT
            ================================================= */}

            <p
                style={{
                    marginBottom: "20px",
                    fontWeight: "bold"
                }}
            >

                {items.length}{" "}
                {items.length === 1
                    ? "Item"
                    : "Items"}

            </p>


            {/* =================================================
                EMPTY WARDROBE
            ================================================= */}

            {items.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "15px"
                    }}
                >

                    <h2>
                        No clothing items found
                    </h2>

                    <p>
                        Try another search or add clothes
                        to your wardrobe.
                    </p>

                </div>

            ) : (

                /* =================================================
                   WARDROBE GRID
                ================================================= */

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "25px"
                    }}
                >

                    {items.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "15px",
                                overflow: "hidden",
                                background: "white",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.08)"
                            }}
                        >

                            {/* =================================================
                                IMAGE
                            ================================================= */}

                            <div
                                style={{
                                    width: "100%",
                                    height: "250px",
                                    background: "#f5f5f5"
                                }}
                            >

                                <img
                                    src={getImageUrl(item.image_url)}
                                    alt={
                                        item.category ||
                                        "Wardrobe item"
                                    }
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => {

                                        console.error(
                                            "Image failed:",
                                            getImageUrl(
                                                item.image_url
                                            )
                                        );

                                        e.currentTarget.style.display =
                                            "none";

                                    }}
                                />

                            </div>


                            {/* =================================================
                                INFORMATION
                            ================================================= */}

                            <div
                                style={{
                                    padding: "15px"
                                }}
                            >

                                <h3
                                    style={{
                                        marginTop: "0",
                                        marginBottom: "10px"
                                    }}
                                >

                                    {item.category ||
                                        "Clothing"}

                                </h3>


                                <p>

                                    <strong>
                                        Color:
                                    </strong>{" "}

                                    {item.color ||
                                        "Unknown"}

                                </p>


                                <p>

                                    <strong>
                                        Season:
                                    </strong>{" "}

                                    {item.season ||
                                        "All"}

                                </p>


                                <p>

                                    <strong>
                                        Occasion:
                                    </strong>{" "}

                                    {item.occasion ||
                                        "Not specified"}

                                </p>


                                {/* =================================================
                                    ACTION BUTTONS
                                ================================================= */}

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginTop: "15px"
                                    }}
                                >

                                    {/* LIKE */}

                                    <button
                                        onClick={() =>
                                            handleLike(
                                                item.id
                                            )
                                        }
                                        style={{
                                            flex: "1",
                                            padding: "10px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background:
                                                item.liked
                                                    ? "#ff4d6d"
                                                    : "#eee",
                                            color:
                                                item.liked
                                                    ? "white"
                                                    : "#333",
                                            cursor: "pointer",
                                            fontSize: "16px"
                                        }}
                                    >

                                        {item.liked
                                            ? "❤️ Liked"
                                            : "♡ Like"}

                                    </button>


                                    {/* DELETE */}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                item.id
                                            )
                                        }
                                        style={{
                                            padding: "10px 14px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#dc3545",
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "16px"
                                        }}
                                    >

                                        🗑️

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Wardrobe;