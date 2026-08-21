document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('userToken');
    
    const navbarHTML = `
        <nav class="navbar">
            <a href="index.html" class="nav-logo">Wardrobe AI</a>
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="wardrobe.html">My Closet</a>
                <a href="upload.html">Upload</a>
                <a href="analysis.html">Style Board</a>
                ${token ? '<a href="profile.html">Profile</a>' : '<a href="login.html">Login</a>'}
            </div>
        </nav>
    `;
    const container = document.getElementById("navbar-container");
    if (container) {
        container.innerHTML = navbarHTML;
    }
});