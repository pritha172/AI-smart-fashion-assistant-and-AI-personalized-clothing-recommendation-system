import { useState } from "react";
import API from "../api";
import "./AIAnalysis.css";

const BACKEND_URL = "http://127.0.0.1:8000";

function AIAnalysis() {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (imageUrl) => {

        if (!imageUrl) {
            return "";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${BACKEND_URL}/${imageUrl.replaceAll("\\", "/")}`;
    };


    // =====================================================
    // OPEN REAL PRODUCT
    // =====================================================

    const openProduct = (productUrl) => {

        if (!productUrl) {
            alert("Product website link is not available.");
            return;
        }

        window.open(
            productUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // =====================================================
    // GET USER LOCATION
    // =====================================================

    const getUserLocation = () => {

        return new Promise((resolve) => {

            if (!navigator.geolocation) {

                resolve({
                    latitude: null,
                    longitude: null
                });

                return;
            }

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                },

                () => {

                    resolve({
                        latitude: null,
                        longitude: null
                    });

                },

                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 300000
                }

            );

        });

    };


    // =====================================================
    // ANALYZE IMAGE
    // =====================================================

    const analyze = async () => {

        if (!image) {
            alert("Please select an image first.");
            return;
        }


        // -------------------------------------------------
        // GET LOGGED-IN USER
        // -------------------------------------------------

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            alert("Please login first.");
            return;
        }


        let user;

        try {

            user = JSON.parse(savedUser);

        } catch (error) {

            alert(
                "Invalid login information. Please login again."
            );

            return;
        }


        if (!user.id) {

            alert(
                "User ID not found. Please login again."
            );

            return;
        }


        setLoading(true);
        setResult(null);


        try {

            // -------------------------------------------------
            // GET LOCATION
            // -------------------------------------------------

            const location = await getUserLocation();


            // -------------------------------------------------
            // CREATE FORM DATA
            // -------------------------------------------------

            const formData = new FormData();

            formData.append(
                "file",
                image
            );

            formData.append(
                "user_id",
                String(user.id)
            );


            if (
                location.latitude !== null &&
                location.longitude !== null
            ) {

                formData.append(
                    "latitude",
                    String(location.latitude)
                );

                formData.append(
                    "longitude",
                    String(location.longitude)
                );

            }


            // -------------------------------------------------
            // CALL BACKEND
            // -------------------------------------------------

            const response = await API.post(
                "/ai/analyze",
                formData
            );


            console.log(
                "AI RESPONSE:",
                response.data
            );


            setResult(
                response.data
            );


        } catch (error) {

            console.error(
                "AI ANALYSIS ERROR:",
                error
            );


            if (error.response) {

                alert(
                    "Analysis Failed:\n\n" +
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                alert(
                    "Analysis failed. Please check the backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (event) => {

        const selectedFile =
            event.target.files[0];


        if (!selectedFile) {
            return;
        }


        setImage(
            selectedFile
        );


        setPreview(
            URL.createObjectURL(
                selectedFile
            )
        );


        setResult(null);

    };


    // =====================================================
    // TAG COMPONENT
    // =====================================================

    const Tags = ({
        items,
        className = ""
    }) => {

        if (
            !items ||
            items.length === 0
        ) {

            return (
                <span className="no-data">
                    Not available
                </span>
            );

        }


        return (

            <div
                className={`style-tags ${className}`}
            >

                {items.map(
                    (item, index) => (

                        <span
                            className="style-tag"
                            key={`${item}-${index}`}
                        >
                            {item}
                        </span>

                    )
                )}

            </div>

        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="ai-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="ai-header">

                <p className="ai-label">
                    AI SMART FASHION
                </p>


                <h1>
                    Discover Your Personal Style
                </h1>


                <p>
                    Upload your photo and let our AI analyze
                    your body shape, face shape and skin tone
                    to create personalized fashion recommendations.
                </p>

            </section>



            {/* =================================================
                UPLOAD
            ================================================= */}

            <section className="ai-upload-card">

                <div className="upload-content">

                    <div className="upload-icon">
                        ✨
                    </div>


                    <h2>
                        Analyze My Style
                    </h2>


                    <p>
                        Upload a clear photo to get your
                        personalized fashion recommendations.
                    </p>


                    <label className="upload-button">

                        📷 Choose Photo


                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />

                    </label>



                    {preview && (

                        <div className="image-preview">

                            <div className="preview-frame">

                                <img
                                    src={preview}
                                    alt="Selected"
                                />

                            </div>


                            <p className="image-name">
                                {image?.name}
                            </p>

                        </div>

                    )}



                    <button
                        className="analyze-button"
                        onClick={analyze}
                        disabled={
                            loading ||
                            !image
                        }
                    >

                        {loading ? (

                            <>
                                <span className="loading-spinner"></span>
                                Analyzing Your Style...
                            </>

                        ) : (

                            <>
                                ✨ Analyze My Style
                            </>

                        )}

                    </button>

                </div>

            </section>



            {/* =================================================
                RESULTS
            ================================================= */}

            {result && (

                <section className="ai-results">


                    {/* =================================================
                        RESULT HEADER
                    ================================================= */}

                    <div className="result-heading">

                        <p className="ai-label">
                            YOUR AI ANALYSIS
                        </p>


                        <h2>
                            Your Style Result ✨
                        </h2>


                        <p>
                            Your personalized fashion recommendations
                            based on your unique features.
                        </p>

                    </div>



                    {/* =================================================
                        PERSONALIZED AI HERO
                    ================================================= */}

                    <div className="ai-personalized-hero">

                        <div className="hero-sparkle sparkle-one">
                            ✦
                        </div>

                        <div className="hero-sparkle sparkle-two">
                            ✦
                        </div>

                        <div className="hero-sparkle sparkle-three">
                            ✦
                        </div>



                        {/* USER PHOTO */}

                        <div className="hero-photo-wrapper">

                            <div className="hero-photo-ring">

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Your style"
                                        className="hero-photo"
                                    />

                                ) : (

                                    <div className="hero-photo-placeholder">
                                        👗
                                    </div>

                                )}

                            </div>


                            <div className="hero-arrow">
                                ↗
                            </div>

                        </div>



                        {/* HERO CONTENT */}

                        <div className="hero-content">

                            <p className="hero-greeting">
                                Hey there, fashionista! 👋
                            </p>


                            <h2>
                                Your personal style profile is ready ✨
                            </h2>


                            <p className="hero-description">
                                Our AI has analyzed your unique features
                                and created personalized fashion recommendations
                                just for you.
                            </p>



                            {/* BADGES */}

                            <div className="hero-badges">

                                <span className="hero-badge">
                                    ✨ Personalized
                                </span>

                                <span className="hero-badge">
                                    💗 AI-Powered
                                </span>

                                <span className="hero-badge">
                                    🛡️ Private
                                </span>

                            </div>

                        </div>



                        {/* FASHION DECORATION */}

                        <div className="fashion-decoration">

                            <div className="clothing-rack">

                                <div className="rack-top"></div>

                                <div className="hanger hanger-one">
                                    👚
                                </div>

                                <div className="hanger hanger-two">
                                    👗
                                </div>

                                <div className="hanger hanger-three">
                                    🧥
                                </div>

                            </div>


                            <div className="fashion-plant">
                                🌿
                            </div>


                            <div className="fashion-platform"></div>

                        </div>

                    </div>



                    {/* =================================================
                        QUICK ANALYSIS CARDS
                    ================================================= */}

                    <div className="analysis-cards">


                        <div className="analysis-card">

                            <div className="analysis-icon">
                                🧍
                            </div>

                            <p>
                                Body Shape
                            </p>

                            <h3>
                                {result.body_shape || "—"}
                            </h3>

                        </div>



                        <div className="analysis-card">

                            <div className="analysis-icon">
                                🙂
                            </div>

                            <p>
                                Face Shape
                            </p>

                            <h3>
                                {result.face_shape || "—"}
                            </h3>

                        </div>



                        <div className="analysis-card">

                            <div className="analysis-icon">
                                🎨
                            </div>

                            <p>
                                Skin Tone
                            </p>

                            <h3>
                                {result.skin_tone || "—"}
                            </h3>

                        </div>



                        <div className="analysis-card highlight-card">

                            <div className="analysis-icon">
                                👗
                            </div>

                            <p>
                                Recommended Category
                            </p>

                            <h3>
                                {result.recommended_category || "—"}
                            </h3>

                        </div>

                    </div>



                    {/* =================================================
                        TODAY'S LOOK
                    ================================================= */}

                    {result.todays_look && (

                        <section className="todays-look-section">


                            {/* SECTION HEADER */}

                            <div className="section-top">

                                <div>

                                    <p className="ai-label">
                                        PERSONALIZED FOR YOU
                                    </p>

                                    <h2>
                                        👗 Today's Look
                                    </h2>

                                </div>


                                <div className="look-badge">
                                    ✨ AI Styled
                                </div>

                            </div>



                            {/* WEATHER */}

                            {result.weather && (

                                <div className="weather-card">

                                    <div className="weather-icon">
                                        🌤️
                                    </div>


                                    <div className="weather-info">

                                        <span>
                                            TODAY'S WEATHER
                                        </span>

                                        <strong>
                                            {result.weather.condition ||
                                                "Current Weather"}
                                        </strong>


                                        {result.weather.temperature !== null &&
                                            result.weather.temperature !== undefined && (

                                                <p>
                                                    {result.weather.temperature}°C
                                                </p>

                                            )}

                                    </div>


                                    {result.weather_advice && (

                                        <div className="weather-advice">

                                            {typeof result.weather_advice === "string"
                                                ? result.weather_advice
                                                : result.weather_advice.advice ||
                                                  result.weather_advice.message ||
                                                  ""}

                                        </div>

                                    )}

                                </div>

                            )}



                            {/* =================================================
                                RECOMMENDED FOR YOU
                            ================================================= */}

                            <div className="personal-style">

                                <div className="subsection-title">
                                    ✨ Recommended For You
                                </div>



                                <div className="feature-row">


                                    <div className="feature-box">

                                        <span>
                                            🧍
                                        </span>

                                        <small>
                                            Body Shape
                                        </small>

                                        <strong>
                                            {result.body_shape || "—"}
                                        </strong>

                                    </div>



                                    <div className="feature-box">

                                        <span>
                                            🙂
                                        </span>

                                        <small>
                                            Face Shape
                                        </small>

                                        <strong>
                                            {result.face_shape || "—"}
                                        </strong>

                                    </div>



                                    <div className="feature-box">

                                        <span>
                                            🎨
                                        </span>

                                        <small>
                                            Skin Tone
                                        </small>

                                        <strong>
                                            {result.skin_tone || "—"}
                                        </strong>

                                    </div>

                                </div>



                                {/* COLORS */}

                                <div className="recommendation-row">

                                    <div className="recommendation-label">
                                        🎨 Colors that suit you
                                    </div>

                                    <Tags
                                        items={
                                            result.preferred_colors
                                        }
                                    />

                                </div>



                                {/* TOP STYLES */}

                                <div className="recommendation-row">

                                    <div className="recommendation-label">
                                        👚 Suitable Top Styles
                                    </div>

                                    <Tags
                                        items={
                                            result.recommended_top_styles
                                        }
                                    />

                                </div>



                                {/* BOTTOM STYLES */}

                                {result.recommended_bottom_styles &&
                                    result.recommended_bottom_styles.length > 0 && (

                                        <div className="recommendation-row">

                                            <div className="recommendation-label">
                                                👖 Suitable Bottom Styles
                                            </div>

                                            <Tags
                                                items={
                                                    result.recommended_bottom_styles
                                                }
                                            />

                                        </div>

                                    )}



                                {/* NECKLINES */}

                                <div className="recommendation-row">

                                    <div className="recommendation-label">
                                        ✨ Suitable Necklines
                                    </div>

                                    <Tags
                                        items={
                                            result.recommended_necklines
                                        }
                                    />

                                </div>

                            </div>



                            {/* =================================================
                                WARDROBE OUTFIT
                            ================================================= */}

                            {result.todays_look && (

                                <div className="today-outfit">

                                    <div className="subsection-title">
                                        👚 Your Wardrobe Outfit
                                    </div>


                                    <div className="today-outfit-grid">


                                        {/* TOP + BOTTOM */}

                                        {result.todays_look.type ===
                                            "top_bottom" && (

                                            <>

                                                {result.todays_look.top && (

                                                    <div className="today-item">

                                                        <div className="today-item-icon">
                                                            👚
                                                        </div>


                                                        <div>

                                                            <span>
                                                                TOP
                                                            </span>

                                                            <h3>
                                                                {
                                                                    result.todays_look.top.category
                                                                }
                                                            </h3>

                                                            <p>

                                                                <i
                                                                    className="color-dot"
                                                                    style={{
                                                                        background:
                                                                            result.todays_look.top.color?.toLowerCase()
                                                                    }}
                                                                ></i>

                                                                {
                                                                    result.todays_look.top.color
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                )}



                                                {result.todays_look.bottom && (

                                                    <div className="today-item">

                                                        <div className="today-item-icon">
                                                            👖
                                                        </div>


                                                        <div>

                                                            <span>
                                                                BOTTOM
                                                            </span>

                                                            <h3>
                                                                {
                                                                    result.todays_look.bottom.category
                                                                }
                                                            </h3>

                                                            <p>

                                                                <i
                                                                    className="color-dot"
                                                                    style={{
                                                                        background:
                                                                            result.todays_look.bottom.color?.toLowerCase()
                                                                    }}
                                                                ></i>

                                                                {
                                                                    result.todays_look.bottom.color
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                )}



                                                {result.todays_look.shoes && (

                                                    <div className="today-item">

                                                        <div className="today-item-icon">
                                                            👟
                                                        </div>


                                                        <div>

                                                            <span>
                                                                SHOES
                                                            </span>

                                                            <h3>
                                                                {
                                                                    result.todays_look.shoes.category
                                                                }
                                                            </h3>

                                                            <p>
                                                                {
                                                                    result.todays_look.shoes.color
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}

                                            </>

                                        )}



                                        {/* DRESS */}

                                        {result.todays_look.type ===
                                            "dress" && (

                                            <>

                                                {result.todays_look.dress && (

                                                    <div className="today-item">

                                                        <div className="today-item-icon">
                                                            👗
                                                        </div>


                                                        <div>

                                                            <span>
                                                                DRESS
                                                            </span>

                                                            <h3>
                                                                {
                                                                    result.todays_look.dress.category
                                                                }
                                                            </h3>

                                                            <p>
                                                                {
                                                                    result.todays_look.dress.color
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}



                                                {result.todays_look.shoes && (

                                                    <div className="today-item">

                                                        <div className="today-item-icon">
                                                            👟
                                                        </div>


                                                        <div>

                                                            <span>
                                                                SHOES
                                                            </span>

                                                            <h3>
                                                                {
                                                                    result.todays_look.shoes.category
                                                                }
                                                            </h3>

                                                            <p>
                                                                {
                                                                    result.todays_look.shoes.color
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}

                                            </>

                                        )}

                                    </div>

                                </div>

                            )}



                            {/* =================================================
                                REASONS
                            ================================================= */}

                            {result.reasons &&
                                result.reasons.length > 0 && (

                                    <div className="reasons-box">

                                        <div className="subsection-title">
                                            💡 Why this look is recommended
                                        </div>


                                        <div className="reason-list">

                                            {result.reasons.map(
                                                (reason, index) => (

                                                    <div
                                                        className="reason-item"
                                                        key={index}
                                                    >

                                                        <span>
                                                            ✓
                                                        </span>

                                                        <p>
                                                            {reason}
                                                        </p>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                        </section>

                    )}



                    {/* =================================================
                        MY DIGITAL WARDROBE
                    ================================================= */}

                    <section className="wardrobe-recommendation">


                        <div className="modern-section-header">

                            <div>

                                <p className="ai-label">
                                    FROM YOUR CLOSET
                                </p>


                                <h2>
                                    Recommended From My Wardrobe 👗
                                </h2>


                                <p className="section-subtitle">
                                    Pieces from your wardrobe selected by AI
                                    to create your perfect style.
                                </p>

                            </div>


                            <div className="wardrobe-count">
                                ✨ {result.wardrobe?.count || 0} Items
                            </div>

                        </div>



                        {/* TOPS */}

                        {result.wardrobe?.tops?.length > 0 && (

                            <div className="wardrobe-category">

                                <div className="category-title">

                                    <span className="category-icon">
                                        👕
                                    </span>

                                    <h3>
                                        Tops
                                    </h3>

                                    <span className="category-line"></span>

                                </div>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.tops.map(
                                        (item) => (

                                            <div
                                                className="modern-wardrobe-card"
                                                key={item.id}
                                            >

                                                <div className="wardrobe-image-wrapper">

                                                    <img
                                                        src={getImageUrl(
                                                            item.image_url
                                                        )}
                                                        alt={item.category}
                                                    />

                                                    <span className="ai-picked-badge">
                                                        ✨ AI Pick
                                                    </span>

                                                </div>


                                                <div className="modern-wardrobe-info">

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        <span>
                                                            Color
                                                        </span>

                                                        {item.color}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        {/* BOTTOMS */}

                        {result.wardrobe?.bottoms?.length > 0 && (

                            <div className="wardrobe-category">

                                <div className="category-title">

                                    <span className="category-icon">
                                        👖
                                    </span>

                                    <h3>
                                        Bottoms
                                    </h3>

                                    <span className="category-line"></span>

                                </div>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.bottoms.map(
                                        (item) => (

                                            <div
                                                className="modern-wardrobe-card"
                                                key={item.id}
                                            >

                                                <div className="wardrobe-image-wrapper">

                                                    <img
                                                        src={getImageUrl(
                                                            item.image_url
                                                        )}
                                                        alt={item.category}
                                                    />

                                                    <span className="ai-picked-badge">
                                                        ✨ AI Pick
                                                    </span>

                                                </div>


                                                <div className="modern-wardrobe-info">

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        <span>
                                                            Color
                                                        </span>

                                                        {item.color}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        {/* SHOES */}

                        {result.wardrobe?.shoes?.length > 0 && (

                            <div className="wardrobe-category">

                                <div className="category-title">

                                    <span className="category-icon">
                                        👟
                                    </span>

                                    <h3>
                                        Shoes
                                    </h3>

                                    <span className="category-line"></span>

                                </div>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.shoes.map(
                                        (item) => (

                                            <div
                                                className="modern-wardrobe-card"
                                                key={item.id}
                                            >

                                                <div className="wardrobe-image-wrapper">

                                                    <img
                                                        src={getImageUrl(
                                                            item.image_url
                                                        )}
                                                        alt={item.category}
                                                    />

                                                    <span className="ai-picked-badge">
                                                        ✨ AI Pick
                                                    </span>

                                                </div>


                                                <div className="modern-wardrobe-info">

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        <span>
                                                            Color
                                                        </span>

                                                        {item.color}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        {/* JACKETS */}

                        {result.wardrobe?.jackets?.length > 0 && (

                            <div className="wardrobe-category">

                                <div className="category-title">

                                    <span className="category-icon">
                                        🧥
                                    </span>

                                    <h3>
                                        Jackets
                                    </h3>

                                    <span className="category-line"></span>

                                </div>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.jackets.map(
                                        (item) => (

                                            <div
                                                className="modern-wardrobe-card"
                                                key={item.id}
                                            >

                                                <div className="wardrobe-image-wrapper">

                                                    <img
                                                        src={getImageUrl(
                                                            item.image_url
                                                        )}
                                                        alt={item.category}
                                                    />

                                                    <span className="ai-picked-badge">
                                                        ✨ AI Pick
                                                    </span>

                                                </div>


                                                <div className="modern-wardrobe-info">

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        <span>
                                                            Color
                                                        </span>

                                                        {item.color}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        {/* DRESSES */}

                        {result.wardrobe?.dresses?.length > 0 && (

                            <div className="wardrobe-category">

                                <div className="category-title">

                                    <span className="category-icon">
                                        👗
                                    </span>

                                    <h3>
                                        Dresses
                                    </h3>

                                    <span className="category-line"></span>

                                </div>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.dresses.map(
                                        (item) => (

                                            <div
                                                className="modern-wardrobe-card"
                                                key={item.id}
                                            >

                                                <div className="wardrobe-image-wrapper">

                                                    <img
                                                        src={getImageUrl(
                                                            item.image_url
                                                        )}
                                                        alt={item.category}
                                                    />

                                                    <span className="ai-picked-badge">
                                                        ✨ AI Pick
                                                    </span>

                                                </div>


                                                <div className="modern-wardrobe-info">

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        <span>
                                                            Color
                                                        </span>

                                                        {item.color}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        {/* EMPTY WARDROBE */}

                        {!result.wardrobe?.tops?.length &&
                         !result.wardrobe?.bottoms?.length &&
                         !result.wardrobe?.shoes?.length &&
                         !result.wardrobe?.jackets?.length &&
                         !result.wardrobe?.dresses?.length && (

                            <div className="empty-wardrobe">

                                <div className="empty-icon">
                                    👗
                                </div>


                                <h3>
                                    Your wardrobe is waiting ✨
                                </h3>


                                <p>
                                    Add more clothes to your digital wardrobe
                                    and our AI will use them to create
                                    personalized outfits.
                                </p>

                            </div>

                        )}

                    </section>



                    {/* =================================================
                        AI STYLED OUTFIT
                    ================================================= */}

                    {result.outfit &&
                        Object.keys(result.outfit).length > 0 && (

                            <section className="outfit-section">

                                <p className="ai-label">
                                    AI STYLED OUTFIT
                                </p>


                                <h2>
                                    Your Recommended Outfit ✨
                                </h2>


                                <p className="section-description">
                                    A complete outfit created using your
                                    wardrobe and personal style.
                                </p>


                                <div className="outfit-grid">

                                    {Object.entries(
                                        result.outfit
                                    ).map(
                                        ([type, item]) => {

                                            if (!item) {
                                                return null;
                                            }


                                            return (

                                                <div
                                                    className="outfit-card"
                                                    key={type}
                                                >

                                                    <div className="outfit-image-wrapper">

                                                        <img
                                                            src={getImageUrl(
                                                                item.image_url
                                                            )}
                                                            alt={type}
                                                        />

                                                    </div>


                                                    <div className="outfit-card-info">

                                                        <span>
                                                            {type}
                                                        </span>


                                                        <h3>
                                                            {item.category}
                                                        </h3>


                                                        <p>
                                                            {item.color}
                                                        </p>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </section>

                        )}



                    {/* =================================================
                        REAL PRODUCTS
                    ================================================= */}

                    {result.products &&
                        result.products.length > 0 && (

                            <section className="real-products">


                                <div className="modern-section-header">

                                    <div>

                                        <p className="ai-label">
                                            SHOP THE STYLE
                                        </p>


                                        <h2>
                                            Similar Real Products 🛍️
                                        </h2>


                                        <p className="section-subtitle">
                                            Complete your AI-recommended look
                                            with real products you can explore.
                                        </p>

                                    </div>


                                    <div className="shop-ai-badge">
                                        ✨ AI Matched
                                    </div>

                                </div>



                                <div className="real-products-grid">

                                    {result.products.map(
                                        (product) => (

                                            <div
                                                className="modern-product-card"
                                                key={product.id}
                                            >


                                                <div className="product-image-wrapper">

                                                    <img
                                                        src={
                                                            product.image_url ||
                                                            "https://via.placeholder.com/400x400?text=Fashion"
                                                        }
                                                        alt={product.name}
                                                    />


                                                    <span className="product-ai-badge">
                                                        ✨ AI Match
                                                    </span>

                                                </div>



                                                <div className="modern-product-info">

                                                    <p className="product-category">
                                                        {product.category}
                                                    </p>


                                                    <h3>
                                                        {product.name}
                                                    </h3>



                                                    {product.color && (

                                                        <p className="product-color">
                                                            Color: {product.color}
                                                        </p>

                                                    )}



                                                    {product.product_url && (

                                                        <button
                                                            type="button"
                                                            className="modern-shop-button"
                                                            onClick={() =>
                                                                openProduct(
                                                                    product.product_url
                                                                )
                                                            }
                                                        >

                                                            View Real Product

                                                            <span>
                                                                →
                                                            </span>

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}

                </section>

            )}

        </div>

    );

}


export default AIAnalysis;