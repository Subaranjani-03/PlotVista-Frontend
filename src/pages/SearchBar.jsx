import React from "react";
import "./SearchBar.css";

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-bar">
      <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;