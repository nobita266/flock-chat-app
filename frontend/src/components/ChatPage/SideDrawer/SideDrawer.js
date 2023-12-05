import React, { useEffect, useState } from "react";

import "./SideDrawer.css";
import ChatWidget from "components/ChatPage/ChatWidget/ChatWidget";
import { Loader } from "utils/Loader/Loader";
import { useSelector } from "react-redux";
import { getAccessToken } from "helpers/selectors";
import { searchUsers } from "api/user";
import { searchRooms } from "api/chat";

const SideDrawer = ({ showSideDrawer, toggleSideDrawer, search }) => {
  const [searchedChatsAndUsers, setSearchedChatsAndUsers] = useState();
  const accessToken = useSelector(getAccessToken);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    if (showSideDrawer) {
      const getSearchedChatsAndUsers = async () => {
        setIsLoading(true)
        let searchResults = [];
        await searchUsers({ accessToken, search })
          .then(async (res) => {
            const searchResult = await res.json();
            searchResults = [...searchResults, ...searchResult];
          })
          .catch((err) => alert(err));

        await searchRooms({ accessToken, search })
          .then(async (res) => {
            const searchResult = await res.json();
            searchResults = [...searchResults, ...searchResult];
          })
          .catch((err) => alert(err));

        setSearchedChatsAndUsers(searchResults);
        setIsLoading(false)
      };
      getSearchedChatsAndUsers();
    }
  }, [search]);

  return (
    <div className={`side-drawer ${showSideDrawer ? "open" : ""}`}>
      <div className="header">
        {searchedChatsAndUsers && <h3>People And Rooms</h3>}
        <button className="close-btn" onClick={toggleSideDrawer}>
          &times;
        </button>
      </div>
      {isLoading && <Loader />}
      <div className="search-result-list">
        {searchedChatsAndUsers &&
          searchedChatsAndUsers.map((searchItem) => (
            <ChatWidget
              chatItem={searchItem}
              key={searchItem._id}
              isClickable={true}
            />
          ))}
      </div>

    </div>
  );
};

export default SideDrawer;
