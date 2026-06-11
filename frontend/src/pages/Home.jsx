import VideoCard from "../components/VideoCard";

const quickSearches = [
  "Songs",
  "Trending",
  "Coding",
  "Gaming",
  "Movies",
  "News",
  "Technology",
  "Education",
  "Travel"
];

export default function Home({
  videos = [],
  loading = false,
  error = "",
  onSearch
}) {
  function handleQuickSearch(query) {
    if (onSearch) {
      onSearch(query);
    }
  }

  return (
    <div className="home-page">
      <div className="hero-strip">
        <div>
          <span className="hero-badge">Real YouTube Feed</span>
          <h1>Explore YouTube Videos</h1>
          <p>
            YouTube API il ninn automatic fetch cheytha videos ivide premium
            Youtube-project UI il show aakum.
          </p>
        </div>

        <button
          type="button"
          className="hero-refresh-btn"
          onClick={() => handleQuickSearch("trending videos")}
        >
          Refresh Feed
        </button>
      </div>

      <div className="chips-row">
        {quickSearches.map((item) => (
          <button
            type="button"
            className="chip"
            key={item}
            onClick={() => handleQuickSearch(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <div className="video-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="skeleton-card" key={index}></div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="empty-box">
          <h2>Videos load aayilla</h2>
          <p>{error}</p>

          <button
            type="button"
            className="retry-btn"
            onClick={() => handleQuickSearch("songs")}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="empty-box">
          <h2>No videos found</h2>
          <p>YouTube API response empty aanu. Try another keyword.</p>

          <button
            type="button"
            className="retry-btn"
            onClick={() => handleQuickSearch("trending videos")}
          >
            Load Trending
          </button>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard video={video} key={video.id} />
          ))}
        </div>
      )}
    </div>
  );
}