import React from "react";
import { Link } from "react-router-dom";
import "./StatCard.css";

const StatCard = ({ title, value, icon, color, link }) => {
  return (
    <div className="stat-card">
      {/* Top Section */}
      <div className="stat-top">
        <div className="stat-icon" style={{ background: color }}>
          <i className={icon}></i>
        </div>

        <div className="stat-info">
          <h3>{value}</h3>
          <p>{title}</p>
        </div>
      </div>

      {/* Bottom Section */}
      <Link to={link} className="visit-link">
        View
        <i className="fa-solid fa-arrow-right arrow-icon"></i>
      </Link>
    </div>
  );
};

export default StatCard;