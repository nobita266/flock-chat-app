import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import { getAllChats, getUserData } from "helpers/selectors";
import {socket} from "components/../socket.js"
import "./Header.css";
import Button from "components/Button/Button";
import { persistor } from "index";

const Header = ({ setShowSideDrawer, updateSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const userData = useSelector(getUserData);
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const allChats = useSelector(getAllChats)

  const handleLogout = () => {
    socket.emit("logout",{userData,allChats});
    persistor.purge();
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setShowSideDrawer(true);
    updateSearch(search);
  };

  return (
    <div className="header">
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search people or rooms"
          onChange={handleSearch}
          value={search}
        />
        <Button type="submit" text="Search" />
      </form>
      <div className="profile-dropdown">
        <Button
          type="click"
          text={userData.name}
          onClickEvent={handleToggleDropdown}
        />
        {showDropdown && (
          <div className="dropdown-content">
            <button className="settings-btn">Settings</button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
