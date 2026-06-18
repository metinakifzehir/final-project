import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecommendationProvider } from "./context/RecommendationContext"; // Context'i import et
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recommendations from "./pages/Recommendations";
import Search from "./pages/Search";
import RestaurantDetail from "./pages/RestaurantDetail";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      {/* Tüm uygulamayı context provider ile sarmala */}
      <RecommendationProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/search" element={<Search />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Recommendations />} />
        </Routes>
      </RecommendationProvider>
    </Router>
  );
}

export default App;
