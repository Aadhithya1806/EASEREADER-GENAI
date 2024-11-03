import React, { useEffect, useContext, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import AppContext from "../store/AppContext";

const MessageInput = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // State for textarea input
  const appCtx = useContext(AppContext);
  const { addMessage, isPdfUploaded } = appCtx;

  const submitHandler = (event) => {
    event.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages

    // Add the user's message to the context
    addMessage(message, "user");
    setFormData({ question: message }); // Set form data for the API request
  };

  useEffect(() => {
    const submitQuestion = async () => {
      if (!formData) return; // Exit if formData is null

      setIsLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        // Send request to the backend with the form data
        const response = await fetch("https://easereader-genai-backend-rest.onrender.com/ask_question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Handle response
        if (!response.ok) {
          throw new Error("Failed to submit the question");
        }

        const result = await response.json();
        console.log("Response data:", result);

        // Add the bot's response to the context messages
        addMessage(result.message || "No response received", "bot");

        // Clear the textarea by resetting the message state
        setMessage(""); // Clear the message input
        setFormData(null); // Reset form data
      } catch (error) {
        console.error("Error:", error);
        setError(error.message); // Store the error message in state
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (formData) {
      submitQuestion(); // Call the function when formData changes
      console.log(formData.question);
    }
  }, [formData, addMessage]); // Dependency array includes formData and addMessage

  return (
    <form onSubmit={submitHandler}>
      <div className="chat-input-container">
        <textarea
          className="chat-textarea"
          placeholder="Type a message..."
          rows="2"
          name="question"
          value={message} // Controlled component value
          onChange={(e) => setMessage(e.target.value)} // Update state on change
          disabled={!isPdfUploaded} // Disable if PDF is not uploaded
        ></textarea>
        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !isPdfUploaded}
        >
          <SendIcon style={{ color: "black" }} />
        </button>
      </div>
      {isLoading && (
        <div style={{ width: "75%", margin: "24px auto" }}>Loading...</div>
      )}{" "}
      {/* Show loading indicator */}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}{" "}
      {/* Show error message */}
    </form>
  );
};

export default MessageInput;
