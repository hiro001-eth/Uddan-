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