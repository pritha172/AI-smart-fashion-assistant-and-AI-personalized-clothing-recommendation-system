import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const goToAnalysis = () => {
        navigate("/analysis");
    };

    const goToProducts = () => {
        navigate("/products");
    };

    return (
        <div className="home">

            {/* ================= HERO ================= */}
            <section className="hero">

                <div className="hero-content">
                    <p className="hero-small">
                        AI POWERED FASHION
                    </p>

                    <h1>
                        YOUR STYLE,
                        <br />
                        <span>YOUR WAY.</span>
                    </h1>

                    <p className="hero-description">
                        Discover outfits that match your style,
                        body shape and personality with AI.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="primary-btn"
                            onClick={goToAnalysis}
                        >
                            ✨ GET AI RECOMMENDATION
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={goToProducts}
                        >
                            SHOP PRODUCTS
                        </button>
                    </div>
                </div>

                <div className="hero-image">
    <img
        src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
        alt="AI Fashion Assistant"
    />
</div>

            </section>


            {/* ================= TODAY'S LOOK ================= */}
            <section className="section today-section">

                <h2>
                    TODAY'S LOOK ✨
                </h2>

                <div className="today-card">

                    <div className="today-content">

                        <h3>
                            Sunny Day Style
                        </h3>

                        <p>
                            ☀️ Weather: 23°C
                        </p>

                        <p>
                            ⭐ Match Score: 95%
                        </p>

                        <div className="today-buttons">

                            <button
                                onClick={goToAnalysis}
                            >
                                TRY IT ON
                            </button>

                            <button
                                onClick={goToAnalysis}
                            >
                                ADJUST OUTFIT
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= RECOMMENDED ================= */}
            <section className="section">

                <h2>
                    RECOMMENDED FOR YOU
                </h2>

                <div className="recommendation-grid">

                    <div
                        className="recommendation-card"
                        onClick={goToProducts}
                    >
                        <div className="recommendation-icon">
                            👕
                        </div>

                        <h3>
                            T-Shirt
                        </h3>

                        <p>
                            92% Match
                        </p>
                    </div>


                    <div
                        className="recommendation-card"
                        onClick={goToProducts}
                    >
                        <div className="recommendation-icon">
                            👖
                        </div>

                        <h3>
                            Jeans
                        </h3>

                        <p>
                            89% Match
                        </p>
                    </div>


                    <div
                        className="recommendation-card"
                        onClick={goToProducts}
                    >
                        <div className="recommendation-icon">
                            🧥
                        </div>

                        <h3>
                            Blazer
                        </h3>

                        <p>
                            91% Match
                        </p>
                    </div>

                </div>

            </section>


            {/* ================= AI FEATURES ================= */}
            <section className="section features-section">

                <h2>
                    AI FASHION FEATURES
                </h2>

                <div className="feature-grid">

                    <div
                        className="feature-card"
                        onClick={goToAnalysis}
                    >
                        <div className="feature-icon">
                            🤖
                        </div>

                        <h3>
                            Virtual Try-On
                        </h3>

                        <p>
                            Try outfits using AI
                        </p>
                    </div>


                    <div
                        className="feature-card"
                        onClick={goToAnalysis}
                    >
                        <div className="feature-icon">
                            🎯
                        </div>

                        <h3>
                            Style Quiz
                        </h3>

                        <p>
                            Find your fashion personality
                        </p>
                    </div>


                    <div
                        className="feature-card"
                        onClick={goToAnalysis}
                    >
                        <div className="feature-icon">
                            👗
                        </div>

                        <h3>
                            AI Outfit Recommendation
                        </h3>

                        <p>
                            Get outfits selected specially for you
                        </p>
                    </div>

                </div>

            </section>


            {/* ================= SHOP CTA ================= */}
            <section className="shop-section">

                <div>
                    <p className="shop-small">
                        FIND YOUR PERFECT STYLE
                    </p>

                    <h2>
                        READY TO UPGRADE
                        <br />
                        YOUR WARDROBE?
                    </h2>

                    <button
                        onClick={goToProducts}
                        className="shop-btn"
                    >
                        EXPLORE PRODUCTS →
                    </button>
                </div>

            </section>

        </div>
    );
}

export default Home;