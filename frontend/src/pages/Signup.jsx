import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Signup - something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
  <Navbar />
  <div className="flex-1 flex items-center justify-center px-4">
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
      <form
        onSubmit={handleSignup}
        autoComplete="off"
        className="flex flex-col items-center gap-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="off"
          className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="form-control mt-4 w-full">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-md font-medium transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        <h4 className="text-lg text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </h4>
      </form>
    </div>
  </div>
</div>

  );
}

export default Signup;
