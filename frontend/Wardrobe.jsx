import { useEffect, useState } from "react";
import API from "../api";

function Wardrobe() {

    const [items, setItems] = useState([]);

    useEffect(() => {

        loadWardrobe();

    }, []);

    const loadWardrobe = async () => {

        try {

            const response = await API.get("/wardrobe");

            setItems(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container">

            <h1>My Wardrobe</h1>

            <div className="products">

                {

                    items.map((item) => (

                        <div
                            key={item.id}
                            className="product-card"
                        >

                            <img

                                src={`http://127.0.0.1:8000/${item.image_url}`}

                                alt={item.category}

                            />

                            <h3>{item.category}</h3>

                            <p>Color : {item.color}</p>

                            <p>Season : {item.season}</p>

                            <p>Style : {item.style}</p>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default Wardrobe;