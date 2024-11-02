import React from "react";
import botIcon from "../assets/chatbot.png";
const BotMessage = ({ text }) => (
  <div className="message bot-message">
    <span>
      <img src={botIcon} alt="" />
    </span>
    <p>{text}</p>
  </div>
);

export default BotMessage;
