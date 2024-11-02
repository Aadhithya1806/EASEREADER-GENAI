import React from "react";
import PersonIcon from "@mui/icons-material/Person";

const UserMessage = ({ text }) => (
  <div className="message user-message">
    <span>
      <PersonIcon
        style={{ height: "32px", width: "32px", marginRight: "12px" }}
      ></PersonIcon>
    </span>
    <div>
      <p>{text}</p>
    </div>
  </div>
);

export default UserMessage;
