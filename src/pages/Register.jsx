import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";

function Register() {
  const [name, setName] = useState("");
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
      const result = await registerUser(name, email, password);

      if (!result.ok) {
        setIsError(true);
        setMessage(result.data.message || "Register failed");
        return;
      }

      setIsError(false);
      setMessage("Account created! Login page pe le ja rahe hain...");

      setTimeout(() => {
        navigate("/");
      }, 1200);
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
        <p className="subtitle">Naya account banayein</p>

        <form onSubmit={handleSubmit} className="form">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Ali Khan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && (
            <p className={"message " + (isError ? "error" : "success")}>
              {message}
            </p>
          )}
        </form>

        <p className="switch-text">
          Pehle se account hai? <Link to="/">Login karein</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;