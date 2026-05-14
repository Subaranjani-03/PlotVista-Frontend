import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Footer from "./Footer";
import ManagePlot from "../admin-menus/ManagePlot";
import ViewPlot from "../user-menus/ViewPlot";
import AssignedPlot from "../agent-menus/AssignedPlot";
import ManageUser from "../admin-menus/ManageUser";
import ManageAgent from "../admin-menus/ManageAgent";
import MyCustomer from "../agent-menus/MyCustomer";
import Profile from "../user-menus/Profile";
import MyBookings from "../user-menus/MyBookings";
import Bookings from "../admin-menus/Bookings";
import AgentBookings from "../agent-menus/AgentBookings";

const Main = () => {
  return (
    <main>
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* admin */}
          <Route path="/ManagePlots" element={<ManagePlot />} />
          <Route path="/ManageUsers" element={<ManageUser />} />
          <Route path="/ManageAgents" element={<ManageAgent />} />
          <Route path="/Bookings" element={<Bookings />} />

          {/* agent */}
          <Route path="/AssignedPlot" element={<AssignedPlot />} />
          <Route path="/MyCustomers" element={<MyCustomer />} />
          <Route path="/AgentBookings" element={<AgentBookings />} />

          {/* user */}
          <Route path="/ViewPlot" element={<ViewPlot />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/MyBookings" element={<MyBookings />} />
        </Routes>
      </div>

      <Footer />
    </main>
  );
};

export default Main;
