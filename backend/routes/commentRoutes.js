const express = require("express");
const Comment = require("../models/Comment");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:videoId", async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username channelName avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/:videoId", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment is required"
      });
    }

    const comment = await Comment.create({
      text,
      video: req.params.videoId,
      user: req.user._id
    });

    const populated = await comment.populate("user", "username channelName avatar");

    res.status(201).json({
      success: true,
      comment: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;