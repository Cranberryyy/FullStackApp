import React, { useState, useEffect, useRef } from "react";
import APIService from "./APIService";
import { Alert, Spinner } from 'react-bootstrap';

function ChatBot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
  
    setIsLoading(true);
    setError("");
  
    try {
      const data = await APIService.ChatInteract({ message });
  
      if (data && data.reply) {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "User", text: message },
          { sender: "Bot", text: data.reply }
        ]);
        setMessage("");
      } else {
        setError("Invalid response from server");
        console.error("Unexpected API response:", data);
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-bot mt-4">
      {error && (
        <Alert variant="danger" className="mt-3 text-center">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label>ChatBot Input</label>
          <input 
            type="text" 
            className="form-control" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading} // 正在请求时禁用输入
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary mt-2"
          disabled={isLoading || !message.trim()} // 禁用逻辑
        >
          {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" /> : "Send"}
        </button>
      </form>

      <div className="chat-output mt-4">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatBot;
