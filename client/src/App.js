import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const response = await axios.get("http://localhost:8001/api/messages");
    setMessages(response.data);
  }

  async function postMessage(userInput) {
    let newMessages;
    if (messages.length === 0) {
      newMessages = [{ id: 1, text: "Please start the conversation by typing a message." }];
    } else {
      const response = await fetch("http://localhost:8001", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const responseData = await response.json();
      const newMessage = responseData.message;
      newMessages = [...messages, { id: messages.length + 1, text: userInput }, { id: messages.length + 2, text: newMessage }];
    }
    setMessages(newMessages);
  }

  return (
    <div>
      <h1>My App</h1>
      <MessageList messages={messages} />
      <MessageForm onSubmit={postMessage} />
    </div>
  );
}

export default App;
