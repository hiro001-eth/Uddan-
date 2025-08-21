import React, { useState, useRef, useEffect } from 'react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Udaan AI assistant. Ask me about jobs, consultation, or visa support.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'I\'m here to help!' }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-brandOrange text-white rounded-full shadow-2xl px-5 py-3 hover:scale-105 transition-transform"
      >
        {isOpen ? 'Close Assistant' : 'Need Help? Chat'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 md:w-96 h-96 bg-brandWhite rounded-2xl shadow-2xl border border-brandIndigo/20 flex flex-col overflow-hidden z-50">
          <div className="bg-brandIndigo text-white px-4 py-3 font-semibold">
            Udaan AI Assistant
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-[85%] px-3 py-2 rounded-xl ${m.role === 'user' ? 'ml-auto bg-brandIndigo text-white' : 'bg-brandWhite text-brandBlack border border-brandIndigo/10'}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="text-sm text-brandSky">Assistant is typing...</div>}
            <div ref={endRef} />
          </div>
          <div className="border-t border-brandIndigo/20 p-2 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-lg border border-brandIndigo/30 focus:ring-2 focus:ring-brandSky focus:border-transparent"
            />
            <button onClick={sendMessage} className="bg-brandOrange text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant; 
import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you find the perfect job opportunity in the Gulf countries?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = {
    'hello': 'Hello! I\'m here to help you with job opportunities in Gulf countries. What specific information do you need?',
    'jobs': 'We have various job opportunities in UAE, Saudi Arabia, Qatar, Kuwait, Oman, and Bahrain. What type of work are you looking for?',
    'visa': 'We assist with complete visa processing for Gulf countries. The process typically takes 2-4 weeks depending on the country.',
    'salary': 'Salaries vary by position and country. Generally, Gulf countries offer tax-free salaries ranging from $800-5000+ per month.',
    'apply': 'To apply for jobs, browse our job listings and click "Apply Now" on positions that interest you. We\'ll guide you through the process.',
    'contact': 'You can reach us at +977-XXX-XXXXX or email info@uddaanagencies.com.np for direct assistance.',
    'documents': 'Required documents typically include: Passport, Educational certificates, Experience letters, Medical certificate, and Police clearance.',
    'countries': 'We provide opportunities in UAE, Saudi Arabia, Qatar, Kuwait, Oman, and Bahrain. Each country has different requirements.',
    'help': 'I can help you with: Job searching, Application process, Visa information, Salary details, Required documents, and Contact information.'
  };

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Find matching keywords
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Default responses based on context
    if (lowerMessage.includes('job') || lowerMessage.includes('work')) {
      return "We have numerous job opportunities across Gulf countries. Would you like me to help you find jobs in a specific field or country?";
    }
    
    if (lowerMessage.includes('visa') || lowerMessage.includes('process')) {
      return "Our visa processing service ensures smooth documentation. Which country are you interested in working in?";
    }
    
    if (lowerMessage.includes('requirement') || lowerMessage.includes('need')) {
      return "Requirements vary by job and country. Generally, you'll need valid passport, relevant qualifications, and experience. What specific role interests you?";
    }
    
    return "I'd be happy to help! You can ask me about job opportunities, visa processes, salary information, required documents, or application procedures. What would you like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-button group"
          title="Need help? Chat with us!"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="chat-window animate-fadeInUp">
          {/* Header */}
          <div className="chat-header flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Uddaan Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-500 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 flex items-start space-x-2'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.isBot && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chat-input-container">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input flex-1"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Jobs available?', 'Visa process?', 'Salary info?', 'How to apply?'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
