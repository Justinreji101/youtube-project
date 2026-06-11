import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className="video-card">
      <div className="thumb-wrap">
        <img src={video.thumbnail} alt={video.title} />
        <span className="duration">YouTube</span>
      </div>

      <div className="video-info">
        <img className="channel-avatar" src={video.avatar} alt="" />

        <div>
          <h3>{video.title}</h3>

          <p className="channel-name">
            {video.channelName}
            <FaCheckCircle />
          </p>

          <p className="video-meta">
            {video.views} • {video.category}
          </p>
        </div>
      </div>
    </Link>
  );
}