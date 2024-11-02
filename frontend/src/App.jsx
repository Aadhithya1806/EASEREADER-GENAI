import React from "react";
import Header from "./components/Header";
import MessageInput from "./components/MessageInput";
import ChatComponent from "./components/ChatComponent";
import { AppContextProvider } from "./store/AppContext";
function App() {
  return (
    <AppContextProvider>
      <Header></Header>
      <div className="main-container">
        <ChatComponent></ChatComponent>

        <MessageInput />
      </div>
    </AppContextProvider>
  );
}

export default App;
