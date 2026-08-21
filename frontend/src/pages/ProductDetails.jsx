import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import API from "../api";


function ProductDetails(){


const {id}=useParams();


const [product,setProduct]=useState(null);



useEffect(()=>{


API.get(`/products/${id}`)

.then(response=>{

setProduct(response.data);

});


},[id]);



if(!product){

return <h2>Loading...</h2>

}



return(

<div>


<h1>
{product.name}
</h1>


<img

src={product.image_url}

/>


<h3>
Category:
{product.category}
</h3>


<h3>
Brand:
{product.brand}
</h3>


<h3>
Price:
₹{product.price}
</h3>


<h3>
Stock:
{product.stock}
</h3>


<p>
{product.description}
</p>


<button>
Add To Cart
</button>


</div>

);


}


export default ProductDetails;