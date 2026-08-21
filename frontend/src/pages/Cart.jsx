import { useEffect, useState } from "react";
import API from "../api";

function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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

            return JSON.parse(savedUser);

        }
        catch {

            return null;

        }

    };


    // =====================================================
    // FETCH CART
    // =====================================================

    useEffect(() => {

        fetchCart();

    }, []);


    const fetchCart = async () => {

        const user = getUser();


        if (!user || !user.id) {

            setError(
                "Please login to view your cart."
            );

            setLoading(false);

            return;

        }


        try {

            const response =
                await API.get(
                    "/cart/",
                    {
                        params: {
                            user_id: user.id
                        }
                    }
                );


            console.log(
                "My cart:",
                response.data
            );


            setCart(
                response.data.cart || []
            );

        }
        catch (error) {

            console.error(
                "Cart error:",
                error
            );

            setError(
                "Unable to load your cart."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    const removeFromCart = async (cartId) => {

        const user = getUser();


        if (!user || !user.id) {

            alert(
                "Please login first."
            );

            return;

        }


        try {

            await API.delete(
                `/cart/${cartId}`,
                {
                    params: {
                        user_id: user.id
                    }
                }
            );


            await fetchCart();


            alert(
                "Product removed from cart."
            );

        }
        catch (error) {

            console.error(
                "Remove cart error:",
                error
            );


            if (error.response) {

                alert(
                    error.response.data.detail ||
                    "Unable to remove product."
                );

            }
            else {

                alert(
                    "Unable to remove product."
                );

            }

        }

    };


    // =====================================================
    // BUY / VIEW REAL PRODUCT
    // =====================================================

    const buyProduct = (productUrl) => {

        if (!productUrl) {

            alert(
                "Real product website link is not available."
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

            <div className="cart">

                <h1>
                    Shopping Cart
                </h1>

                <p>
                    Loading your cart...
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="cart">

                <h1>
                    Shopping Cart
                </h1>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cart.length === 0) {

        return (

            <div className="cart">

                <h1>
                    Shopping Cart
                </h1>

                <div className="empty-cart">

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some fashion products
                        from the Products page.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // CART
    // =====================================================

    return (

        <div className="cart">

            <h1>
                Shopping Cart
            </h1>


            <div className="cart-list">

                {cart.map((item) => (

                    <div
                        className="cart-item"
                        key={item.cart_id}
                    >

                        {/* =================================
                            PRODUCT IMAGE
                        ================================= */}

                        <img
                            src={
                                item.image_url ||
                                "https://via.placeholder.com/150"
                            }
                            alt={item.name}
                            className="cart-product-image"
                        />


                        {/* =================================
                            PRODUCT INFORMATION
                        ================================= */}

                        <div className="cart-product-info">

                            <h3>
                                {item.name}
                            </h3>


                            {item.brand && (

                                <p>
                                    Brand: {item.brand}
                                </p>

                            )}

                        </div>


                        {/* =================================
                            ACTIONS
                        ================================= */}

                        <div className="cart-actions">

                            <button
                                onClick={() =>
                                    removeFromCart(
                                        item.cart_id
                                    )
                                }
                                className="remove-cart-button"
                            >

                                Remove

                            </button>


                            <button
                                onClick={() =>
                                    buyProduct(
                                        item.product_url
                                    )
                                }
                                className="buy-cart-button"
                            >

                                Buy / View Product

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default Cart;