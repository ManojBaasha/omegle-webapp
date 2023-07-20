import React from 'react';
import '../assets/TestScreen.css';

function Test() {
  const senderMessages = [
    { id: 1, text: "Hey there, how are you?" },
    { id: 2, text: "I'm doing great, thanks!" },
    // Add more sender messages here
  ];

  const receiverMessages = [
    { id: 1, text: "Hi, nice to meet you!" },
    { id: 2, text: "Good to hear that!" },
    // Add more receiver messages here
  ];

  return (
    <div className="chat-box">
      {/* Navbar */}
      <div className="navbar">
        <div>
          {/* User's profile and name */}
          <img src="path/to/profile-picture.png" alt="Profile" />
          <span style={{ fontWeight: 'bold' }}>User's Name</span>
        </div>
        <button>Back</button>
      </div>

      {/* Messages */}
      <div className="messages">
        {senderMessages.map((message) => (
          <div key={message.id} className="message sender-message">
            {message.text}
          </div>
        ))}
        {receiverMessages.map((message) => (
          <div key={message.id} className="message receiver-message">
            {message.text}
          </div>
        ))}
      </div>

      {/* Message form */}
      <div className="message-form">
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  );
}

export default Test;
