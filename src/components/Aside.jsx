import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Aside.css";
import Avatar from "../components/Avatar";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";

const Aside = ({ isOpen, closeSidebar }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  /* ================= LOGOUT FUNCTION ================= */
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        // REMOVE JWT TOKEN
        localStorage.removeItem("token");
        // REMOVE USER
        localStorage.removeItem("user");
        // CLEAR CONTEXT
        setUser(null);
        // REDIRECT
        navigate("/");
      }
    });
  };

  /* ================= ADMIN MENU ================= */
  const adminMain = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "fa-solid fa-table-columns",
    },
    { name: "Manage Users", path: "/ManageUsers", icon: "fa-solid fa-users" },
    {
      name: "Manage Agents",
      path: "/ManageAgents",
      icon: "fa-solid fa-user-tie",
    },
    {
      name: "Manage Plots",
      path: "/ManagePlots",
      icon: "fa-solid fa-map-location-dot",
    },
  ];

  const adminOperations = [
    {
      name: "Bookings",
      path: "/Bookings",
      icon: "fa-solid fa-calendar-check",
    },
    // {
    //   name: "Payments",
    //   path: "/Payment",
    //   icon: "fa-solid fa-credit-card",
    // },
  ];

  /* ================= USER MENU ================= */
  const userMain = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "fa-solid fa-table-columns",
    },
    { name: "View Plots", path: "/ViewPlot", icon: "fa-solid fa-map" },
  ];

  const userOperations = [
    {
      name: "My Bookings",
      path: "/MyBookings",
      icon: "fa-solid fa-calendar-check",
    },
    { name: "Profile", path: "/Profile", icon: "fa-solid fa-user" },
  ];

  /* ================= AGENT MENU ================= */
  const agentMain = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "fa-solid fa-table-columns",
    },
    { name: "My Customers", path: "/MyCustomers", icon: "fa-solid fa-users" },
    { name: "Assigned Plots", path: "/AssignedPlot", icon: "fa-solid fa-map" },
  ];

  const agentOperations = [
    {
      name: "Bookings",
      path: "/AgentBookings",
      icon: "fa-solid fa-calendar-check",
    },
  ];

  /* ================= ROLE SWITCH ================= */
  const mainMenu =
    user.role === "admin"
      ? adminMain
      : user.role === "agent"
        ? agentMain
        : userMain;

  const operationsMenu =
    user.role === "admin"
      ? adminOperations
      : user.role === "agent"
        ? agentOperations
        : userOperations;

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : "closed"} ${user.role.toLowerCase()}`}
    >
      {/* CLOSE BUTTON */}
      <div className="close-sidebar" onClick={closeSidebar}>
        <i className="fa-solid fa-xmark"></i>
      </div>
      {/* Logo */}
      <div className="logo">
        <h2>PlotVista</h2>
      </div>

      {/* Profile */}
      <div className="profile">
        <Avatar name={user.name} size={50} />
        <div>
          <p className="name">{user.name}</p>
          <span className="role">{user.role}</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="menu-section">
        <p className="section-title">MAIN</p>
        {mainMenu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className={item.icon}></i>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* OPERATIONS */}
      <div className="menu-section">
        <p className="section-title">OPERATIONS</p>
        {operationsMenu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className={item.icon}></i>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="logout" onClick={handleLogout}>
        <div className="menu-item">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Log out</span>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
