import React, { useCallback, useMemo } from "react";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import OnlineWatermark from "components/OnlineWatermark/OnlineWatermark";
import {
  getLatestMessageDirectory,
  getNotificationState,
  getSelectedChat,
  getUserData,
} from "helpers/selectors";
import { setSelectedChat } from "store/slices/chatSlice";

const Chat = ({ chat = {}, notification }) => {
  const userData = useSelector(getUserData);
  const dispatch = useDispatch();
  const selectedChat = useSelector(getSelectedChat);
  const notificationState = useSelector(getNotificationState);
  const latestMessageDirectory = useSelector(getLatestMessageDirectory) || {};

  const handleClick = () => {
    dispatch(setSelectedChat(chat));
  };

  const { name, email } = useMemo(() => {
    const { isGroupChat } = chat;
    if (isGroupChat) {
      const { chatName } = chat;
      return { name: chatName, secondaryText: "" };
    }
    const { users } = chat;
    const friend = users.find(({ _id }) => _id !== userData._id);
    return {
      name: friend?.name,
      email: friend?.email,
    };
  }, [chat]);

  const getLatestMessageDisplay = useCallback(() => {
    console.log(chat)
    let latestMessage = chat.latestMessage?.content;

    if (latestMessageDirectory[chat._id]) {
      latestMessage = latestMessageDirectory[chat._id];
    }
    if (typeof latestMessage === "string" && latestMessage.length > 21) {
      latestMessage = latestMessage.substring(0, 21) + "...";
    }
    return latestMessage;
  }, [latestMessageDirectory[chat?._id]]);

  return (
    <button
      className={`clickable-tab${
        selectedChat && selectedChat._id === chat._id ? "-selectedChat" : ""
      }`}
      onClick={handleClick}
    >
      <div className="primary-text">{email ? email : name}</div>
      <div className="interactionContainer">
        {<OnlineWatermark chat={chat} />}
        <div className="secondary-text">{getLatestMessageDisplay()}</div>
        {notificationState[chat._id] > 0 && (
          <div className="notification">{notificationState[chat._id]}</div>
        )}
      </div>
    </button>
  );
};

export default Chat;
