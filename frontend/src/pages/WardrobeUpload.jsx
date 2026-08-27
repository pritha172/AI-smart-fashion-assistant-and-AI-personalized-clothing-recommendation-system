import { useState } from "react";
import API from "../api";
import "./WardrobeUpload.css";

function WardrobeUpload() {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // =========================================
    // FILE SELECTION
    // =========================================

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


    // =========================================
    // UPLOAD TO BACKEND
    // =========================================

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


    // =========================================
    // REMOVE SELECTED IMAGE
    // =========================================

    const removeImage = () => {

        setFile(null);

        setPreview("");

        setResult(null);

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div className="wardrobe-upload-page">


            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <section className="wardrobe-upload-header">

                <div className="wardrobe-mini-label">
                    ✦ MY DIGITAL WARDROBE
                </div>

                <h1>
                    Add a New Piece
                    <span> ✨</span>
                </h1>

                <p>
                    Upload your clothing and let our AI
                    automatically identify its category,
                    color and occasion.
                </p>

            </section>



            {/* =========================================
                MAIN UPLOAD CARD
            ========================================= */}

            <section className="wardrobe-upload-card">


                {/* Decorative sparkles */}

                <span className="upload-sparkle sparkle-a">
                    ✦
                </span>

                <span className="upload-sparkle sparkle-b">
                    ✦
                </span>

                <span className="upload-sparkle sparkle-c">
                    ✦
                </span>



                {/* =========================================
                    UPLOAD AREA
                ========================================= */}

                {!preview && (

                    <label
                        className="wardrobe-drop-zone"
                        htmlFor="wardrobe-file"
                    >

                        <div className="wardrobe-upload-icon">
                            👗
                        </div>

                        <h2>
                            Upload your clothing
                        </h2>

                        <p>
                            Choose a photo of a dress,
                            top, bottom, jacket or any
                            other fashion item.
                        </p>

                        <div className="choose-image-button">
                            Choose Image
                        </div>

                        <span className="upload-hint">
                            JPG, JPEG or PNG • Your image stays private
                        </span>


                        <input
                            id="wardrobe-file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                    </label>

                )}



                {/* =========================================
                    IMAGE PREVIEW
                ========================================= */}

                {preview && (

                    <div className="wardrobe-preview-section">


                        <div className="preview-header">

                            <div>

                                <span className="preview-label">
                                    YOUR CLOTHING
                                </span>

                                <h2>
                                    Ready for AI analysis ✨
                                </h2>

                            </div>


                            <button
                                className="remove-image-button"
                                onClick={removeImage}
                                type="button"
                            >
                                ✕
                            </button>

                        </div>



                        <div className="wardrobe-preview-layout">


                            {/* IMAGE */}

                            <div className="wardrobe-preview-frame">

                                <img
                                    src={preview}
                                    alt="Wardrobe Preview"
                                />

                            </div>



                            {/* IMAGE INFO */}

                            <div className="preview-information">

                                <div className="preview-file-card">

                                    <div className="file-icon">
                                        🖼️
                                    </div>

                                    <div>

                                        <strong>
                                            {file?.name}
                                        </strong>

                                        <span>
                                            Ready to analyze
                                        </span>

                                    </div>

                                </div>


                                <div className="ai-info-box">

                                    <div className="ai-info-icon">
                                        ✨
                                    </div>

                                    <div>

                                        <strong>
                                            AI will detect
                                        </strong>

                                        <p>
                                            Category • Color • Occasion
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="wardrobe-analyze-button"
                                    onClick={uploadWardrobe}
                                    disabled={loading}
                                    type="button"
                                >

                                    {loading ? (

                                        <>
                                            <span className="wardrobe-spinner"></span>

                                            AI is analyzing...
                                        </>

                                    ) : (

                                        <>
                                            ✨
                                            Add to My Wardrobe
                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                )}



                {/* =========================================
                    LOADING STATE
                ========================================= */}

                {loading && (

                    <div className="ai-processing">

                        <div className="processing-animation">
                            ✨
                        </div>

                        <div>

                            <strong>
                                AI is analyzing your clothing
                            </strong>

                            <p>
                                Detecting category, color and occasion...
                            </p>

                        </div>

                    </div>

                )}



                {/* =========================================
                    AI RESULT
                ========================================= */}

                {result && (

                    <div className="wardrobe-result-card">


                        <div className="result-success-icon">
                            ✓
                        </div>


                        <div className="result-heading">

                            <span>
                                AI ANALYSIS COMPLETE
                            </span>

                            <h2>
                                Added to Your Wardrobe ✨
                            </h2>

                            <p>
                                Your clothing has been successfully
                                analyzed and saved.
                            </p>

                        </div>



                        <div className="wardrobe-result-grid">


                            {/* CATEGORY */}

                            <div className="wardrobe-result-item">

                                <div className="result-item-icon category-result-icon">
                                    👗
                                </div>

                                <span>
                                    CATEGORY
                                </span>

                                <strong>
                                    {result.category || "Not detected"}
                                </strong>

                            </div>



                            {/* COLOR */}

                            <div className="wardrobe-result-item">

                                <div className="result-item-icon color-result-icon">
                                    🎨
                                </div>

                                <span>
                                    COLOR
                                </span>

                                <strong>
                                    {result.color || "Not detected"}
                                </strong>

                            </div>



                            {/* OCCASION */}

                            <div className="wardrobe-result-item">

                                <div className="result-item-icon occasion-result-icon">
                                    ✨
                                </div>

                                <span>
                                    OCCASION
                                </span>

                                <strong>
                                    {result.occasion || "Not detected"}
                                </strong>

                            </div>

                        </div>



                        {/* USER */}

                        <div className="wardrobe-saved-message">

                            <span>
                                💖
                            </span>

                            This item is now part of your
                            personalized digital wardrobe.

                        </div>


                    </div>

                )}

            </section>



            {/* =========================================
                BOTTOM FEATURES
            ========================================= */}

            <section className="wardrobe-upload-features">


                <div className="upload-feature">

                    <div>
                        ✨
                    </div>

                    <span>
                        AI Powered
                    </span>

                    <p>
                        Automatic clothing detection
                    </p>

                </div>



                <div className="upload-feature">

                    <div>
                        🎨
                    </div>

                    <span>
                        Smart Detection
                    </span>

                    <p>
                        Category and color recognition
                    </p>

                </div>



                <div className="upload-feature">

                    <div>
                        🔒
                    </div>

                    <span>
                        Private
                    </span>

                    <p>
                        Your wardrobe stays personal
                    </p>

                </div>


            </section>


        </div>

    );

}

export default WardrobeUpload;