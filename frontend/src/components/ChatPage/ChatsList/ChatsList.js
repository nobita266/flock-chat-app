import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Chat from "components/ChatPage/ChatsList/Chat/Chat";
import { setAllChats } from "store/slices/chatSlice";
import { fetchChats } from "api/chat";

import { Modal } from "utils/ModalComponent/Modal";
import { getAccessToken, getAllChats, getUserData } from "helpers/selectors";
import { socket } from "components/../socket.js";
import "./ChatList.css";
import Button from "components/Button/Button";

const ChatsList = () => {
  const accessToken = useSelector(getAccessToken);
  const userData = useSelector(getUserData);
  const allChats = useSelector(getAllChats);
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [oneOnOnechats, setOneOnOneChats] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const getChats = async () => {
      await fetchChats(accessToken)
        .then(async (res) => {
          const response = await res.json();
          dispatch(setAllChats(response));
          socket.emit("login", { userData, allChats: response });
        })
        .catch((err) => alert(err));
    };
    getChats();
  }, [accessToken, userData, dispatch]);

  useEffect(() => {
    let oneOnOnechatsList = [];
    let roomsList = [];
    allChats.forEach((chat) => {
      if (!chat.isGroupChat) {
        oneOnOnechatsList = [
          ...oneOnOnechatsList,
          <Chat chat={chat} key={chat._id} />,
        ];
      } else {
        roomsList = [...roomsList, <Chat chat={chat} key={chat._id} />];
      }
    });
    setOneOnOneChats(oneOnOnechatsList);
    setRooms(roomsList);
  }, [allChats]);

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };
  return (
    <div className="chats-list-container">
      {isOpenModal && <Modal toggleModal={toggleModal} />}

      <div className="room-list-header">
        <div className="chat-list-topic">ROOMS</div>
        <Button type="click" onClickEvent={toggleModal} text="Create a room" />
      </div>
      <br></br>
      <div className="chats-list-section">{rooms}</div>
      <br></br>
      <div className="chat-list-topic">Chats List</div>
      <div className="chats-list-section">{oneOnOnechats}</div>
    </div>
  );
};

export default ChatsList;
