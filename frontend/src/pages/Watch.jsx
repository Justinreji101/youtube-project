import { Link, useParams } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaDownload,
  FaEllipsisH,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaShare
} from "react-icons/fa";

export default function Watch({ videos = [] }) {
  const { id } = useParams();

  const video = videos.find((item) => item.id === id);
  const recommendedVideos = videos.filter((item) => item.id !== id);

  return (
    <div className="yt-watch-page">
      <section className="yt-watch-main">
        <div className="yt-player">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title={video?.title || "YouTube Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <h1 className="yt-title">{video?.title || "YouTube Video"}</h1>

        <div className="yt-under-title">
          <p>
            {video?.views || "YouTube"} • {video?.category || "Video"}
          </p>

          <div className="yt-actions">
            <button type="button">
              <FaRegThumbsUp />
              Like
            </button>

            <button type="button">
              <FaRegThumbsDown />
              Dislike
            </button>

            <button type="button">
              <FaShare />
              Share
            </button>

            <button type="button">
              <FaDownload />
              Download
            </button>

            <button type="button" className="yt-round">
              <FaEllipsisH />
            </button>
          </div>
        </div>

        <div className="yt-channel-box">
          <div className="yt-channel-left">
            <img
              src={
                video?.avatar ||
                "https://ui-avatars.com/api/?name=YouTube&background=random"
              }
              alt=""
            />

            <div>
              <h3>
                {video?.channelName || "YouTube Channel"}
                <FaCheckCircle />
              </h3>
              <p>Real YouTube video • Subscribe for more videos</p>
            </div>
          </div>

          <button type="button" className="yt-subscribe">
            <FaBell />
            Subscribe
          </button>
        </div>

        <div className="yt-description">
          <b>Description</b>
          <p>
            {video?.description ||
              "This video is loaded directly from YouTube using YouTube embed player."}
          </p>

          {video?.publishedAt && (
            <span>
              Published: {new Date(video.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="yt-comments">
          <h2>Comments</h2>

          <div className="yt-comment-input">
            <img
              src="https://ui-avatars.com/api/?name=User&background=random"
              alt=""
            />
            <input placeholder="Add a comment..." />
          </div>

          <div className="yt-comment">
            <img
              src="https://ui-avatars.com/api/?name=Viewer&background=random"
              alt=""
            />

            <div>
              <h4>@viewer</h4>
              <p>Nice video! This page looks like a real YouTube watch page.</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="yt-recommended">
        <div className="yt-chip-row">
          <button type="button" className="active">
            All
          </button>
          <button type="button">Related</button>
          <button type="button">Recently uploaded</button>
        </div>

        {recommendedVideos.length === 0 ? (
          <div className="yt-empty-rec">
            <p>No recommended videos found.</p>
          </div>
        ) : (
          recommendedVideos.slice(0, 14).map((item) => (
            <Link
              to={`/watch/${item.id}`}
              className="yt-rec-card"
              key={item.id}
            >
              <div className="yt-rec-thumb">
                <img src={item.thumbnail} alt={item.title} />
                <span>▶</span>
              </div>

              <div className="yt-rec-info">
                <h4>{item.title}</h4>
                <p>{item.channelName}</p>
                <small>{item.views || "YouTube"} • Recommended</small>
              </div>
            </Link>
          ))
        )}
      </aside>
    </div>
  );
}