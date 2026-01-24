import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { MessageSquare, Send, Search, User, MoreVertical, Plus, Filter, Phone, Video, Info, Paperclip, Smile } from 'lucide-react';
import EmptyState from '../components/shared/EmptyState';
import { useToast } from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/messages');
      const data = response.data;
      const messagesArray = Array.isArray(data) ? data : (data?.messages && Array.isArray(data.messages) ? data.messages : []);
      setMessages(messagesArray);
      if (messagesArray.length > 0) setSelectedChat(messagesArray[0]);
    } catch (err) {
      console.error(err);
      setError('Failed to load messages');
      showToast('Error loading conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMessages = (Array.isArray(messages) ? messages : []).filter(msg =>
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar - Conversations */}
      <div className="w-[400px] flex flex-col bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Messages</h2>
            <button className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="p-4 flex gap-4">
                <Skeleton variant="circle" className="w-12 h-12 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-1/2 h-4" />
                  <Skeleton variant="text" className="w-3/4 h-3" />
                </div>
              </div>
            ))
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="font-bold">No results found</p>
              <p className="text-xs">Try different keywords</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => setSelectedChat(msg)}
                className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center gap-4 border-2 ${
                  selectedChat?.id === msg.id 
                    ? 'bg-gray-900 border-gray-900 shadow-xl' 
                    : 'bg-white border-transparent hover:bg-gray-50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                  selectedChat?.id === msg.id ? 'bg-white/10 text-white' : 'bg-primary/5 text-primary'
                }`}>
                  {msg.senderName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className={`font-bold text-sm truncate ${selectedChat?.id === msg.id ? 'text-white' : 'text-gray-900'}`}>{msg.senderName || 'Unknown'}</p>
                    <span className={`text-[10px] font-black uppercase ${selectedChat?.id === msg.id ? 'text-white/40' : 'text-gray-400'}`}>{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className={`text-xs truncate ${selectedChat?.id === msg.id ? 'text-white/60 font-medium' : 'text-gray-500'}`}>{msg.content}</p>
                </div>
                {msg.status === 'PENDING' && (
                   <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden">
        {selectedChat ? (
          <>
            {/* Chat Top Bar */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center px-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center font-black text-lg">
                  {selectedChat.senderName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{selectedChat.senderName}</h3>
                  <p className="text-xs text-green-500 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online Now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"><Phone size={20} /></button>
                <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"><Video size={20} /></button>
                <div className="w-px h-8 bg-gray-100 mx-2" />
                <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"><Info size={20} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-gray-50/30">
              <div className="flex flex-col items-center">
                <span className="px-4 py-1.5 bg-white shadow-sm border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Today</span>
              </div>
              
              {/* Other User Message */}
              <div className="flex gap-4 max-w-[80%] items-end group">
                 <div className="w-8 h-8 rounded-xl bg-gray-100 text-[10px] font-black flex items-center justify-center shrink-0">
                  {selectedChat.senderName?.charAt(0)}
                 </div>
                 <div className="space-y-2">
                    <div className="bg-white p-5 rounded-3xl rounded-bl-none shadow-soft border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">{selectedChat.content}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase ml-1 opacity-0 group-hover:opacity-100 transition-opacity">{formatDate(selectedChat.createdAt)}</p>
                 </div>
              </div>

              {/* My Message Placeholder */}
              <div className="flex flex-row-reverse gap-4 max-w-[80%] items-end ml-auto group">
                 <div className="w-8 h-8 rounded-xl bg-primary text-[10px] font-black text-white flex items-center justify-center shrink-0">ME</div>
                 <div className="space-y-2 flex flex-col items-end">
                    <div className="bg-gray-900 p-5 rounded-3xl rounded-br-none shadow-xl text-white">
                      <p className="text-sm leading-relaxed font-medium">Understood. I'll check the property maintenance status right away and get back to you by end of day today.</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mr-1 opacity-0 group-hover:opacity-100 transition-opacity">12:45 PM • Read</p>
                 </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-8 pb-10 b-8">
              <div className="bg-gray-50 p-3 pl-6 rounded-3xl flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-gray-100">
                <button className="text-gray-400 hover:text-gray-900 transition-all"><Paperclip size={20} /></button>
                <input 
                  type="text" 
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium"
                />
                <button className="p-3 text-gray-400 hover:text-gray-900 transition-all"><Smile size={20} /></button>
                <button className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
                  <Send size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="m-auto">
            <EmptyState
              icon={MessageSquare}
              title="Select a Conversation"
              description="Choose a message from the sidebar to start communicating with your tenants and staff."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;

