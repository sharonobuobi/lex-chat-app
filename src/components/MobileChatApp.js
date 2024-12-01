import React, { useState } from 'react';
import { post } from 'aws-amplify/api';
import { SendHorizontal } from 'lucide-react';

const MobileChatApp = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "I'm Aurora, your AI assistant for tracking and managing your alternative investments.", 
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 2, 
      text: "How can I help you today? Would you like a valuation, a market report or technical help?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageToLex = async (message) => {
    try {
      setIsLoading(true);
      console.log('Sending message:', message);
      
      const response = await post({
        apiName: 'lexapi',
        path: '/chat',
        options: {
          body: {
            message: message,
            userId: 'default-user'
          }
        }
      });
      
      console.log('Raw response:', response);
      
      const result = await response.response;
      console.log('Result:', result);
  
      const reader = result.body.getReader();
      const { value } = await reader.read();
      const text = new TextDecoder().decode(value);
      const jsonData = JSON.parse(text);
      console.log('Parsed JSON:', jsonData);
      
      return jsonData;
  
    } catch (error) {
      console.error('Error sending message to Lex:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await sendMessageToLex(inputText);
      console.log('Response received:', response);

      if (response?.messages && Array.isArray(response.messages)) {
        for (let i = 0; i < response.messages.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const botMessage = {
            id: Date.now() + i + 1,
            text: response.messages[i],
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && inputText.trim() !== '') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      {/* Header */}
      <div className="w-full bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Aurora by Alt/Finance
        </h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div className="w-[70%]"> {/* Container to control max width */}
              <div className="flex flex-col">
                <div
                  className={`rounded-lg p-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-white text-gray-800 ml-auto' // ml-auto pushes user messages to the right
                      : 'bg-blue-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                <span className={`text-xs text-gray-500 mt-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Aurora..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || isLoading}
            className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatApp;