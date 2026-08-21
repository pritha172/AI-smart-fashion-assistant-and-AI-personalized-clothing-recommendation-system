import { useEffect, useState } from "react";
import API from "../api";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingId, setAddingId] = useState(null);


    // =====================================================
    // GET PRODUCTS
    // =====================================================

    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {

        try {

            const response = await API.get("/products");

            console.log("Products:", response.data);

            if (Array.isArray(response.data)) {

                setProducts(response.data);

            }
            else if (response.data.products) {

                setProducts(response.data.products);

            }
            else {

                setProducts([]);

            }

        }
        catch (error) {

            console.error(
                "Products error:",
                error
            );

            setError(
                "Unable to load products."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================

    const addToCart = async (product) => {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {

            alert(
                "Please login first to add products to your cart."
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


        try {

            setAddingId(product.id);

            const response = await API.post(
                "/cart/add",
                null,
                {
                    params: {
                        user_id: user.id,
                        product_id: product.id
                    }
                }
            );


            console.log(
                "Cart response:",
                response.data
            );


            alert(
                `${product.name} added to your cart!`
            );

        }
        catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            if (error.response) {

                alert(
                    "Unable to add product: " +
                    (
                        error.response.data.detail ||
                        "Server error"
                    )
                );

            }
            else {

                alert(
                    "Unable to add product. Please check the backend."
                );

            }

        }
        finally {

            setAddingId(null);

        }

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
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="products-page">

                <div className="loading-box">

                    <h2>
                        Loading Products...
                    </h2>

                    <p>
                        Finding the best fashion products for you.
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

            <div className="products-page">

                <div className="error-box">

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchProducts}
                        className="retry-button"
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

            {/* =========================================
                HEADER
            ========================================= */}

            <section className="products-header">

                <p className="products-label">
                    AI SMART FASHION
                </p>

                <h1>
                    Explore Our Collection
                </h1>

                <p className="products-subtitle">

                    Discover fashion pieces selected
                    to help you create your perfect style.

                </p>

            </section>


            {/* =========================================
                TOOLBAR
            ========================================= */}

            <div className="product-toolbar">

                <h2>
                    Fashion Collection
                </h2>

                <span>
                    {products.length} Products
                </span>

            </div>


            {/* =========================================
                EMPTY
            ========================================= */}

            {products.length === 0 ? (

                <div className="empty-products">

                    <h2>
                        No Products Available
                    </h2>

                    <p>
                        Products will appear here once
                        they are added to the collection.
                    </p>

                </div>

            ) : (

                <div className="product-container">

                    {products.map((product) => (

                        <div
                            className="product-card"
                            key={product.id}
                        >

                            {/* =================================
                                PRODUCT IMAGE
                            ================================= */}

                            <div className="product-image-container">

                                <img
                                    src={
                                        product.image_url ||
                                        "https://via.placeholder.com/400x400?text=Fashion"
                                    }
                                    alt={product.name}
                                    className="product-image"
                                />

                            </div>


                            {/* =================================
                                PRODUCT INFORMATION
                            ================================= */}

                            <div className="product-info">

                                <h3>
                                    {product.name}
                                </h3>


                                {product.brand && (

                                    <p className="product-brand">
                                        {product.brand}
                                    </p>

                                )}


                                {/* =================================
                                    BUTTONS
                                ================================= */}

                                <div className="product-buttons">

                                    {/* ADD TO CART */}

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
                                            : "Add to Cart"}

                                    </button>


                                    {/* VIEW REAL PRODUCT */}

                                    <button
                                        className="view-product-button"
                                        onClick={() =>
                                            openProduct(
                                                product.product_url
                                            )
                                        }
                                    >

                                        View Product

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

export default Products;