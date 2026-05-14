import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";
import { apiRequest } from "../api/api";

const Register = () => {
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const addressRef = useRef(null);

  const navigate = useNavigate();

  // FIX: make function async
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      address: addressRef.current.value,
    };

    console.log("Registered:", userData);

    try {
      const data = await apiRequest("/register", "POST", userData);

      if (data.status) {
        // Success Alert
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created",
          timer: 1000,
          showConfirmButton: false,
        });

        // Navigate to login
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Cannot connect to backend",
      });

      console.error(error);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-panel">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-brand">
            Plot<span>Vista</span>
          </div>

          <div className="auth-tagline">
            <h2>
              Book Plot <br />
              in <em>seconds.</em>
            </h2>
            <p>Manage plots, bookings, and payments quickly and easily.</p>
          </div>

          <div className="auth-dots">
            <div className="auth-dot active" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-heading">
            <p>Step 1 of 1</p>
            <h3>Create account</h3>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">Name</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="e.g. Suba"
                  ref={nameRef}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Phone Number</label>
                <input
                  className="auth-input"
                  type="tel"
                  placeholder="e.g. 1234567890"
                  ref={phoneRef}
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="e.g. suba@gmail.com"
                  ref={emailRef}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="••••••••"
                  ref={passwordRef}
                  required
                />
              </div>
            </div>

            {/* Full width field */}
            <div className="auth-field">
              <label className="auth-label">Address</label>
              <textarea
                className="auth-input"
                placeholder="Enter your address"
                ref={addressRef}
                rows="3"
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Create account
            </button>
          </form>

          <div className="auth-footer">
            Already registered?{" "}
            <Link to="/" className="auth-footer-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
