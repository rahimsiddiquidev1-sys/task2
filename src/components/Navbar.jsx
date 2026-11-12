    import { useNavigate } from "react-router-dom";

    function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <nav className="navbar">
        <h2 className="navbar-logo">
            Auth<span>Service</span>
        </h2>

        <div className="navbar-right">
            {user && <p className="navbar-user">Hi, {user.name}</p>}
            <button className="btn btn-small btn-danger" onClick={handleLogout}>
            Logout
            </button>
        </div>
        </nav>
    );
    }

    export default Navbar;