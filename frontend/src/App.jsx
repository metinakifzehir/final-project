import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Recommendations from "./pages/Recommendations";
import Search from "./pages/Search";
import RestaurantDetail from "./pages/RestaurantDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/search" element={<Search />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;