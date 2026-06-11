const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "YouTube API key missing in backend .env"
      });
    }

    const q = req.query.q || "trending videos";

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          part: "snippet",
          q,
          type: "video",
          maxResults: 24,
          safeSearch: "moderate"
        }
      }
    );

    const videos = response.data.items.map((item) => ({
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
      category: "YouTube",
      views: "YouTube"
    }));

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to fetch YouTube videos"
    });
  }
});

router.get("/video/:id", async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "YouTube API key missing in backend .env"
      });
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          part: "snippet,statistics",
          id: req.params.id
        }
      }
    );

    const item = response.data.items[0];

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const video = {
      id: item.id,
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
      category: "YouTube",
      views: Number(item.statistics.viewCount || 0).toLocaleString() + " views",
      likes: Number(item.statistics.likeCount || 0).toLocaleString()
    };

    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to fetch video"
    });
  }
});

module.exports = router;