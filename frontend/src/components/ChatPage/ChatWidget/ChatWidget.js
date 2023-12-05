import { useDispatch, useSelector } from "react-redux";
import { addToAllChats, setSelectedChat } from "store/slices/chatSlice";
import { accessChat, accessRoom } from "api/chat";
import { getAccessToken, getAllChats } from "helpers/selectors";

import "./ChatWidget.css";

const ChatWidget = ({ chatItem, isClickable }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(getAccessToken);
  const allChats = useSelector(getAllChats);

  const handleClick = async () => {
    if (!isClickable) {
      return;
    }
    if (!chatItem.isGroupChat) {
      await accessChat({ accessToken, recieverUserId: chatItem._id })
        .then(async (res) => {
          const { chat } = await res.json();
          dispatch(setSelectedChat(chat));
          const newChat = allChats.find(
            (currChat) => currChat._id === chat._id
          );
          if (!newChat) {
            dispatch(addToAllChats(chat));
          }
        })
        .catch((err) => alert(err));
    }
    if (chatItem.isGroupChat) {
      await accessRoom({ accessToken, roomName: chatItem.chatName })
        .then(async (res) => {
          const response = await res.json();
          dispatch(setSelectedChat(response));
          const newChat = allChats.find((chat) => chat._id == response._id);
          if (!newChat) {
            dispatch(addToAllChats(response));
          }
        })
        .catch((err) => alert(err));
    }
  };
  return (
    <>
      <button className="clickable-tab" onClick={handleClick}>
        <div className="primary-text">
          {chatItem.isGroupChat ? chatItem.chatName : chatItem.name}
        </div>
        <div className="secondary-text">
          {chatItem.isGroupChat ? "ROOM" : chatItem.email}
        </div>
      </button>
    </>
  );
};

export default ChatWidget;
