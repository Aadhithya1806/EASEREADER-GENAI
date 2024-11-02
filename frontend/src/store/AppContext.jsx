import React, { createContext, useState } from "react";

const AppContext = createContext({
  messages: [],
  isPdfUploaded: false,
  isFormSubmitted: false,
  addMessage: () => {},
  setIsPdfUploaded: () => {},
  setIsFormSubmitted: () => {},
});

export const AppContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Function to add a new message with a sender tag
  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  const appContext = {
    messages,
    isPdfUploaded,
    isFormSubmitted,
    addMessage,
    setIsPdfUploaded,
    setIsFormSubmitted,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

export default AppContext;
