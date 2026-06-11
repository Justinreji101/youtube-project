const express = require("express");
const Video = require("../models/Video");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .populate("owner", "username channelName avatar subscribers")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/demo/seed", async (req, res) => {
  try {
    let demoUser = await User.findOne({ email: "demo@youtubeproject.com" });

    if (!demoUser) {
      demoUser = await User.create({
        username: "Demo Creator",
        channelName: "Youtube-project Studio",
        email: "demo@youtubeproject.com",
        password: "demo12345"
      });
    }

    const count = await Video.countDocuments();

    if (count > 0) {
      return res.json({
        success: true,
        message: "Demo videos already added"
      });
    }

    const demoVideos = [
      {
        title: "Modern Web Development Full Course",
        description:
          "Learn frontend, backend, database and deployment in one creative project.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
        category: "Coding",
        views: 13500,
        owner: demoUser._id
      },
      {
        title: "Creative UI UX Design Tips",
        description:
          "Premium UI design techniques for modern websites and mobile apps.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&auto=format&fit=crop",
        category: "Design",
        views: 9200,
        owner: demoUser._id
      },
      {
        title: "Build a Full Stack App with MongoDB",
        description:
          "Node.js, Express, MongoDB and React full stack app explanation.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop",
        category: "Coding",
        views: 18400,
        owner: demoUser._id
      },
      {
        title: "Relaxing Travel Cinematic Video",
        description: "A beautiful travel style video with cinematic visuals.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop",
        category: "Travel",
        views: 7600,
        owner: demoUser._id
      }
    ];

    await Video.insertMany(demoVideos);

    res.json({
      success: true,
      message: "Demo videos added successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "owner",
      "username channelName avatar banner subscribers"
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    video.views += 1;
    await video.save();

    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, category } = req.body;

    if (!title || !videoUrl || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and thumbnail are required"
      });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnail,
      category,
      owner: req.user._id
    });

    const populated = await video.populate(
      "owner",
      "username channelName avatar subscribers"
    );

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/:id/like", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const userId = req.user._id.toString();

    video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);

    if (video.likes.some((id) => id.toString() === userId)) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.likes.push(req.user._id);
    }

    await video.save();

    res.json({
      success: true,
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/:id/dislike", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const userId = req.user._id.toString();

    video.likes = video.likes.filter((id) => id.toString() !== userId);

    if (video.dislikes.some((id) => id.toString() === userId)) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes.push(req.user._id);
    }

    await video.save();

    res.json({
      success: true,
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/subscribe/:channelId", protect, async (req, res) => {
  try {
    const channel = await User.findById(req.params.channelId);
    const currentUser = await User.findById(req.user._id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    if (channel._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot subscribe to your own channel"
      });
    }

    const alreadySubscribed = channel.subscribers.some(
      (id) => id.toString() === currentUser._id.toString()
    );

    if (alreadySubscribed) {
      channel.subscribers = channel.subscribers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      currentUser.subscribedChannels = currentUser.subscribedChannels.filter(
        (id) => id.toString() !== channel._id.toString()
      );
    } else {
      channel.subscribers.push(currentUser._id);
      currentUser.subscribedChannels.push(channel._id);
    }

    await channel.save();
    await currentUser.save();

    res.json({
      success: true,
      subscribed: !alreadySubscribed,
      subscribers: channel.subscribers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;