import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import "./Auth.css";
import { apiRequest } from "../api/api";

const Login = () => {
  const { setUser } = useUser();

  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      phone: phoneRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    try {
      const data = await apiRequest("/login", "POST", userData);

      if (data.status) {

        // ✅ SAVE JWT TOKEN
        localStorage.setItem("token", data.token);

        // ✅ SAVE USER
        setUser(data.data);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to PlotVista",
          timer: 1000,
          showConfirmButton: false,
        });

        setTimeout(() => {

          const role = data.data.role;

          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "agent") {
            navigate("/dashboard");
          } else {
            navigate("/dashboard");
          }

        }, 1000);

      } else {

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message,
        });

      }

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Cannot connect to backend",
      });

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
              Welcome back <br />
              to <em>PlotVista.</em>
            </h2>

            <p>
              Manage plots, bookings, and payments in one place.
            </p>
          </div>

          <div className="auth-dots">
            <div className="auth-dot active" />
          </div>

        </div>

        {/* RIGHT */}
        <div className="auth-right">

          <div className="auth-heading">
            <p>Secure access</p>
            <h3>Login Here</h3>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="auth-field">
              <label className="auth-label">
                Phone Number
              </label>

              <input
                className="auth-input"
                type="tel"
                placeholder="e.g. 9999999999"
                ref={phoneRef}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Password
              </label>

              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                ref={passwordRef}
                required
              />
            </div>

            <div className="auth-field">

              <label className="auth-label">
                Role
              </label>

              <select
                className="auth-select"
                ref={roleRef}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="admin">
                  Administrator
                </option>

                <option value="agent">
                  Agent
                </option>

                <option value="user">
                  User
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="auth-btn"
            >
              Login
            </button>

          </form>

          <div className="auth-footer">
            Not registered?{" "}

            <Link
              to="/Register"
              className="auth-footer-link"
            >
              Create account
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;