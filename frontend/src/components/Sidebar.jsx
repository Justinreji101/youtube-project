import { Link } from "react-router-dom";
import {
  FaFire,
  FaHistory,
  FaHome,
  FaPlayCircle,
  FaRegClock,
  FaThumbsUp,
  FaUserFriends
} from "react-icons/fa";

export default function Sidebar({ sidebarOpen, user }) {
  return (
    <aside className={sidebarOpen ? "sidebar" : "sidebar closed"}>
      <Link to="/" className="side-item active">
        <FaHome />
        <span>Home</span>
      </Link>

      <button className="side-item">
        <FaFire />
        <span>Trending</span>
      </button>

      <button className="side-item">
        <FaPlayCircle />
        <span>Shorts</span>
      </button>

      <button className="side-item">
        <FaUserFriends />
        <span>Subscriptions</span>
      </button>

      <div className="side-line"></div>

      <button className="side-item">
        <FaHistory />
        <span>History</span>
      </button>

      <button className="side-item">
        <FaRegClock />
        <span>Watch later</span>
      </button>

      <button className="side-item">
        <FaThumbsUp />
        <span>Liked videos</span>
      </button>

      {user && (
        <div className="sidebar-user">
          <img src={user.avatar} alt="" />
          <div>
            <b>{user.channelName}</b>
            <p>Your channel</p>
          </div>
        </div>
      )}
    </aside>
  );
}