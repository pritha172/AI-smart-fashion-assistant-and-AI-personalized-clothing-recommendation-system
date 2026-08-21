import {useState} from "react";
import API from "../api";


function UploadImage(){


const [file,setFile]=useState(null);



const upload=async()=>{


const formData=new FormData();


formData.append(
"file",
file
);



const response=await API.post(

"/upload-image",

formData,

{
headers:{
"Content-Type":"multipart/form-data"
}
}

);


console.log(response.data);


};



return(

<div>

<h1>Upload Image</h1>


<input

type="file"

onChange={(e)=>setFile(e.target.files[0])}

/>


<button onClick={upload}>

Upload

</button>


</div>

);


}


export default UploadImage;