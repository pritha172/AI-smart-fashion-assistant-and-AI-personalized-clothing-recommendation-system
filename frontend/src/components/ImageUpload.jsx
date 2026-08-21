import { useState } from "react";
import API from "../api";

function ImageUpload({ type, onUpload }) {

    const [file, setFile] = useState(null);

    const uploadImage = async () => {

        if (!file) {
            alert("Please select an image");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await API.post(
                "/upload-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            onUpload(response.data.filename);

            alert("Image Uploaded");

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div>

            <h3>{type}</h3>

            <input

                type="file"

                onChange={(e) =>
                    setFile(e.target.files[0])
                }

            />

            <button onClick={uploadImage}>

                Upload

            </button>

        </div>

    );

}

export default ImageUpload;