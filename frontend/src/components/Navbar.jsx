import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";

export default function Navbar({
  user,
  logout,
  search,
  setSearch,
  sidebarOpen,
  setSidebarOpen
}) {
  const navigate = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="nav-left">
        <button
          className="icon-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>

        <Link to="/" className="brand">
          <span className="play-logo">▶</span>
          <span>Youtube-project</span>
        </Link>
      </div>

      <form className="search-box" onSubmit={submitSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos, channels, topics..."
        />
        <button>
          <FaSearch />
        </button>
      </form>

      <div className="nav-actions">
        {user && (
          <Link to="/upload" className="upload-btn">
            <FaPlus />
            <span>Upload</span>
          </Link>
        )}

        <button className="icon-btn">
          <FaBell />
        </button>

        {user ? (
          <>
            <div className="mini-profile">
              <img src={user.avatar} alt="" />
              <span>{user.channelName}</span>
            </div>

            <button className="icon-btn danger" onClick={logout}>
              <FaSignOutAlt />
            </button>
          </>
        ) : (
          <Link to="/login" className="signin-btn">
            <FaUserCircle />
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}