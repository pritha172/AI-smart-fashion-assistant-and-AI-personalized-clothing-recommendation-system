import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

    const navigate = useNavigate();

    return (

        <div className="product-card">

            <img
                src={product.image_url}
                alt={product.name}
            />

            <h2>{product.name}</h2>

            <p>
                Category: {product.category}
            </p>

            <p>
                Color: {product.color}
            </p>

            <p>
                Brand: {product.brand}
            </p>

            <p>
                Price: ₹{product.price}
            </p>

            <button
                onClick={() => navigate(`/products/${product.id}`)}
            >
                View Details
            </button>

        </div>

    );

}

export default ProductCard;