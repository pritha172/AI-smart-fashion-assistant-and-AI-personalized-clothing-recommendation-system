import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const savedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
        user = null;
    }

    const userName =
        user?.name ||
        user?.username ||
        user?.full_name ||
        "Fashion Lover";

    const goToAnalysis = () => {
        navigate("/analysis");
    };

    const goToProducts = () => {
        navigate("/products");
    };

    const goToWardrobe = () => {
        navigate("/wardrobe");
    };

    const goToCart = () => {
        navigate("/cart");
    };

    return (
        <div className="home-page">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <p className="home-ai-label">
                        ✦ AI SMART FASHION
                    </p>

                    <h1>
                        Your style.
                        <br />
                        <span>Intelligently styled.</span>
                    </h1>

                    <p className="home-hero-description">
                        Welcome back, {userName}. Discover personalized
                        outfits created around your body shape, skin tone,
                        face shape and wardrobe.
                    </p>

                    <div className="home-hero-actions">

                        <button
                            className="home-primary-button"
                            onClick={goToAnalysis}
                        >
                            ✨ Analyze My Style
                        </button>

                        <button
                            className="home-secondary-button"
                            onClick={goToWardrobe}
                        >
                            View My Wardrobe →
                        </button>

                    </div>

                    <div className="home-trust-row">

                        <span>✦ Personalized</span>
                        <span>✦ AI Powered</span>
                        <span>✦ Your Wardrobe</span>

                    </div>

                </div>


                <div className="home-hero-visual">

                    <div className="hero-image-card">

                        <img
                            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
                            alt="Fashion styling"
                        />

                        <div className="hero-floating-card">

                            <div className="floating-icon">
                                ✨
                            </div>

                            <div>
                                <strong>
                                    AI Style Match
                                </strong>

                                <p>
                                    Personalized for you
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                QUICK ACTIONS
            ===================================================== */}

            <section className="home-section">

                <div className="home-section-heading">

                    <div>
                        <p className="home-section-label">
                            YOUR FASHION SPACE
                        </p>

                        <h2>
                            Everything you need,
                            <br />
                            in one place.
                        </h2>
                    </div>

                    <p className="home-section-description">
                        Manage your wardrobe, discover products and let
                        AI create looks that fit your personal style.
                    </p>

                </div>


                <div className="home-action-grid">

                    <div
                        className="home-action-card action-ai"
                        onClick={goToAnalysis}
                    >

                        <div className="action-card-top">
                            <span className="action-icon">
                                ✨
                            </span>

                            <span className="action-arrow">
                                →
                            </span>
                        </div>

                        <p className="action-label">
                            AI ASSISTANT
                        </p>

                        <h3>
                            Discover Your Style
                        </h3>

                        <p>
                            Upload your photo and receive personalized
                            fashion analysis and outfit recommendations.
                        </p>

                    </div>


                    <div
                        className="home-action-card action-wardrobe"
                        onClick={goToWardrobe}
                    >

                        <div className="action-card-top">
                            <span className="action-icon">
                                👗
                            </span>

                            <span className="action-arrow">
                                →
                            </span>
                        </div>

                        <p className="action-label">
                            MY COLLECTION
                        </p>

                        <h3>
                            Digital Wardrobe
                        </h3>

                        <p>
                            Explore your clothing collection and manage
                            the pieces you already own.
                        </p>

                    </div>


                    <div
                        className="home-action-card action-shop"
                        onClick={goToProducts}
                    >

                        <div className="action-card-top">
                            <span className="action-icon">
                                🛍️
                            </span>

                            <span className="action-arrow">
                                →
                            </span>
                        </div>

                        <p className="action-label">
                            EXPLORE
                        </p>

                        <h3>
                            Shop Your Style
                        </h3>

                        <p>
                            Find fashion products that complement your
                            personal style and AI recommendations.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                TODAY'S LOOK
            ===================================================== */}

            <section className="home-section today-look-section">

                <div className="today-look-card">

                    <div className="today-look-content">

                        <p className="home-section-label">
                            ✦ AI STYLE INSPIRATION
                        </p>

                        <h2>
                            Your next great
                            <br />
                            <span>look starts here.</span>
                        </h2>

                        <p>
                            Let our AI analyze your personal features and
                            wardrobe to create a look designed specifically
                            for you.
                        </p>

                        <div className="today-look-points">

                            <div>
                                <span>01</span>
                                <p>
                                    Analyze your personal style
                                </p>
                            </div>

                            <div>
                                <span>02</span>
                                <p>
                                    Match with your wardrobe
                                </p>
                            </div>

                            <div>
                                <span>03</span>
                                <p>
                                    Discover your perfect outfit
                                </p>
                            </div>

                        </div>

                        <button
                            className="today-look-button"
                            onClick={goToAnalysis}
                        >
                            Create My AI Look →
                        </button>

                    </div>


                    <div className="today-look-visual">

                        <div className="style-image-main">

                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
                                alt="Fashion inspiration"
                            />

                        </div>

                        <div className="style-mini-card">

                            <span>
                                ✨
                            </span>

                            <div>
                                <strong>
                                    AI Styled
                                </strong>

                                <p>
                                    Just for you
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                WHY AI
            ===================================================== */}

            <section className="home-section">

                <div className="home-section-heading centered">

                    <div>

                        <p className="home-section-label">
                            WHY SMART FASHION?
                        </p>

                        <h2>
                            Fashion that understands you.
                        </h2>

                    </div>

                </div>


                <div className="home-feature-grid">

                    <div className="home-feature-card">

                        <div className="feature-number">
                            01
                        </div>

                        <div className="feature-icon">
                            🧍
                        </div>

                        <h3>
                            Personal Analysis
                        </h3>

                        <p>
                            AI considers your body shape, face shape and
                            skin tone to create personalized suggestions.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-number">
                            02
                        </div>

                        <div className="feature-icon">
                            👗
                        </div>

                        <h3>
                            Your Wardrobe
                        </h3>

                        <p>
                            Your own clothing collection becomes part of
                            the AI styling experience.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-number">
                            03
                        </div>

                        <div className="feature-icon">
                            ✨
                        </div>

                        <h3>
                            Smarter Outfits
                        </h3>

                        <p>
                            Get complete outfit combinations instead of
                            random clothing recommendations.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SHOP CTA
            ===================================================== */}

            <section className="home-shop-section">

                <div>

                    <p className="home-shop-label">
                        ✦ COMPLETE YOUR STYLE
                    </p>

                    <h2>
                        Find pieces that
                        <br />
                        feel like you.
                    </h2>

                    <p>
                        Explore fashion products and discover pieces
                        that complement your personal style.
                    </p>

                    <div className="home-shop-actions">

                        <button
                            onClick={goToProducts}
                            className="home-shop-button"
                        >
                            Explore Products →
                        </button>

                        <button
                            onClick={goToCart}
                            className="home-cart-link"
                        >
                            View Cart
                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;