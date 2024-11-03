import React, { useContext, useState } from "react";
import logo from "../assets/logo.png";
import smallLogo from "../assets/chatbot.png";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import AppContext from "../store/AppContext";

const Header = () => {
  const appCtx = useContext(AppContext);
  const [selectedFiles, setSelectedFiles] = useState([]); // State to hold the uploaded files

  const fileChangeHandler = (event) => {
    const files = Array.from(event.target.files); // Get the selected files
    setSelectedFiles(files); // Update state with the selected files
  };

  const uploadFilesHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file); // Append each file to FormData
    });

    // Log the file names and types
    selectedFiles.forEach((file) => {
      console.log("File Name:", file.name);
      console.log("File Type:", file.type);
    });

    // Send the FormData to the server
    try {
      const response = await fetch("https://easereader-genai-backend-rest.onrender.com/process_documents/", {
        method: "POST",
        body: formData, // Send FormData directly
      });

      if (!response.ok) {
        throw new Error("Failed to upload the files.");
      }

      const result = await response.json(); // Parse the response as JSON
      console.log("Upload response:", result); // Log the server response
      appCtx.setIsPdfUploaded(true);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files: " + error.message);
    }
  };

  const truncateFileName = (fileName, maxLength = 15) => {
    if (fileName.length > maxLength) {
      return `${fileName.slice(0, maxLength)}...`; // Truncate and add ellipsis
    }
    return fileName;
  };

  // Function to format file size
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="header">
      <div>
        <img src={logo} alt="main-logo" />
      </div>
      <div>
        <form onSubmit={uploadFilesHandler} className="form-conrtol-fileupload">
          {selectedFiles.length > 0 && (
            <div className="uploaded-files">
              <ul>
                {selectedFiles.map((file) => (
                  <li key={file.name}>
                    {truncateFileName(file.name)} - {formatFileSize(file.size)}{" "}
                    {/* Show truncated name and size */}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Hidden file input */}
          <input
            className="file-input"
            type="file"
            name="files"
            accept=".pdf" // Limit file types to PDF
            onChange={fileChangeHandler} // Handle file selection
            style={{ display: "none" }} // Hide the default file input
            id="file-upload" // Give it an ID for the label
          />
          {/* Custom upload button that triggers the hidden input */}
          <label htmlFor="file-upload" className="custom-upload-btn">
            <FileUploadRoundedIcon style={{ width: "30px", height: "30px" }} />
          </label>
          <button type="submit" className="btn" disabled={appCtx.isPdfUploaded}>
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
