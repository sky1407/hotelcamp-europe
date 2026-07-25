import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isDemoMode } from "../api/client.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      {isDemoMode && (
        <div className="demo-banner">
          Live demo with sample data — logins and edits reset on reload.{" "}
          <a href="https://github.com/sky1407/hotelcamp-europe">Run it locally</a> for the full experience.
        </div>
      )}
      <nav className="navbar">
        <Link to="/" className="brand">
          🏨 HotelCamp Europe
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/hotels/new">Add Hotel</Link>
              <span className="nav-user">Hi, {user.username}</span>
              <button className="link-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
