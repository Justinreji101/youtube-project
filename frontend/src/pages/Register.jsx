import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    channelName: "",
    email: "",
    password: ""
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

      const res = await api.post("/auth/register", form);

      localStorage.setItem("yt_token", res.data.token);
      localStorage.setItem("yt_user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="play-logo big">▶</span>

        <h1>Create channel</h1>
        <p>Start your creative video journey.</p>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={update}
        />

        <input
          name="channelName"
          placeholder="Channel name"
          value={form.channelName}
          onChange={update}
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={update}
        />

        <button disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="auth-link">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}