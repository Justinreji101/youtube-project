import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import Channel from "./pages/Channel";
import api from "./api";
import { youtube } from "./config/youtube";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState("");

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("yt_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchYoutubeVideos(query = "songs") {
    try {
      setYoutubeLoading(true);
      setYoutubeError("");

      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

      if (!apiKey) {
        setYoutubeError("YouTube API key missing. Add VITE_YOUTUBE_API_KEY in frontend/.env");
        setVideos([]);
        return;
      }

      console.log("Fetching YouTube videos:", query);

      const response = await youtube.get("/search", {
        params: {
          part: "snippet",
          maxResults: 24,
          type: "video",
          key: apiKey,
          q: query
        }
      });

      const formattedVideos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          item.snippet.channelTitle
        )}&background=random`,
        views: "YouTube",
        category: "YouTube"
      }));

      setVideos(formattedVideos);
      console.log("Formatted videos:", formattedVideos);
    } catch (error) {
      console.log("YouTube API Error:", error);

      setYoutubeError(
        error.response?.data?.error?.message || "YouTube videos load failed"
      );

      setVideos([]);
    } finally {
      setYoutubeLoading(false);
    }
  }

  useEffect(() => {
    fetchYoutubeVideos("songs");
  }, []);

  useEffect(() => {
    async function checkApi() {
      try {
        await api.get("/health");
        console.log("Backend connected ✅");
      } catch (error) {
        console.log("Backend not connected");
      }
    }

    checkApi();
  }, []);

  function logout() {
    localStorage.removeItem("yt_token");
    localStorage.removeItem("yt_user");
    setUser(null);
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        logout={logout}
        search={search}
        setSearch={setSearch}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearch={fetchYoutubeVideos}
      />

      <div className="app-body">
        <Sidebar sidebarOpen={sidebarOpen} user={user} />

        <main className={sidebarOpen ? "main-content" : "main-content wide"}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  search={search}
                  videos={videos}
                  loading={youtubeLoading}
                  error={youtubeError}
                />
              }
            />

            <Route
              path="/watch/:id"
              element={<Watch user={user} videos={videos} />}
            />

            <Route path="/channel/:id" element={<Channel />} />

            <Route
              path="/upload"
              element={user ? <Upload /> : <Navigate to="/login" />}
            />

            <Route path="/login" element={<Login setUser={setUser} />} />

            <Route
              path="/register"
              element={<Register setUser={setUser} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}