
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
    // GET IMAGE URL
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
    // OPEN REAL PRODUCT WEBSITE
    // =====================================================

    const openProduct = (productUrl) => {

        if (!productUrl) {

            alert(
                "Product website link is not available."
            );

            return;
        }

        window.open(
            productUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // =====================================================
    // ANALYZE IMAGE
    // =====================================================

    const analyze = async () => {

        if (!image) {

            alert(
                "Please select an image first."
            );

            return;
        }


        // Get logged-in user

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            alert(
                "Please login first."
            );

            return;
        }


        let user;


        try {

            user = JSON.parse(savedUser);

        }
        catch {

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

            const location = await getUserLocation();

const savedUser =
    localStorage.getItem("user");

let userId = null;

if (savedUser) {

    try {

        const user = JSON.parse(savedUser);

        userId = user.id;

    } catch (error) {

        console.log(
            "Unable to read user information"
        );

    }
}


const formData = new FormData();

formData.append(
    "file",
    file
);

if (userId) {

    formData.append(
        "user_id",
        userId
    );
}

// Get logged-in user

if (savedUser) {
    const user = JSON.parse(savedUser);

    if (user.id) {
        // your existing code
    }
}

if (location.latitude !== null) {

    formData.append(
        "latitude",
        location.latitude
    );

}

if (location.longitude !== null) {

    formData.append(
        "longitude",
        location.longitude
    );
}


const response = await API.post(
    "/ai/analyze",
    formData
);

setResult(
    response.data
);


            console.log(
                "AI Response:",
                response.data
            );


            setResult(
                response.data
            );

        }
        catch (error) {

            console.error(
                "AI Analysis Error:",
                error
            );


            if (error.response) {

                alert(
                    "Analysis Failed: " +
                    JSON.stringify(
                        error.response.data
                    )
                );

            }
            else {

                alert(
                    "Analysis failed. Please check the backend."
                );

            }

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // IMAGE SELECTION
    // =====================================================

    const handleImageChange = (event) => {

        const selectedFile =
            event.target.files[0];


        if (!selectedFile) {
            return;
        }


        setImage(selectedFile);


        setPreview(
            URL.createObjectURL(
                selectedFile
            )
        );


        setResult(null);
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="ai-page">

            {/* =========================================
                HEADER
            ========================================= */}

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


            {/* =========================================
                UPLOAD SECTION
            ========================================= */}

            <section className="ai-upload-card">

                <div className="upload-content">

                    <h2>
                        ✨ Analyze My Style
                    </h2>


                    <p>
                        Upload a clear photo to get your
                        personalized fashion recommendations.
                    </p>


                    <label className="upload-button">

                        Choose Photo


                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />

                    </label>


                    {preview && (

                        <div className="image-preview">

                            <img
                                src={preview}
                                alt="Selected"
                            />


                            <p>
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

                        {loading
                            ? "Analyzing Your Style..."
                            : "Analyze My Style"
                        }

                    </button>

                </div>

            </section>


            {/* =========================================
                AI RESULT
            ========================================= */}

            {result && (

                <section className="ai-results">

                    <div className="result-heading">

                        <p className="ai-label">
                            YOUR AI ANALYSIS
                        </p>


                        <h2>
                            Your Style Result ✨
                        </h2>

                    </div>

                    {result && result.todays_look && (

    <div
        style={{
            marginTop: "30px",
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "15px",
            background: "#fff"
        }}
    >

        <h2>
            👗 Today's Look
        </h2>


        {/* WEATHER */}

        {result.weather && (

            <div
                style={{
                    marginBottom: "20px"
                }}
            >

                <h3>
                    🌤️ Today's Weather
                </h3>

                <p>
                    <strong>
                        Condition:
                    </strong>{" "}

                    {result.weather.condition}
                </p>

                {result.weather.temperature !== null && (

                    <p>

                        <strong>
                            Temperature:
                        </strong>{" "}

                        {result.weather.temperature}
                        °C

                    </p>

                )}

            </div>

        )}


        {/* PERSONALIZED STYLE */}

        <h3>
            ✨ Recommended For You
        </h3>

        <p>

            <strong>
                Body Shape:
            </strong>{" "}

            {result.body_shape}

        </p>

        <p>

            <strong>
                Face Shape:
            </strong>{" "}

            {result.face_shape}

        </p>

        <p>

            <strong>
                Skin Tone:
            </strong>{" "}

            {result.skin_tone}

        </p>


        {/* COLORS */}

        <p>

            <strong>
                Colors that suit you:
            </strong>{" "}

            {result.preferred_colors?.join(", ")}

        </p>


        {/* TOP STYLES */}

        <p>

            <strong>
                Suitable Top Styles:
            </strong>{" "}

            {result.recommended_top_styles?.join(", ")}

        </p>


        {/* NECKLINES */}

        <p>

            <strong>
                Suitable Necklines:
            </strong>{" "}

            {result.recommended_necklines?.join(", ")}

        </p>


        {/* OUTFIT */}

        <h3>
            👕 Your Wardrobe Outfit
        </h3>


        {result.todays_look.type === "top_bottom" && (

            <div>

                <p>
                    <strong>
                        Top:
                    </strong>{" "}

                    {result.todays_look.top?.category}

                    {" - "}

                    {result.todays_look.top?.color}

                </p>


                <p>
                    <strong>
                        Bottom:
                    </strong>{" "}

                    {result.todays_look.bottom?.category}

                    {" - "}

                    {result.todays_look.bottom?.color}

                </p>


                {result.todays_look.shoes && (

                    <p>

                        <strong>
                            Shoes:
                        </strong>{" "}

                        {result.todays_look.shoes.category}

                        {" - "}

                        {result.todays_look.shoes.color}

                    </p>

                )}

            </div>

        )}


        {result.todays_look.type === "dress" && (

            <div>

                <p>

                    <strong>
                        Dress:
                    </strong>{" "}

                    {result.todays_look.dress.category}

                    {" - "}

                    {result.todays_look.dress.color}

                </p>


                {result.todays_look.shoes && (

                    <p>

                        <strong>
                            Shoes:
                        </strong>{" "}

                        {result.todays_look.shoes.category}

                        {" - "}

                        {result.todays_look.shoes.color}

                    </p>

                )}

            </div>

        )}


        {/* REASONS */}

        <h3>
            💡 Why this look is recommended
        </h3>

        <ul>

            {result.reasons?.map(
                (reason, index) => (

                    <li key={index}>
                        {reason}
                    </li>

                )
            )}

        </ul>

    </div>

)}

                    {/* =================================
                        ANALYSIS CARDS
                    ================================= */}

                    <div className="analysis-cards">

                        <div className="analysis-card">

                            <span>
                                🧍
                            </span>


                            <p>
                                Body Shape
                            </p>


                            <h3>
                                {result.body_shape}
                            </h3>

                        </div>


                        <div className="analysis-card">

                            <span>
                                🙂
                            </span>


                            <p>
                                Face Shape
                            </p>


                            <h3>
                                {result.face_shape}
                            </h3>

                        </div>


                        <div className="analysis-card">

                            <span>
                                🎨
                            </span>


                            <p>
                                Skin Tone
                            </p>


                            <h3>
                                {result.skin_tone}
                            </h3>

                        </div>


                        <div className="analysis-card">

                            <span>
                                👗
                            </span>


                            <p>
                                Recommended Category
                            </p>


                            <h3>
                                {result.recommended_category}
                            </h3>

                        </div>

                    </div>


                    {/* =================================
                        WARDROBE RECOMMENDATIONS
                    ================================= */}

                    <section className="wardrobe-recommendation">

                        <div className="section-heading">

                            <div>

                                <p className="ai-label">
                                    FROM YOUR CLOSET
                                </p>


                                <h2>
                                    Recommended From My Wardrobe 👗
                                </h2>

                            </div>


                            <span className="wardrobe-count">

                                {result.wardrobe?.count || 0}
                                {" "}
                                Items

                            </span>

                        </div>


                        {/* TOPS */}

                        {result.wardrobe?.tops?.length > 0 && (

                            <div className="wardrobe-group">

                                <h3>
                                    👕 Tops
                                </h3>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.tops.map(
                                        (item) => (

                                            <div
                                                className="wardrobe-card"
                                                key={item.id}
                                            >

                                                <img
                                                    src={getImageUrl(
                                                        item.image_url
                                                    )}
                                                    alt={item.category}
                                                />


                                                <div>

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        Color: {item.color}
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

                            <div className="wardrobe-group">

                                <h3>
                                    👖 Bottoms
                                </h3>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.bottoms.map(
                                        (item) => (

                                            <div
                                                className="wardrobe-card"
                                                key={item.id}
                                            >

                                                <img
                                                    src={getImageUrl(
                                                        item.image_url
                                                    )}
                                                    alt={item.category}
                                                />


                                                <div>

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        Color: {item.color}
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

                            <div className="wardrobe-group">

                                <h3>
                                    👟 Shoes
                                </h3>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.shoes.map(
                                        (item) => (

                                            <div
                                                className="wardrobe-card"
                                                key={item.id}
                                            >

                                                <img
                                                    src={getImageUrl(
                                                        item.image_url
                                                    )}
                                                    alt={item.category}
                                                />


                                                <div>

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        Color: {item.color}
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

                            <div className="wardrobe-group">

                                <h3>
                                    🧥 Jackets
                                </h3>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.jackets.map(
                                        (item) => (

                                            <div
                                                className="wardrobe-card"
                                                key={item.id}
                                            >

                                                <img
                                                    src={getImageUrl(
                                                        item.image_url
                                                    )}
                                                    alt={item.category}
                                                />


                                                <div>

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        Color: {item.color}
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

                            <div className="wardrobe-group">

                                <h3>
                                    👗 Dresses
                                </h3>


                                <div className="wardrobe-grid">

                                    {result.wardrobe.dresses.map(
                                        (item) => (

                                            <div
                                                className="wardrobe-card"
                                                key={item.id}
                                            >

                                                <img
                                                    src={getImageUrl(
                                                        item.image_url
                                                    )}
                                                    alt={item.category}
                                                />


                                                <div>

                                                    <h4>
                                                        {item.category}
                                                    </h4>


                                                    <p>
                                                        Color: {item.color}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* NO MATCHING WARDROBE */}

                        {!result.wardrobe?.tops?.length &&
                         !result.wardrobe?.bottoms?.length &&
                         !result.wardrobe?.shoes?.length &&
                         !result.wardrobe?.jackets?.length &&
                         !result.wardrobe?.dresses?.length && (

                            <div className="empty-wardrobe">

                                <h3>
                                    No matching clothing found
                                </h3>


                                <p>
                                    Add more clothes to your digital
                                    wardrobe and our AI will use them
                                    in your outfit recommendations.
                                </p>

                            </div>

                        )}

                    </section>


                    {/* =================================
                        AI GENERATED OUTFIT
                    ================================= */}

                    {result.outfit &&
                     Object.keys(result.outfit).length > 0 && (

                        <section className="outfit-section">

                            <p className="ai-label">
                                AI STYLED OUTFIT
                            </p>


                            <h2>
                                Your Recommended Outfit ✨
                            </h2>


                            <div className="outfit-grid">

                                {Object.entries(
                                    result.outfit
                                ).map(
                                    ([type, item]) => (

                                        <div
                                            className="outfit-card"
                                            key={type}
                                        >

                                            <img
                                                src={getImageUrl(
                                                    item.image_url
                                                )}
                                                alt={type}
                                            />


                                            <h3>
                                                {type}
                                            </h3>


                                            <p>
                                                {item.category}
                                            </p>


                                            <p>
                                                Color: {item.color}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    
                    {/* =================================
                        REAL PRODUCTS
                    ================================= */}
                    {result.products && result.products.length > 0 && (
                        <section className="real-products">
                            <p className="ai-label">SHOP THE STYLE</p>
                            <h2>Similar Real Products 🛍️</h2>

                            <div className="real-products-grid">
                                {result.products.map((product) => (
                                    <div className="real-product-card" key={product.id}>
                                        <div className="real-product-image">
                                            <img
                                                src={
                                                    product.image_url ||
                                                    "https://via.placeholder.com/400x400?text=Fashion"
                                                }
                                                alt={product.name}
                                            />
                                        </div>

                                        <div className="real-product-info">
                                            <h3>{product.name}</h3>

                                            {product.product_url && (
                                                <button
                                                    type="button"
                                                    className="shop-button"
                                                    onClick={() => openProduct(product.product_url)}
                                                >
                                                    View Real Product →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                     

                </section>
            )}
        </div>
    );

    
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
                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude
                });

            },

            (error) => {

                console.log(
                    "Location permission denied:",
                    error
                );

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


};
    

export default AIAnalysis;