import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ImageUpload from "./pages/ImageUpload";
import AIAnalysis from "./pages/AIAnalysis";
import Cart from "./pages/Cart";
import History from "./pages/History";
import Profile from "./pages/Profile";
import WardrobeAI from "./pages/WardrobeAI";
import Wardrobe from "./pages/Wardrobe";
import WardrobeUpload from "./pages/WardrobeUpload";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Welcome Page */}

        <Route
          path="/"
          element={<Welcome />}
        />

        {/* Home */}

        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* Login */}

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        {/* Register */}

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        {/* Profile */}

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />

        {/* Products */}

        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />

        {/* Product Details */}

        <Route
          path="/products/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
            </>
          }
        />

        {/* Upload */}

        <Route
          path="/upload"
          element={
            <>
              <Navbar />
              <ImageUpload />
            </>
          }
        />

        {/* AI Analysis */}

        <Route
          path="/analysis"
          element={
            <>
              <Navbar />
              <AIAnalysis />
            </>
          }
        />

        {/* Cart */}

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />

        {/* History */}

        <Route
          path="/history"
          element={
            <>
              <Navbar />
              <History />
            </>
          }
        />

        {/* Wardrobe AI */}

        <Route
          path="/wardrobe-ai"
          element={
            <>
              <Navbar />
              <WardrobeAI />
            </>
          }
        />

        {/* Wardrobe */}

        <Route
          path="/wardrobe"
          element={
            <>
              <Navbar />
              <Wardrobe />
            </>
          }
        />

        <Route
    path="/wardrobe-upload"
    element={
        <>
            <Navbar />
            <WardrobeUpload />
        </>
    }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;