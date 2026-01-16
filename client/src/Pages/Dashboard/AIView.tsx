import React, { useState } from 'react';
import './AIView.css';
import { FiPlus, FiSend } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';

const AIView = () => {
    const [messages, setMessages] = useState([]); // Empty array for initial state
    const [input, setInput] = useState('');

    const chatHistory = [
        "Portfolio Performance Explained",
        "BTC vs ETH comparison",
        "Diversification Strategy",
    ];
    
    const suggestedPrompts = [
        "Explain my portfolio performance",
        "What does this asset do?",
        "How diversified is my portfolio?",
        "Summarize my holdings",
    ];

    const handleSend = () => {
        if (input.trim() === '') return;
        
        const newMessages = [
            ...messages,
            { sender: 'user', text: input }
        ];

        // If this is the first message, add the AI welcome
        if (messages.length === 0) {
            newMessages.unshift({
                sender: 'ai',
                text: "Hello! I'm Yieldbook, your personal crypto assistant. How can I help you understand your investments today?"
            });
        }
        
        // Mock AI response
        setTimeout(() => {
            setMessages(currentMessages => [
                ...currentMessages,
                { sender: 'ai', text: `This is a placeholder response regarding "${input}". Real AI logic is not implemented.` }
            ]);
        }, 1000);

        setMessages(newMessages);
        setInput('');
    };

    return (
        <div className="ai-view">
            {/* AI Sidebar */}
            <aside className="ai-sidebar">
                <button className="new-chat-btn">
                    <FiPlus /> New Chat
                </button>
                <div className="chat-search">
                    <input type="text" placeholder="Search chats..." />
                </div>
                <div className="chat-history-list">
                    <h3>Recent</h3>
                    {chatHistory.map((chat, index) => (
                        <div key={index} className="history-item">
                            {chat}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-area">
                {messages.length === 0 ? (
                    // Empty State
                    <div className="chat-empty-state">
                        <div className="yieldbook-logo-ai">Y</div>
                        <h1>Welcome to Yieldbook AI</h1>
                        <p>Ask me anything about your portfolio or the crypto market.</p>
                    </div>
                ) : (
                    // Conversation View
                    <div className="conversation-view">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <div className="avatar">
                                    {msg.sender === 'ai' ? 'Y' : <BiUser />}
                                </div>
                                <div className="content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Input Area */}
                <div className="chat-input-area">
                    <div className="suggested-prompts">
                        {suggestedPrompts.map(prompt => (
                            <button key={prompt} className="prompt-button" onClick={() => setInput(prompt)}>
                                {prompt}
                            </button>
                        ))}
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Ask Yieldbook a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}><FiSend /></button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIView;
