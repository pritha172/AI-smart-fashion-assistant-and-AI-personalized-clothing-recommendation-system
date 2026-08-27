import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // NEW
    const [showContinueModal, setShowContinueModal] = useState(false);

    const getUser = () => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) return null;

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const user = getUser();

        if (!user || !user.id) {
            setError("Please login to view your cart.");
            setLoading(false);
            return;
        }

        try {
            const response = await API.get("/cart/", {
                params: {
                    user_id: user.id
                }
            });

            setCart(response.data.cart || []);
        } catch (err) {
            console.error("Cart error:", err);
            setError("Unable to load your cart.");
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartId) => {
        const user = getUser();

        if (!user || !user.id) {
            alert("Please login first.");
            return;
        }

        try {
            await API.delete(`/cart/${cartId}`, {
                params: {
                    user_id: user.id
                }
            });

            await fetchCart();
        } catch (err) {
            console.error("Remove cart error:", err);

            alert(
                err.response?.data?.detail ||
                    "Unable to remove product."
            );
        }
    };

    // =====================================================
    // OPEN SELECTED REAL PRODUCT WEBSITE
    // =====================================================

    const openProduct = (productUrl) => {
        if (!productUrl) {
            alert("Real product website link is not available.");
            return;
        }

        window.open(
            productUrl,
            "_blank",
            "noopener,noreferrer"
        );

        setShowContinueModal(false);
    };

    // =====================================================
    // CONTINUE SHOPPING
    // =====================================================

    const handleContinueShopping = () => {
        if (cart.length === 0) {
            navigate("/products");
            return;
        }

        // Show products from cart
        setShowContinueModal(true);
    };

    if (loading) {
        return (
            <div className="cart-page cart-state">
                <div>
                    <div className="cart-icon">🛍️</div>

                    <h2>
                        Loading Your Shopping Bag
                    </h2>

                    <p>
                        Getting your selected pieces...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page cart-state">
                <div className="cart-message">

                    <div className="cart-icon">
                        🛍️
                    </div>

                    <h2>
                        Your Shopping Bag
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="cart-gradient-button"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="cart-header">

                <div>

                    <p className="cart-eyebrow">
                        YOUR FASHION PICKS
                    </p>

                    <h1>
                        Your Shopping
                        <br />
                        <span>Bag.</span>
                    </h1>

                    <p>
                        Pieces you've chosen for your
                        personal style.
                    </p>

                </div>

                <button
                    className="continue-top"
                    onClick={handleContinueShopping}
                >
                    ← Continue Shopping
                </button>

            </section>


            {/* =================================================
                EMPTY CART
            ================================================= */}

            {cart.length === 0 ? (

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛍️
                    </div>

                    <h2>
                        Your shopping bag is empty
                    </h2>

                    <p>
                        Discover something beautiful
                        for your wardrobe.
                    </p>

                    <button
                        className="cart-gradient-button"
                        onClick={() => navigate("/products")}
                    >
                        Explore Products →
                    </button>

                </div>

            ) : (

                <div className="cart-layout">

                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <div className="cart-items">

                        <div className="cart-items-heading">

                            <div>

                                <p>
                                    YOUR SELECTION
                                </p>

                                <h2>
                                    {cart.length}{" "}
                                    {cart.length === 1
                                        ? "Item"
                                        : "Items"}
                                </h2>

                            </div>

                        </div>


                        {cart.map((item) => (

                            <article
                                className="cart-item"
                                key={item.cart_id}
                            >

                                <div className="cart-image-wrap">

                                    <img
                                        src={
                                            item.image_url ||
                                            "https://via.placeholder.com/300x300?text=Fashion"
                                        }
                                        alt={item.name}
                                    />

                                </div>


                                <div className="cart-product-info">

                                    <p className="cart-category">
                                        FASHION PIECE
                                    </p>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    {item.brand && (
                                        <p className="cart-brand">
                                            {item.brand}
                                        </p>
                                    )}


                                    <div className="cart-actions">

                                        <button
                                            className="cart-buy"
                                            onClick={() =>
                                                openProduct(
                                                    item.product_url
                                                )
                                            }
                                        >
                                            View Product →
                                        </button>


                                        <button
                                            className="cart-remove"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.cart_id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <aside className="cart-summary">

                        <p className="summary-label">
                            SHOPPING BAG
                        </p>

                        <h2>
                            Your Style
                            <br />
                            Awaits.
                        </h2>


                        <div className="summary-line">

                            <span>
                                Items
                            </span>

                            <strong>
                                {cart.length}
                            </strong>

                        </div>


                        <div className="summary-line">

                            <span>
                                Selection
                            </span>

                            <strong>
                                Fashion
                            </strong>

                        </div>


                        <div className="summary-divider" />


                        <p className="summary-note">
                            Choose one of your saved
                            fashion pieces to continue
                            directly to its original
                            shopping website.
                        </p>


                        {/* IMPORTANT BUTTON */}

                        <button
                            className="summary-button"
                            onClick={handleContinueShopping}
                        >
                            Continue Shopping →
                        </button>


                        <button
                            className="summary-ai-button"
                            onClick={() =>
                                navigate("/analysis")
                            }
                        >
                            ✨ Get AI Styling
                        </button>

                    </aside>

                </div>
            )}


            {/* =====================================================
                PRODUCT SELECTION MODAL
            ===================================================== */}

            {showContinueModal && (

                <div
                    className="continue-modal-overlay"
                    onClick={() =>
                        setShowContinueModal(false)
                    }
                >

                    <div
                        className="continue-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="continue-modal-close"
                            onClick={() =>
                                setShowContinueModal(false)
                            }
                        >
                            ×
                        </button>


                        <p className="continue-modal-label">
                            CONTINUE SHOPPING
                        </p>


                        <h2>
                            Choose a piece
                            <br />
                            to shop
                        </h2>


                        <p className="continue-modal-subtitle">
                            Select one of your saved
                            products and we'll take you
                            directly to its original website.
                        </p>


                        <div className="continue-product-list">

                            {cart.map((item) => (

                                <button
                                    key={item.cart_id}
                                    className="continue-product-card"
                                    onClick={() =>
                                        openProduct(
                                            item.product_url
                                        )
                                    }
                                >

                                    <div className="continue-product-image">

                                        <img
                                            src={
                                                item.image_url ||
                                                "https://via.placeholder.com/100x100?text=Fashion"
                                            }
                                            alt={item.name}
                                        />

                                    </div>


                                    <div className="continue-product-info">

                                        <span>
                                            {item.brand ||
                                                "FASHION"}
                                        </span>

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <small>
                                            Shop this product →
                                        </small>

                                    </div>


                                    <div className="continue-product-arrow">
                                        →
                                    </div>

                                </button>

                            ))}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Cart;