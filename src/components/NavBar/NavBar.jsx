import React from "react";
import { FaUser, FaReceipt, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ background: "black" }}>
      <div className="container d-flex align-items-center">

        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center fs-6 fw-light" to="/AllCustomer" style={{ color: "#fff" }}>
          <span style={{ color: "red" }}>Work</span>-Panel
        </Link>

        {/* Toggler Button for Mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav text-center gap-3">
            <li className="nav-item">
              <Link to="/AllCustomer" className="nav-link text-white fw-light d-flex align-items-center fs-6" style={{ transition: "0.3s" }}>
                <FaUser className="me-1" /> <small>Customer</small>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Receipts" className="nav-link text-white fw-light d-flex align-items-center fs-6" style={{ transition: "0.3s" }}>
                <FaReceipt className="me-1" /> <small>Receipts</small>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Expenses" className="nav-link text-white fw-light d-flex align-items-center fs-6" style={{ transition: "0.3s" }}>
                <FaMoneyBill className="me-1" /> <small>Expenses</small>
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn d-flex align-items-center fw-light fs-6"
                style={{
                  backgroundColor: "crimson",
                  border: "none",
                  color: "white",
                  padding: "4px 10px",
                  transition: "0.3s",
                }}
              >
                <FaSignOutAlt className="me-1" /> <small>Logout</small>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
