import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Aside from "./components/Aside";
import Main from "./components/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/Register" element={<Register />} />

      <Route
        path="/*"
        element={
          <div className={`wrapper ${isSidebarOpen ? "" : "collapsed"}`}>
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Aside
              isOpen={isSidebarOpen}
              closeSidebar={() => setIsSidebarOpen(false)}
            />
            <Main />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
