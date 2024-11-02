import React, { useContext } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import AppContext from "../store/AppContext";

const ChatComponent = () => {
  const appCtx = useContext(AppContext);
  const { messages, isPdfUploaded } = appCtx;

  return (
    <div className="chat-view-container">
      <div>
        {/* Initial bot message based on PDF upload status */}
        {messages.length === 0 && isPdfUploaded && (
          <BotMessage text="Ask any question regarding the PDF.." />
        )}
        {messages.length === 0 && !isPdfUploaded && (
          <BotMessage text="Upload the PDF before chatting" />
        )}

        {/* Render each message based on sender */}
        {messages.map((msg, index) =>
          msg.sender === "user" ? (
            <UserMessage key={index} text={msg.text} />
          ) : (
            <BotMessage key={index} text={msg.text} />
          )
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
