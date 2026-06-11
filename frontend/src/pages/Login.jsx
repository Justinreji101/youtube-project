import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

      const res = await api.post("/auth/login", form);

      localStorage.setItem("yt_token", res.data.token);
      localStorage.setItem("yt_user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="play-logo big">▶</span>

        <h1>Welcome back</h1>
        <p>Login to continue your Youtube-project channel.</p>

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-link">
          New creator? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}