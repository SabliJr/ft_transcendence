import React, { useState } from "react";
import "./ChatView.css";

const ChatView = () => {
  const [chats, setChats] = useState<any[]>([]);

  return (
    <div className="chat-view">
      {chats.length > 0 ? (
        <div className="chat-list">
          {/* Example of a chat item */}
          {/* <div className="chat-item">
            <div className="chat-avatar"></div>
            <div className="chat-info">
              <div className="chat-name">John Doe</div>
              <div className="chat-message">Hey, how are you?</div>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="no-chats">
          <h2>No chats yet</h2>
          <p>Start a new conversation with your friends.</p>
          <button className="start-chat-btn">Start new chat</button>
        </div>
      )}
    </div>
  );
};

export default ChatView;
