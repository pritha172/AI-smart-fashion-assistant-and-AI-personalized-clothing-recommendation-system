import { useState } from "react";
import API from "../api";

function WardrobeUpload() {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);


    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);

        setPreview(
            URL.createObjectURL(selectedFile)
        );

        setResult(null);
    };


    const uploadWardrobe = async () => {

        if (!file) {

            alert(
                "Please select a clothing image first."
            );

            return;
        }


        // =========================================
        // GET LOGGED-IN USER
        // =========================================

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            alert(
                "Please login first."
            );

            return;
        }


        const user =
            JSON.parse(savedUser);


        if (!user.id) {

            alert(
                "User ID not found. Please login again."
            );

            return;
        }


        // =========================================
        // CREATE FORM DATA
        // =========================================

        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );


        formData.append(
            "user_id",
            user.id.toString()
        );


        try {

            setLoading(true);


            console.log(
                "Uploading wardrobe item..."
            );

            console.log(
                "User ID:",
                user.id
            );

            console.log(
                "File:",
                file.name
            );


            const response =
                await API.post(
                    "/wardrobe/upload",
                    formData
                );


            console.log(
                "Wardrobe upload response:",
                response.data
            );


            setResult(
                response.data
            );


            alert(
                "Clothing added to your wardrobe!"
            );


        }

        catch (error) {

            console.error(
                "Wardrobe upload error:",
                error
            );


            if (error.response) {

                console.error(
                    "Backend response:",
                    error.response.data
                );


                alert(
                    "Upload failed: " +
                    JSON.stringify(
                        error.response.data
                    )
                );

            }

            else {

                alert(
                    "Upload failed. Check the backend."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div
            style={{
                maxWidth: "700px",
                margin: "40px auto",
                padding: "30px",
                textAlign: "center"
            }}
        >

            <h1>
                👗 Add to My Wardrobe
            </h1>


            <p>
                Upload a photo of your clothing and
                AI will automatically detect its category
                and color.
            </p>


            {/* FILE INPUT */}

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />


            {/* PREVIEW */}

            {preview && (

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <h3>
                        Preview
                    </h3>


                    <img
                        src={preview}
                        alt="Wardrobe Preview"
                        style={{
                            width: "280px",
                            height: "320px",
                            objectFit: "cover",
                            borderRadius: "15px",
                            boxShadow:
                                "0 5px 20px rgba(0,0,0,0.15)"
                        }}
                    />

                </div>

            )}


            {/* UPLOAD BUTTON */}

            <div
                style={{
                    marginTop: "25px"
                }}
            >

                <button
                    onClick={uploadWardrobe}
                    disabled={
                        loading ||
                        !file
                    }
                    style={{
                        padding:
                            "12px 30px",
                        border: "none",
                        borderRadius:
                            "25px",
                        background:
                            "linear-gradient(45deg,#ff6b6b,#9b5de5)",
                        color: "white",
                        fontSize:
                            "16px",
                        cursor:
                            "pointer"
                    }}
                >

                    {loading
                        ? "AI Detecting..."
                        : "Add to Wardrobe"
                    }

                </button>

            </div>


            {/* AI RESULT */}

            {result && (

                <div
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        borderRadius: "15px",
                        background: "#f8f8f8"
                    }}
                >

                    <h2>
                        ✅ AI Detection Complete
                    </h2>


                    <p>
                        <strong>
                            Category:
                        </strong>{" "}
                        {result.category}
                    </p>


                                        <p>
                        <strong>
                            Color:
                        </strong>{" "}
                        {result.color}
                    </p>


                    <p>
                        <strong>
                            Occasion:
                        </strong>{" "}
                        {result.occasion}
                    </p>


                    <p>
                        <strong>
                            User ID:
                        </strong>{" "}
                        {result.user_id}
                    </p>
                </div>

            )}

        </div>

    );

}

export default WardrobeUpload;