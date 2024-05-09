import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const textareas = document.querySelectorAll(".code-editor");
    textareas.forEach((textarea) => {
      textarea.addEventListener("input", updateOutput);
      textarea.addEventListener("keypress", autoCloseTag);
    });

    return () => {
      textareas.forEach((textarea) => {
        textarea.removeEventListener("input", updateOutput);
        textarea.removeEventListener("keypress", autoCloseTag);
      });
    };
  }, []);

  useEffect(() => {
    // Hide the modal after 5 seconds
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  function updateOutput() {
    const htmlEditor = document.getElementById("html-editor");
    const cssEditor = document.getElementById("css-editor");
    const jsEditor = document.getElementById("js-editor");
    const output = document.getElementById("output");

    output.innerHTML = `
        <style>${cssEditor.value}</style>
        ${htmlEditor.value}
        <script>${jsEditor.value}</script>
    `;
  }

  function autoCloseTag(event) {
    const textarea = event.target;
    const cursorPosition = textarea.selectionStart;
    const value = textarea.value;

    if (event.key === "<") {
      event.preventDefault();
      textarea.value =
        value.substring(0, cursorPosition) +
        "<>" +
        value.substring(cursorPosition);
      textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    } else if (event.key === ">") {
      if (value[cursorPosition - 1] === "<") {
        event.preventDefault();
        textarea.value =
          value.substring(0, cursorPosition - 1) +
          value.substring(cursorPosition);
        textarea.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      }
    }
  }

  function downloadFiles() {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Web Page Title</title>
          <link rel="stylesheet" href="styles.css">
      </head>
      <body>
          ${document.getElementById("html-editor").value}
          <script src="script.js"></script>
      </body>
      </html>
    `;

    const htmlBlob = new Blob([htmlContent], { type: "text/html" });
    const cssBlob = new Blob([document.getElementById("css-editor").value], {
      type: "text/css",
    });
    const jsBlob = new Blob([document.getElementById("js-editor").value], {
      type: "text/javascript",
    });

    const htmlLink = document.createElement("a");
    htmlLink.href = URL.createObjectURL(htmlBlob);
    htmlLink.download = "index.html";

    const cssLink = document.createElement("a");
    cssLink.href = URL.createObjectURL(cssBlob);
    cssLink.download = "styles.css";

    const jsLink = document.createElement("a");
    jsLink.href = URL.createObjectURL(jsBlob);
    jsLink.download = "script.js";

    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);

    document.body.appendChild(cssLink);
    cssLink.click();
    document.body.removeChild(cssLink);

    document.body.appendChild(jsLink);
    jsLink.click();
    document.body.removeChild(jsLink);
  }

  return (
    <div className={darkMode ? "App dark-mode" : "App"}>
      <header className="header">
        <div className="header-left">
          <img src="final.png" alt="Logo" className="logo" />
          <h1
            className="title"
            data-toggle="tooltip"
            data-placement="bottom"
            title="A simple web editor"
          >
            Web.io
          </h1>
        </div>
        <div className="header-buttons">
          <button
            className={`btn ${
              darkMode ? "btn-secondary" : "btn-primary"
            } btn-sm mr-2`}
            onClick={toggleDarkMode}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Toggle Dark Mode"
          >
            Toggle Dark Mode
          </button>
          <button
            className={`btn ${
              darkMode ? "btn-secondary" : "btn-primary"
            } btn-sm`}
            onClick={downloadFiles}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Save Files"
          >
            Save Files
          </button>
        </div>
      </header>
      <div className="container">
        <div
          className="modal"
          style={{ display: showModal ? "block" : "none" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Happy Coding!</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Welcome to Web.io! Start coding now.
              </div>
            </div>
          </div>
        </div>
        <div className="editor">
          <div className="editor-section">
            <h3>HTML</h3>
            <textarea
              id="html-editor"
              className="form-control code-editor"
              rows="10"
            ></textarea>
          </div>
          <div className="editor-section">
            <h3>CSS</h3>
            <textarea
              id="css-editor"
              className="form-control code-editor"
              rows="10"
            ></textarea>
          </div>
          <div className="editor-section">
            <h3>JavaScript</h3>
            <textarea
              id="js-editor"
              className="form-control code-editor"
              rows="10"
            ></textarea>
          </div>
        </div>
        <div className="output">
          <span className="badge badge-secondary badge-lg">OUTPUT</span>
          <div id="output"></div>
        </div>
      </div>
      <footer className="footer">
        <p className="footer-text">Designed by Piyush Bhuyan</p>
      </footer>
    </div>
  );
}

export default App;
