import ChatWidget from "components/ChatPage/ChatWidget/ChatWidget";
import { useEffect, useState } from "react";
import "./RoomDropdown.css"
import { getSelectedChat, getUserData } from "helpers/selectors";
import { useSelector } from "react-redux";

export const RoomDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const userData = useSelector(getUserData);
  const {users,_id:chatId } = useSelector(getSelectedChat);

  useEffect(() => {
    setShowDropdown(false);
  }, [chatId]);

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <div className="dots"></div>
        <div className="dots"></div>
        <div className="dots"></div>
      </button>
      {showDropdown && (
        <ul className="dropdown-list">
          {users.map((user, index) => (
            <ChatWidget
              isClickable={user._id == userData._id ? false : true}
              chatItem={user}
              key={user._id}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
