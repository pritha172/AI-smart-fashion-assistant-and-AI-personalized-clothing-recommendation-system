import {useEffect,useState} from "react";

import API from "../api";


function History(){


const [history,setHistory]=useState([]);



useEffect(()=>{


loadHistory();


},[]);



const loadHistory=async()=>{


try{


const response = await API.get(
"/history/1"
);



setHistory(
response.data.history
);



}

catch(error){

console.log(error);

}


}



return(

<div>


<h1>
My AI Analysis History
</h1>



{

history.length===0 ?

<p>
No history found
</p>


:

history.map((item)=>(


<div key={item.id}>


<h3>
Analysis {item.id}
</h3>


<p>
Body Shape:
{item.body_shape}
</p>


<p>
Face Shape:
{item.face_shape}
</p>


<p>
Skin Tone:
{item.skin_tone}
</p>


<p>
Recommended:
{item.recommended_category}
</p>



</div>


))


}



</div>


)


}


export default History;