import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "components/ChatPage/Header/Header";
import ChatBox from "components/ChatPage/ChatBox/ChatBox";
import SideDrawer from "components/ChatPage/SideDrawer/SideDrawer";
import UnauthorizedPage from "pages/unauthorizedPage/UnauthorizedPage";

import { getAccessToken, getOnlineUsers, getUserData } from "helpers/selectors";

import { Loader } from "utils/Loader/Loader";

import { socket } from "components/../socket.js";
import { setOffline, setOnline } from "store/slices/chatSlice";

import "./ChatPage.css";

const ChatsList = React.lazy(() =>
  import("components/ChatPage/ChatsList/ChatsList")
);

const ChatPage = () => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const accessToken = useSelector(getAccessToken);
  const [search, setSearch] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const userData = useSelector(getUserData)

  const dispatch = useDispatch();
  const toggleSideDrawer = () => {
    setShowSideDrawer((prev) => !prev);
  };
  const onlineUsers = useSelector(getOnlineUsers);

  const updateSearch = (search) => {
    setSearch(search);
  };
  
  useEffect(() => {
    const onConnect = () => setSocketConnected(true);
    socket.emit("setup", userData);

    socket.on("connected", onConnect);

    return () => {
      socket.off("connected", onConnect);
    };
  }, [userData]);


  useEffect(() => {
    const onSetUserOnline = (userId) => {
      if(onlineUsers.includes(userId)===false){
        dispatch(setOnline({userId}));
      }
    };
    const onSetUserOffline = (userId) => {
      dispatch(setOffline({userId}));
    };
    socket.on("setUserOnline", onSetUserOnline);
    socket.on("setUserOffline", onSetUserOffline);

    return () => {
      socket.off("setUserOnline", onSetUserOnline);
      socket.off("setUserOffline", onSetUserOffline);
    };
  });
  if (accessToken) {
    return (
      <div className="chat-page">
        <Header
          setShowSideDrawer={setShowSideDrawer}
          updateSearch={updateSearch}
        />
        <div className="chat-container ">
          <div className="friends-list">
            <Suspense fallback={<Loader />}>
              <ChatsList />
            </Suspense>
          </div>
          <div className="chat-box">
            <ChatBox />
          </div>
        </div>
        {
          <SideDrawer
            showSideDrawer={showSideDrawer}
            toggleSideDrawer={toggleSideDrawer}
            search={search}
          />
        }
      </div>
    );
  }
  return <UnauthorizedPage />;
};

export default ChatPage;
