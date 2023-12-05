import { createPortal } from "react-dom";
import "./Modal.css";
import { createRoom } from "api/chat";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "helpers/selectors";
import { addToAllChats } from "store/slices/chatSlice";
import Button from "components/Button/Button";

const defaultRoomStatus = {
  showRoomStatus: false,
  created: false,
  msg: "",
};

export const Modal = ({ toggleModal }) => {
  const [roomName, setRoomName] = useState("");
  const accessToken = useSelector(getAccessToken);
  const [roomStatus, setRoomStatus] = useState(defaultRoomStatus);
  const dispatch = useDispatch();
  const handleClick = () => {
    toggleModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createRoom({ accessToken, roomName })
      .then(async (res) => {
        if (res.ok) {
          const { createdRoom } = await res.json();
          dispatch(addToAllChats(createdRoom));
          setRoomStatus({
            showRoomStatus: true,
            created: true,
            msg: "Room has been successfully created",
          });
          setRoomName("");
          return;
        } else if (!res.ok) {
          const { msg } = await res.json();
          setRoomStatus({
            showRoomStatus: true,
            created: false,
            msg: msg,
          });
        }
        setTimeout(() => {
          setRoomStatus(defaultRoomStatus);
        }, 3000);
      })
      .catch((err) => alert(err));
  };

  const handleRoomName = (e) => {
    setRoomName(e.target.value);
  };

  const getModalStatusClassName = () => {
    const { created, showRoomStatus } = roomStatus;
    let className = "";
    if (created) {
      className += "success-message";
    } else {
      className += "failed-message";
    }
    if (showRoomStatus) {
      className += " active";
    }
    return className;
  };

  return createPortal(
    <>
      <div className="modal-container">
        <div className="modal-background" id="modalBackground">
          <div className="modal" id="modal">
            <div className="modal-content">
              <span
                className="close-btn"
                id="closeModalBtn"
                onClick={handleClick}
              >
                &times;
              </span>
              <form id="roomForm" onSubmit={handleSubmit}>
                <label htmlFor="roomName">Room Name:</label>
                <input
                  type="text"
                  id="roomName"
                  name="roomName"
                  placeholder="Enter room name"
                  required
                  value={roomName}
                  onChange={handleRoomName}
                />
                <Button type="submit" text="Submit" />
              </form>
              <br></br>
              {
                <div className={getModalStatusClassName()}>
                  {roomStatus.msg}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>,
    document.querySelector(".portalModal")
  );
};
