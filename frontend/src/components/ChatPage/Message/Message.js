import { useSelector } from "react-redux";
import "./Message.css";
import React from "react";
import File from "../ChatBox/ChatBar/FileDownloadTab/File";

const Message = ({ message }) => {
  const userData = useSelector((state) => state.auth.userData);
  const { sender, content, createdAt, uploadedFile } = message;

  const isSentByUser = sender._id == userData._id;
  const messageClassName = isSentByUser ? "sent-by-user" : "sent-by-buddy";
  return (
    <div className={`message ${messageClassName}`}>
      <div className={`name-${messageClassName}`}>{sender.name}</div>
      {uploadedFile?.fileName && <File uploadedFile={uploadedFile} />}
      <div className={`content-${messageClassName}`}>{content}</div>
      <div className={`time-${messageClassName}`}>{new Date(createdAt).toLocaleString()}</div>
    </div>
  );
};

export default Message;
