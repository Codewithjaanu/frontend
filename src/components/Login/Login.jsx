import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPerson = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ UserId: "", Password: "" });
  const nav = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Register API Call
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("User registered successfully! 🎉", { autoClose: 2000 });
        setActiveTab("login"); // Switch to login tab after registration
      } else {
        toast.error(data.message || "Registration failed!", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!", { autoClose: 2000 });
    }
  };

  // Handle Login API Call
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { autoClose: 2000 });
        localStorage.setItem('token', data.token);
        nav('/AllCustomer')
      } else {
        toast.error(data.message || "Invalid UserId or Password!", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!", { autoClose: 2000 });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <ToastContainer position="top-right" theme="dark" /> {/* ✅ Add this to render toasts */}
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item w-50 text-center">
            <button
              className={`nav-link ${activeTab === "login" ? "active" : ""} w-100`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
          </li>
          <li className="nav-item w-50 text-center">
            <button
              className={`nav-link ${activeTab === "signup" ? "active" : ""} w-100`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </li>
        </ul>

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter User ID"
                name="UserId"
                value={formData.UserId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter User ID"
                name="UserId"
                value={formData.UserId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100">Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export { LoginPerson };
