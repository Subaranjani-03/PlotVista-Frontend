import React from "react";
import "./Avatar.css";

const Avatar = ({ name = "", size = 42 }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size / 2.5
      }}
      title={name}
    >
      {initial}
    </div>
  );
};

export default Avatar;