import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { useUser } from "../context/UserContext";
import { apiRequest } from "../api/api";
import "./Dashboard.css";

/* Import images */
import dashImage from "../assets/dashImage.png";

const Dashboard = () => {
  const { user } = useUser();

  /* ================= STATES ================= */

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalPlots: 0,
    totalBookings: 0,
  });

  const [agentStats, setAgentStats] = useState({
    totalCustomers: 0,
    pendingVisits: 0,
    completedVisits: 0,
    totalBookings: 0,
  });

  const [userStats, setUserStats] = useState({
    availablePlots: 0,
    myBookings: 0,
    siteVisited: 0,
    paymentCompleted: 0,
  });

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchDashboardStats();

    if (user?.role?.toLowerCase() === "agent") {
      fetchAgentStats();
    }

    if (user?.role?.toLowerCase() === "user") {
      fetchUserStats();
    }
  }, [user]);

  /* ================= ADMIN STATS ================= */

  const fetchDashboardStats = async () => {
    try {
      const usersRes = await apiRequest("/users");

      const plotsRes = await apiRequest("/plots");

      const bookingsRes = await apiRequest("/bookings");

      if (usersRes.status && plotsRes.status && bookingsRes.status) {
        const users = usersRes.data || [];

        setStats({
          totalUsers: users.filter((u) => u.role === "user").length,

          totalAgents: users.filter((u) => u.role === "agent").length,

          totalPlots: plotsRes.data.length,

          totalBookings: bookingsRes.data.length,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= AGENT STATS ================= */
  const fetchAgentStats = async () => {
    try {
      const bookingRes = await apiRequest(`/bookings/agent/${user._id}`);
      const customerRes = await apiRequest(`/agent-customers/${user._id}`);

      if (bookingRes.status && customerRes.status) {
        const bookings = bookingRes.data || [];

        const normalize = (v) => (v || "").toLowerCase().trim();

        const pendingVisits = bookings.filter(
          (b) => normalize(b.visitStatus) === "pending",
        ).length;

        const completedVisits = bookings.filter(
          (b) =>
            normalize(b.visitStatus) === "visited" ||
            normalize(b.visitStatus) === "completed",
        ).length;

        setAgentStats({
          totalCustomers: customerRes.data.length,
          pendingVisits,
          completedVisits,
          totalBookings: bookings.length,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= USER STATS ================= */

  const fetchUserStats = async () => {
    try {
      // ALL PLOTS
      const plotsRes = await apiRequest("/plots");

      // USER BOOKINGS
      const bookingRes = await apiRequest(`/bookings/my-bookings/${user._id}`);

      if (plotsRes.status && bookingRes.status) {
        const bookings = bookingRes.data || [];

        setUserStats({
          availablePlots: plotsRes.data.length,

          myBookings: bookings.length,

          siteVisited: bookings.filter(
            (b) => b.visitStatus?.toLowerCase() === "visited",
          ).length,

          paymentCompleted: bookings.filter(
            (b) => b.paymentStatus?.toLowerCase() === "paid",
          ).length,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADMIN CARDS ================= */

  const adminCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "fa-solid fa-users",
      color: "#f59e0b",
      link: "/ManageUsers",
    },
    {
      title: "Total Agents",
      value: stats.totalAgents,
      icon: "fa-solid fa-user-tie",
      color: "#0ea5e9",
      link: "/ManageAgents",
    },
    {
      title: "Total Plots",
      value: stats.totalPlots,
      icon: "fa-solid fa-map",
      color: "#22c55e",
      link: "/ManagePlots",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: "fa-solid fa-calendar-check",
      color: "#6366f1",
      link: "/Bookings",
    },
  ];

  /* ================= AGENT CARDS ================= */

  const agentCards = [
    {
      title: "Total Customers",
      value: agentStats.totalCustomers,
      icon: "fa-solid fa-users",
      color: "#f59e0b",
      link: "/MyCustomers",
    },
    {
      title: "Pending Visits",
      value: agentStats.pendingVisits,
      icon: "fa-solid fa-clock",
      color: "#6366f1",
      link: "/AgentBookings",
    },
    {
      title: "Completed Visits",
      value: agentStats.completedVisits,
      icon: "fa-solid fa-circle-check",
      color: "#22c55e",
      link: "/AgentBookings",
    },
    {
      title: "Total Bookings",
      value: agentStats.totalBookings,
      icon: "fa-solid fa-calendar-check",
      color: "#0ea5e9",
      link: "/AgentBookings",
    },
  ];
  /* ================= USER CARDS ================= */

  const userCards = [
    {
      title: "Available Plots",
      value: userStats.availablePlots,
      icon: "fa-solid fa-map-location-dot",
      color: "#22c55e",
      link: "/ViewPlot",
    },
    {
      title: "My Booking",
      value: userStats.myBookings,
      icon: "fa-solid fa-bookmark",
      color: "#6366f1",
      link: "/MyBookings",
    },
    {
      title: "Site Visited",
      value: userStats.siteVisited,
      icon: "fa-solid fa-location-dot",
      color: "#f59e0b",
      link: "/MyBookings",
    },
    {
      title: "Payment Completed",
      value: userStats.paymentCompleted,
      icon: "fa-solid fa-credit-card",
      color: "#0ea5e9",
      link: "/MyBookings",
    },
  ];

  /* ================= ROLE BASED ================= */

  const role = user?.role?.toLowerCase()?.trim();

  let cards = userCards;

  if (role === "admin") {
    cards = adminCards;
  } else if (role === "agent") {
    cards = agentCards;
  }

  return (
    <div className="dashboard">
      {/* ================= ROW 1 ================= */}

      <div className="card-grid">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            link={card.link}
          />
        ))}
      </div>

      {/* ================= ROW 2 ================= */}

      <div className="dashboard-row">
        <div className="image-container">
          <img src={dashImage} alt="Dashboard" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
