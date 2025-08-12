import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let user = localStorage.getItem("user");

    if (user) {
        user = JSON.parse(user);
    }


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    
  return (
    <div className="navbar bg-slate-800 px-8 py-4 shadow-md">
  <div className="flex-1">
    <Link to="/" className="text-white font-semibold text-2xl tracking-wide">
      Ticket AI
    </Link>
  </div>
  <div className="flex gap-12 items-center">
    {!token ? (
      <>
        <Link
          to="/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
        >
          Signup
        </Link>
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
        >
          Login
        </Link>
      </>
    ) : (
      <>
        <p className="text-gray-200 font-medium text-lg">
          Hi, {user && user?.role !== 'user' ? user?.role : user?.email}
        </p>

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
          >
            Admin Panel
          </Link>
        )}

        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
        >
          Home
        </Link>

        {user?.role !== 'user' && (
          <Link
            to="/profile"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
          >
            Profile
          </Link>
        )}

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
        >
          Logout
        </button>
      </>
    )}
  </div>
</div>

  );
}