import React from "react";
import "./Footer.css";

import footerLogo from "../assets/plotvista-icon.png"; // change filename if needed

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      
      <div className="footer-left">
        <img
          src={footerLogo}
          alt="PlotVista Logo"
          className="footer-logo"
        />

        <span className="footer-title">
          PlotVista
        </span>
      </div>

      <span className="footer-right">
        © {currentYear} | All rights reserved
      </span>

    </footer>
  );
};

export default Footer;