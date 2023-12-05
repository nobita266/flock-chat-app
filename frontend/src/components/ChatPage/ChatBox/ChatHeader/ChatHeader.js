import React, { useEffect, useState } from "react";
import "./ChatHeader.css"; // Import the CSS file
import { useSelector } from "react-redux";
import { getSelectedChat, getUserData } from "helpers/selectors";
import ChatWidget from "components/ChatPage/ChatWidget/ChatWidget";
import { RoomDropdown } from "components/Dropdown/RoomDropdown";

const ChatHeader = () => {
  const { isGroupChat, chatName, users } = useSelector(getSelectedChat);
  const userData = useSelector(getUserData);

  const getChatName = () => {
    if (isGroupChat) {
      return chatName;
    }
    return users?.find((user) => user._id !== userData._id)?.name || "";
  };

  return (
    <header className="chat-header">
      <h2>{getChatName()}</h2>

      {isGroupChat && <RoomDropdown />}
    </header>
  );
};

export default ChatHeader;
