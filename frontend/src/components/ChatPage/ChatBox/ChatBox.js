import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "components/../socket";
import { fetchAllMessages } from "api/message";
import Message from "components/ChatPage/Message/Message";

import SelectChatOrRoomSvg from "utils/SelectChatOrRoomSvg";
import {
  getAccessToken,
  getNotificationState,
  getSelectedChat,
  getUserData,
} from "helpers/selectors";

import "./ChatBox.css";
import ChatHeader from "./ChatHeader/ChatHeader";
import ChatBar from "./ChatBar/ChatBar";
import {
  setLatestMessageDirectory,
  setNotificationState,
} from "store/slices/chatSlice";
import { setToast } from "store/slices/toastSlice";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const selectedChat = useSelector(getSelectedChat);
  const accessToken = useSelector(getAccessToken);
  const userData = useSelector(getUserData);
  const messageScrollRef = useRef(null);
  const dispatch = useDispatch();
  const notificationState = useSelector(getNotificationState);

  useEffect(() => {
    const polulateMessages = async () => {
      await fetchAllMessages({
        id: selectedChat?._id,
        accessToken,
      })
        .then(async (res) => {
          if (res.ok) {
            const { messages } = await res.json();
            setMessages(messages);
            dispatch(
              setNotificationState({
                [selectedChat._id]: 0,
              })
            );
          }
        })
        .catch((error) =>
          dispatch(
            setToast({
              status: "failure",
              displayMessage: JSON.stringify(error),
            })
          )
        );
    };
    if (selectedChat) {
      polulateMessages();
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat, accessToken]);

  useEffect(() => {
    const onMessageRecieved = (newMessageRecieved) => {
      const { _id: selectedChatId = "" } = selectedChat || {};
      const {
        chat: { _id: currentMessageChatId },
      } = newMessageRecieved;

      const isMessageFromNonSelectedChat =
        !selectedChat || selectedChatId !== currentMessageChatId;

      if (isMessageFromNonSelectedChat) {
        const nonSelectedChatNotificationCount =
          notificationState[currentMessageChatId] || 0;
        dispatch(
          setNotificationState({
            [currentMessageChatId]: nonSelectedChatNotificationCount + 1,
          })
        );
      } else if (selectedChatId === currentMessageChatId) {
        setMessages([...messages, newMessageRecieved]);
      }
      dispatch(
        setLatestMessageDirectory({
          [currentMessageChatId]: newMessageRecieved.uploadedFile
            ? "attachment"
            : newMessageRecieved.content,
        })
      );
    };
    socket.on("message recieved", onMessageRecieved);

    return () => socket.off("message recieved", onMessageRecieved);
  });

  useEffect(() => {
    messageScrollRef.current?.scrollIntoView();
  });

  return (
    <div className="chat-box-container">
      {selectedChat ? (
        <>
          <div className="chat-box-header">
            <ChatHeader />
          </div>
          <div className="messages">
            {messages.map((message) => (
              <Message message={message} key={message._id} />
            ))}
            <div ref={messageScrollRef}></div>
          </div>
          <ChatBar messages={messages} setMessages={setMessages} />
        </>
      ) : (
        <SelectChatOrRoomSvg />
      )}
    </div>
  );
};

export default React.memo(ChatBox);
