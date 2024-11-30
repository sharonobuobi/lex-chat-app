import React, { useState } from 'react';
import { post } from 'aws-amplify/api';
import { SendHorizontal } from 'lucide-react';

const MobileChatApp = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'bot' }
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
      
      // Get the resolved promise response
      const result = await response.response;
      console.log('Result:', result);
  
      // Get the readable stream
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
        sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
        const response = await sendMessageToLex(inputText);
        console.log('Response received:', response);

        if (response?.messages && Array.isArray(response.messages)) {
        // Add each bot message in order with a delay
        for (let i = 0; i < response.messages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between messages
            const botMessage = {
            id: Date.now() + i + 1,
            text: response.messages[i],
            sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        }
        }
    } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
        }]);
    }
    };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && inputText.trim() !== '') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-xl font-semibold">Aurora by Alt/Finance</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Aurora..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatApp;