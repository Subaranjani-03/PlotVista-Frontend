import React, { useState } from "react";
import Header from "./Header";
import Aside from "./Aside";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`layout ${isSidebarOpen ? "" : "collapsed"}`}>
      <Aside />
      <div className="main-area">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;