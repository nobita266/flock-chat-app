import { useSelector } from "react-redux";
import "./OnlineWatermark.css";
import { getOnlineUsers, getUserData } from "helpers/selectors";

const OnlineWatermark = ({ chat }) => {
  const onlineUsers = useSelector(getOnlineUsers);
  const userData = useSelector(getUserData);
  const isUserOnline = () => {
    const { isGroupChat } = chat;
    if (!isGroupChat) {
      const { users } = chat;
      const friend = users.find(({ _id }) => _id !== userData._id);
      if (onlineUsers.includes(friend._id)) {
        return true;
      }
    }
    return false;
  };
  if (!isUserOnline()) {
    return "";
  }
  return (
    <div className="watermark">
      <span className="watermark-text">Online</span>
    </div>
  );
};

export default OnlineWatermark;
