import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser(email, password);

      if (!result.ok) {
        setIsError(true);
        setMessage(result.data.message || "Login failed");
        return;
      }

      // token aur user save karo
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      setIsError(false);
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (err) {
      setIsError(true);
      setMessage("Server se connect nahi ho paya");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="logo">
          Auth<span>Service</span>
        </h1>
        <p className="subtitle">Simple login and register system</p>

        <form onSubmit={handleSubmit} className="form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className={"message " + (isError ? "error" : "success")}>
              {message}
            </p>
          )}
        </form>

        <p className="switch-text">
          Account nahi hai? <Link to="/register">Register karein</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;