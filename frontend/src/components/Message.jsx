import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import botIcon from "../assets/chatbot.png";
const Message = ({ sender, text }) => (
  <div className="message">
    {sender === "bot" ? (
      <img className="bot-icon" src={botIcon} alt="bot" />
    ) : (
      <PersonIcon></PersonIcon>
    )}

    <p>{text}</p>
  </div>
);

export default Message;
