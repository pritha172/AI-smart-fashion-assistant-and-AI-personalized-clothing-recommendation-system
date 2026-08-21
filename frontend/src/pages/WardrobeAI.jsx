import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function WardrobeAI() {

    const navigate = useNavigate();

    const [clothes, setClothes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [searching, setSearching] = useState(false);

    const [likedItems, setLikedItems] = useState({});


    // =====================================================
    // GET USER
    // =====================================================

    const getUser = () => {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {

            const user =
                JSON.parse(savedUser);

            return user;

        } catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            return null;
        }
    };


    // =====================================================
    // LOAD MY WARDROBE
    // =====================================================

    useEffect(() => {

        fetchWardrobe();

    }, []);


    const fetchWardrobe = async () => {

        try {

            setLoading(true);

            setError("");

            const user = getUser();

            if (!user) {

                setError(
                    "Please login first."
                );

                return;
            }


            if (!user.id) {

                setError(
                    "User ID not found. Please login again."
                );

                return;
            }


            console.log(
                "Loading wardrobe for user:",
                user.id
            );


            const response =
                await API.get(
                    `/wardrobe/my-wardrobe?user_id=${user.id}`
                );


            console.log(
                "Wardrobe response:",
                response.data
            );


            const wardrobe =
                response.data.wardrobe || [];


            setClothes(
                wardrobe
            );


            // Load existing like status
            const likeState = {};

            wardrobe.forEach((item) => {

                likeState[item.id] =
                    item.liked === true;

            });

            setLikedItems(
                likeState
            );

        }

        catch (error) {

            console.error(
                "Wardrobe error:",
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
    // SEARCH WARDROBE
    // =====================================================

    const handleSearch = async () => {

        const user = getUser();

        if (!user || !user.id) {

            setError(
                "Please login again."
            );

            return;
        }


        try {

            setSearching(true);

            setError("");


            const response =
                await API.get(
                    `/wardrobe/search?user_id=${user.id}&query=${encodeURIComponent(
                        searchQuery
                    )}`
                );


            console.log(
                "Search response:",
                response.data
            );


            setClothes(
                response.data.wardrobe || []
            );

        }

        catch (error) {

            console.error(
                "Search error:",
                error
            );

            setError(
                "Unable to search wardrobe."
            );

        }

        finally {

            setSearching(false);

        }

    };


    // =====================================================
    // SEARCH ON ENTER
    // =====================================================

    const handleSearchKeyDown = (event) => {

        if (event.key === "Enter") {

            handleSearch();

        }

    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = () => {

        setSearchQuery("");

        fetchWardrobe();

    };


    // =====================================================
    // LIKE / UNLIKE
    // =====================================================

    const toggleLike = async (wardrobeId) => {

    try {

        const user = getUser();

        if (!user || !user.id) {

            alert("Please login first.");

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

        console.log(
            "Like response:",
            response.data
        );

        const newLiked =
            response.data.liked;

        setLikedItems(
            (previous) => ({
                ...previous,
                [wardrobeId]: newLiked
            })
        );

        setClothes(
            (previous) =>
                previous.map(
                    (item) =>
                        item.id === wardrobeId
                            ? {
                                ...item,
                                liked: newLiked
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

            alert(
                error.response.data.detail ||
                "Unable to update like status."
            );

        }
        else {

            alert(
                "Unable to update like status."
            );

        }

    }

};


    // =====================================================
    // DELETE WARDROBE ITEM
    // =====================================================

    const deleteItem = async (wardrobeId) => {

    const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this clothing item?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const user = getUser();

        if (!user || !user.id) {

            alert("Please login first.");

            return;
        }

        console.log(
            "Deleting wardrobe item:",
            wardrobeId,
            "for user:",
            user.id
        );

        await API.delete(
            `/wardrobe/${wardrobeId}`,
            {
                params: {
                    user_id: user.id
                }
            }
        );

        // Remove item immediately from screen
        setClothes(
            (previous) =>
                previous.filter(
                    (item) =>
                        item.id !== wardrobeId
                )
        );

        // Remove like state
        setLikedItems(
            (previous) => {

                const updated = {
                    ...previous
                };

                delete updated[wardrobeId];

                return updated;

            }
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
    // IMAGE URL
    // =====================================================

    const getImageUrl = (imageUrl) => {

        if (!imageUrl) {

            return "";

        }


        const cleanPath =
            imageUrl
                .replaceAll("\\", "/")
                .replace(/^\/+/, "");


        return `http://127.0.0.1:8000/${cleanPath}`;

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                style={{
                    padding: "60px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Loading Your Wardrobe...
                </h2>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && clothes.length === 0) {

        return (

            <div
                style={{
                    padding: "60px",
                    textAlign: "center"
                }}
            >

                <h2>
                    My Digital Wardrobe
                </h2>

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
                minHeight: "100vh",
                padding: "65px 36px",
                background: "#faf8f6"
            }}
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    position: "relative",
                    marginBottom: "35px"
                }}
            >

                <p
                    style={{
                        color: "#b56b59",
                        letterSpacing: "3px",
                        fontSize: "15px",
                        fontWeight: "600",
                        marginBottom: "20px"
                    }}
                >
                    AI SMART FASHION
                </p>


                <h1
                    style={{
                        fontSize: "44px",
                        margin: "0 0 18px",
                        color: "#151515"
                    }}
                >
                    My Digital Wardrobe
                </h1>


                <p
                    style={{
                        fontSize: "18px",
                        color: "#777",
                        margin: 0
                    }}
                >
                    Your personal collection of clothes,
                    powered by AI.
                </p>


                {/* =================================================
                    ADD CLOTHES BUTTON
                ================================================= */}

                <button
                    onClick={() =>
                        navigate("/wardrobe-upload")
                    }
                    style={{
                        position: "absolute",
                        right: "0",
                        top: "25px",
                        padding: "15px 28px",
                        border: "none",
                        borderRadius: "30px",
                        background:
                            "linear-gradient(90deg, #f34b9b, #9b42b8)",
                        color: "white",
                        fontSize: "17px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow:
                            "0 8px 20px rgba(170,70,160,0.25)"
                    }}
                >

                    + &nbsp; Add Clothes

                </button>

            </div>


            {/* =================================================
                SEARCH BAR
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px",
                    maxWidth: "700px"
                }}
            >

                <input
                    type="text"
                    placeholder="Search clothes by category, color, season..."
                    value={searchQuery}
                    onChange={(event) =>
                        setSearchQuery(
                            event.target.value
                        )
                    }
                    onKeyDown={
                        handleSearchKeyDown
                    }
                    style={{
                        flex: 1,
                        padding: "14px 18px",
                        border:
                            "1px solid #ddd",
                        borderRadius: "12px",
                        fontSize: "15px",
                        outline: "none",
                        background: "white"
                    }}
                />


                <button
                    onClick={handleSearch}
                    disabled={searching}
                    style={{
                        padding: "14px 22px",
                        border: "none",
                        borderRadius: "12px",
                        background: "#222",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >

                    {searching
                        ? "Searching..."
                        : "🔍 Search"
                    }

                </button>


                {searchQuery && (

                    <button
                        onClick={clearSearch}
                        style={{
                            padding: "14px 18px",
                            border:
                                "1px solid #ddd",
                            borderRadius: "12px",
                            background: "white",
                            cursor: "pointer"
                        }}
                    >
                        Clear
                    </button>

                )}

            </div>


            {/* =================================================
                ITEM COUNT
            ================================================= */}

            <div
                style={{
                    padding: "15px 22px",
                    background: "#f0dcff",
                    color: "#7d20b5",
                    borderRadius: "18px",
                    fontWeight: "700",
                    fontSize: "17px",
                    marginBottom: "30px"
                }}
            >

                {clothes.length}{" "}

                {clothes.length === 1
                    ? "Item"
                    : "Items"
                }

            </div>


            {/* =================================================
                EMPTY WARDROBE
            ================================================= */}

            {clothes.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "80px 20px",
                        background: "white",
                        borderRadius: "20px"
                    }}
                >

                    <div
                        style={{
                            fontSize: "60px",
                            marginBottom: "20px"
                        }}
                    >
                        👗
                    </div>


                    <h2>
                        Your wardrobe is empty
                    </h2>


                    <p
                        style={{
                            color: "#777"
                        }}
                    >
                        Add your clothes and let AI
                        create personalized outfits
                        for you.
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/wardrobe-upload"
                            )
                        }
                        style={{
                            marginTop: "20px",
                            padding: "14px 28px",
                            border: "none",
                            borderRadius: "25px",
                            background:
                                "linear-gradient(90deg,#f34b9b,#9b42b8)",
                            color: "white",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >

                        + Add Your First Clothing Item

                    </button>

                </div>

            ) : (

                /* =================================================
                   WARDROBE GRID
                ================================================= */

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "30px"
                    }}
                >

                    {clothes.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "14px",
                                boxShadow:
                                    "0 8px 25px rgba(0,0,0,0.08)",
                                overflow: "hidden"
                            }}
                        >


                            {/* =================================================
                                IMAGE
                            ================================================= */}

                            <div
                                style={{
                                    width: "100%",
                                    height: "320px",
                                    overflow: "hidden",
                                    borderRadius: "15px",
                                    background: "#f3f3f3"
                                }}
                            >

                                <img
                                    src={getImageUrl(
                                        item.image_url
                                    )}
                                    alt={
                                        item.category ||
                                        "Wardrobe item"
                                    }
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            </div>


                            {/* =================================================
                                INFORMATION
                            ================================================= */}

                            <div
                                style={{
                                    padding:
                                        "18px 8px 8px"
                                }}
                            >

                                <span
                                    style={{
                                        color: "#777",
                                        fontSize: "14px"
                                    }}
                                >
                                    {item.category}
                                </span>


                                <h2
                                    style={{
                                        margin:
                                            "8px 0 15px",
                                        fontSize: "22px",
                                        color: "#151515"
                                    }}
                                >

                                    {item.color || "Unknown"}{" "}
                                    {item.category}

                                </h2>


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
                                        marginTop: "20px"
                                    }}
                                >


                                    {/* LIKE */}

                                    <button
                                        onClick={() =>
                                            toggleLike(
                                                item.id
                                            )
                                        }
                                        style={{
                                            flex: 1,
                                            padding:
                                                "11px 10px",
                                            border:
                                                "1px solid #eee",
                                            borderRadius:
                                                "10px",
                                            background:
                                                likedItems[
                                                    item.id
                                                ]
                                                    ? "#ffe5ef"
                                                    : "white",
                                            color:
                                                likedItems[
                                                    item.id
                                                ]
                                                    ? "#e91e63"
                                                    : "#555",
                                            fontWeight:
                                                "600",
                                            cursor:
                                                "pointer"
                                        }}
                                    >

                                        {likedItems[
                                            item.id
                                        ]
                                            ? "❤️ Liked"
                                            : "♡ Like"
                                        }

                                    </button>


                                    {/* DELETE */}

                                    <button
                                        onClick={() =>
                                            deleteItem(
                                                item.id
                                            )
                                        }
                                        style={{
                                            flex: 1,
                                            padding:
                                                "11px 10px",
                                            border:
                                                "1px solid #eee",
                                            borderRadius:
                                                "10px",
                                            background:
                                                "#fff5f5",
                                            color:
                                                "#d93636",
                                            fontWeight:
                                                "600",
                                            cursor:
                                                "pointer"
                                        }}
                                    >

                                        🗑️ Delete

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

export default WardrobeAI;