import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Products.css";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingId, setAddingId] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/products");

            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts(response.data.products || []);
            }
        } catch (err) {
            console.error("Products error:", err);
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================

    const addToCart = async (product) => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            alert("Please login first to add products to your cart.");
            navigate("/login");
            return;
        }

        let user;

        try {
            user = JSON.parse(savedUser);
        } catch {
            alert("Invalid login information. Please login again.");
            return;
        }

        if (!user.id) {
            alert("User ID not found. Please login again.");
            return;
        }

        try {
            setAddingId(product.id);

            await API.post(
                "/cart/add",
                null,
                {
                    params: {
                        user_id: user.id,
                        product_id: product.id
                    }
                }
            );

            alert(`${product.name} added to your cart!`);
        } catch (err) {
            console.error("Add to cart error:", err);

            alert(
                "Unable to add product: " +
                (
                    err.response?.data?.detail ||
                    "Server error"
                )
            );
        } finally {
            setAddingId(null);
        }
    };

    // =====================================================
    // OPEN REAL PRODUCT WEBSITE
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
    // SEARCH
    // =====================================================

    const filteredProducts = products.filter((product) => {
        const text = `
            ${product.name || ""}
            ${product.brand || ""}
            ${product.category || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="products-page products-state">
                <div>
                    <div className="products-loader-icon">
                        ✦
                    </div>

                    <h2>
                        Curating Your Collection
                    </h2>

                    <p>
                        Finding fashion pieces for you...
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
            <div className="products-page products-state">
                <div className="products-error">

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchProducts}
                        className="gradient-product-button"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // PRODUCTS PAGE
    // =====================================================

    return (
        <div className="products-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="products-hero">

                <div>

                    <p className="products-label">
                        AI SMART FASHION
                    </p>

                    <h1>
                        Shop Your
                        <br />
                        <span>
                            Perfect Style.
                        </span>
                    </h1>

                    <p className="products-subtitle">
                        Discover fashion pieces selected to
                        complete your personal style.
                    </p>

                </div>

                <button
                    className="cart-top-button"
                    onClick={() => navigate("/cart")}
                >
                    🛍 Cart
                </button>

            </section>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <section className="products-toolbar">

                <div>

                    <p>
                        THE COLLECTION
                    </p>

                    <h2>
                        Fashion Pieces
                    </h2>

                </div>

                <div className="products-search">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </section>

            {/* =================================================
                COUNT
            ================================================= */}

            <div className="products-count">
                Showing {filteredProducts.length} of{" "}
                {products.length} products
            </div>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            {filteredProducts.length === 0 ? (

                <div className="empty-products">

                    <div>
                        🛍️
                    </div>

                    <h2>
                        No products found
                    </h2>

                    <p>
                        Try searching for another fashion piece.
                    </p>

                </div>

            ) : (

                <div className="product-grid">

                    {filteredProducts.map((product) => (

                        <article
                            className="product-card"
                            key={product.id}
                        >

                            {/* IMAGE */}

                            <div className="product-image-wrap">

                                <img
                                    src={
                                        product.image_url ||
                                        "https://via.placeholder.com/500x500?text=Fashion"
                                    }
                                    alt={product.name}
                                    className="product-image"
                                />

                                <span className="product-badge">
                                    AI STYLE
                                </span>

                            </div>

                            {/* INFORMATION */}

                            <div className="product-info">

                                <p className="product-category">
                                    {product.category || "FASHION"}
                                </p>

                                <h3>
                                    {product.name}
                                </h3>

                                {product.brand && (
                                    <p className="product-brand">
                                        {product.brand}
                                    </p>
                                )}

                                {/* ACTIONS */}

                                <div className="product-actions">

                                    <button
                                        className="add-cart-button"
                                        onClick={() =>
                                            addToCart(product)
                                        }
                                        disabled={
                                            addingId === product.id
                                        }
                                    >
                                        {addingId === product.id
                                            ? "Adding..."
                                            : "+ Add to Cart"}
                                    </button>

                                    <button
                                        className="view-product-button"
                                        onClick={() =>
                                            openProduct(
                                                product.product_url
                                            )
                                        }
                                    >
                                        View Product →
                                    </button>

                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            )}

            {/* =================================================
                BOTTOM CTA
            ================================================= */}

            <section className="products-bottom-cta">

                <div>

                    <p>
                        READY TO STYLE?
                    </p>

                    <h2>
                        Let AI build your
                        <br />
                        perfect outfit.
                    </h2>

                </div>

                <button
                    onClick={() =>
                        navigate("/analysis")
                    }
                >
                    ✨ Open AI Assistant
                </button>

            </section>

        </div>
    );
}

export default Products;