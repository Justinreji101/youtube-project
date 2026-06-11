import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Upload() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    category: "Coding"
  });

  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/videos", form);

      alert("Video uploaded successfully ✅");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-page">
      <form className="upload-card" onSubmit={submit}>
        <div className="upload-heading">
          <span>⬆</span>
          <div>
            <h1>Upload Video</h1>
            <p>Paste video URL and thumbnail URL. File upload can be added next.</p>
          </div>
        </div>

        <input
          name="title"
          placeholder="Video title"
          value={form.title}
          onChange={update}
        />

        <textarea
          name="description"
          placeholder="Video description"
          value={form.description}
          onChange={update}
        ></textarea>

        <input
          name="videoUrl"
          placeholder="Video URL / MP4 URL"
          value={form.videoUrl}
          onChange={update}
        />

        <input
          name="thumbnail"
          placeholder="Thumbnail image URL"
          value={form.thumbnail}
          onChange={update}
        />

        <select name="category" value={form.category} onChange={update}>
          <option>Coding</option>
          <option>Design</option>
          <option>Music</option>
          <option>Gaming</option>
          <option>Travel</option>
          <option>Education</option>
          <option>Tech</option>
          <option>Movies</option>
        </select>

        <button disabled={loading}>
          {loading ? "Uploading..." : "Publish Video"}
        </button>
      </form>
    </div>
  );
}