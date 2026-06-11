import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import VideoCard from "../components/VideoCard";

export default function Channel() {
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/videos");

        const owned = res.data.videos.filter((video) => video.owner._id === id);

        setVideos(owned);

        if (owned.length > 0) {
          setChannel(owned[0].owner);
        }
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, [id]);

  if (!channel) {
    return (
      <div className="empty-box">
        <h2>Channel not found</h2>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <div className="channel-banner"></div>

      <div className="channel-header">
        <img src={channel.avatar} alt="" />

        <div>
          <h1>{channel.channelName}</h1>
          <p>{channel.subscribers?.length || 0} subscribers • {videos.length} videos</p>
        </div>

        <button>Subscribe</button>
      </div>

      <h2 className="section-title">Videos</h2>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard video={video} key={video._id} />
        ))}
      </div>
    </div>
  );
}