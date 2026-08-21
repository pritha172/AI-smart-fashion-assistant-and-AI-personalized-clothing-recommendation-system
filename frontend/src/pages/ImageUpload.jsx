import { useState } from "react";
import API from "../api";

function ImageUpload() {

    const [bodyImage, setBodyImage] = useState(null);

    const [preview, setPreview] = useState("");


    const uploadBody = async () => {

        if (!bodyImage) return;

        const formData = new FormData();

        formData.append("file", bodyImage);

        try {

            await API.post(

                "/upload/body",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            alert("Body Image Uploaded Successfully");

        }

        catch (error) {

            console.log(error);

        }

    };


    return (

        <div>

            <h1>Upload Body Image</h1>

            <input

                type="file"

                onChange={(e) => {

                    setBodyImage(e.target.files[0]);

                    setPreview(

                        URL.createObjectURL(e.target.files[0])

                    );

                }}

            />

            <br /><br />

            {

                preview &&

                <img

                    src={preview}

                    alt="Preview"

                    width="300"

                />

            }

            <br /><br />

            <button onClick={uploadBody}>

                Upload

            </button>

        </div>

    );

}

export default ImageUpload;