import React, { useState } from "react";
import "./Header.css";
import Avatar from "../components/Avatar";
import { useUser } from "../context/UserContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useUser();

  //  MOVE HOOK HERE (top)
  const [isDark, setIsDark] = useState(false);

  //  CONDITION AFTER HOOKS
  if (!user) return null;

  const toggleTheme = () => {
    const body = document.body;

    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      setIsDark(false);
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      setIsDark(true);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <div className="header-right">
        <button className="icons-btn" onClick={toggleTheme}>
          <i className={`fa-regular ${isDark ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        <Avatar name={user.name} />
      </div>
    </header>
  );
};

export default Header;
