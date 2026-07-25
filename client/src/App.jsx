import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import HotelDetail from "./pages/HotelDetail.jsx";
import HotelForm from "./pages/HotelForm.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="page muted">Loading...</p>;
  if (!user) return <Login />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/hotels/new"
          element={
            <RequireAuth>
              <HotelForm mode="new" />
            </RequireAuth>
          }
        />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route
          path="/hotels/:id/edit"
          element={
            <RequireAuth>
              <HotelForm mode="edit" />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}
