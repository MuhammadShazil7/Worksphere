// src/pages/MessagesPage.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaPaperPlane, 
  FaClock,
  FaCheck,
  FaCheckDouble,
  FaArrowLeft,
  FaSearch,
  FaCircle,
  FaUserCircle,
  FaTimes,
  FaUserPlus
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Container from '../components/ui/Container/Container';
import Card from '../components/ui/Card/card';
import Input from '../components/ui/input';
import Button from '../components/ui/Button/Button';
import Modal from '../components/ui/Modal/Modal';

const MessagesPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    selectedUser,
    loading,
    typingUsers,
    selectUser,
    sendMessage,
    sendTyping,
    fetchConversations
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Get userId from URL params - FIXED: Added dependency array with proper checks
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    
    if (userId && userId !== selectedUserId) {
      setSelectedUserId(userId);
      // Find the user in conversations
      const conv = conversations.find(c => c.user?._id === userId);
      if (conv) {
        selectUser(conv.user);
      } else {
        // If user not in conversations, fetch user data
        fetchUserAndSelect(userId);
      }
    }
  }, [location.search, conversations, selectUser, selectedUserId]);

  // Initial fetch - only once
  useEffect(() => {
    if (!initialLoadDone) {
      fetchConversations();
      setInitialLoadDone(true);
    }
  }, [fetchConversations, initialLoadDone]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when user is selected
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [selectedUser]);

  const fetchUserAndSelect = useCallback(async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      selectUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      toast.error('Could not load user');
    }
  }, [selectUser]);

  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      const role = user?.role === 'freelancer' ? 'client' : 'freelancer';
      const response = await api.get(`/users?role=${role}`);
      const existingUserIds = conversations.map(c => c.user._id);
      const filteredUsers = response.data.users.filter(
        u => u._id !== user?.id && !existingUserIds.includes(u._id)
      );
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenNewMessage = () => {
    setShowNewMessage(true);
    fetchAvailableUsers();
    setUserSearch('');
  };

  const handleStartConversation = (selectedUser) => {
    setShowNewMessage(false);
    selectUser(selectedUser);
    setSelectedUserId(selectedUser._id);
    navigate(`/messages?userId=${selectedUser._id}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(selectedUser._id, messageInput.trim());
      setMessageInput('');
      setIsTyping(false);
      sendTyping(selectedUser._id, false);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      sendTyping(selectedUser._id, true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTyping(selectedUser._id, false);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectUser = (user) => {
    selectUser(user);
    setSelectedUserId(user._id);
    navigate(`/messages?userId=${user._id}`);
  };

  const handleBack = () => {
    selectUser(null);
    setSelectedUserId(null);
    navigate('/messages');
  };

  // Memoize filtered conversations to prevent unnecessary re-renders
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv =>
      conv.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const filteredAvailableUsers = useMemo(() => {
    return availableUsers.filter(u =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.headline?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [availableUsers, userSearch]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diff = now - msgDate;

    if (diff < 86400000) {
      return formatTime(date);
    } else if (diff < 172800000) {
      return 'Yesterday';
    } else if (diff < 604800000) {
      return msgDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return msgDate.toLocaleDateString();
    }
  };

  const isMyMessage = (msg) => {
    return msg.sender._id === user?.id || msg.sender === user?.id;
  };

  if (loading && !conversations.length) {
    return (
      <section className="py-8 sm:py-12 min-h-[calc(100vh-80px)]">
        <Container>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
              <p className="mt-4 text-zinc-400">Loading messages...</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 min-h-[calc(100vh-80px)]">
      <Container>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
            <p className="text-zinc-400 text-sm sm:text-base">Chat with freelancers and clients</p>
          </div>
          <Button onClick={handleOpenNewMessage} className="flex-shrink-0">
            <FaUserPlus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversations List */}
          <div className={`lg:col-span-4 ${selectedUser ? 'hidden lg:block' : 'block'}`}>
            <Card className="p-4 h-[calc(100vh-220px)] flex flex-col">
              <div className="mb-4">
                <Input
                  placeholder="Search conversations..."
                  icon={<FaSearch className="w-4 h-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto -mx-2 px-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-10">
                    <FaUser className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">No conversations yet</p>
                    <button 
                      onClick={handleOpenNewMessage}
                      className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block"
                    >
                      Start a new conversation →
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.user._id}
                      onClick={() => handleSelectUser(conv.user)}
                      className={`w-full text-left p-3 rounded-xl transition ${
                        selectedUser?._id === conv.user._id
                          ? 'bg-violet-500/20 border border-violet-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-white">
                            {conv.user.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.user.name}</p>
                            {conv.lastMessage && (
                              <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">
                                {formatDate(conv.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-400 truncate">
                              {conv.lastMessage?.content || 'Start chatting'}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center flex-shrink-0 ml-2">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className={`lg:col-span-8 ${selectedUser ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-0 h-[calc(100vh-220px)] flex flex-col overflow-hidden">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={handleBack}
                        className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition"
                        aria-label="Back"
                      >
                        <FaArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {selectedUser.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{selectedUser.name}</p>
                        <div className="flex items-center gap-2">
                          <FaCircle className={`w-2 h-2 ${typingUsers[selectedUser._id] ? 'text-green-400 animate-pulse' : 'text-green-400'}`} />
                          <p className="text-xs text-zinc-400">
                            {typingUsers[selectedUser._id] ? (
                              <span className="text-violet-400 animate-pulse">Typing...</span>
                            ) : (
                              'Online'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleBack}
                      className="hidden lg:block p-2 hover:bg-white/5 rounded-lg transition"
                      aria-label="Close chat"
                    >
                      <FaTimes className="w-4 h-4 text-zinc-400 hover:text-white" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a]">
                    {messages.length === 0 ? (
                      <div className="text-center py-10">
                        <FaUserCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No messages yet</p>
                        <p className="text-sm text-zinc-500">Send your first message!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMine = isMyMessage(msg);
                        return (
                          <div
                            key={msg._id || index}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                isMine
                                  ? 'bg-violet-600 rounded-br-none'
                                  : 'bg-white/10 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm text-white break-words leading-relaxed">{msg.content}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-xs text-white/50">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isMine && (
                                  <span className="text-xs text-white/50">
                                    {msg.read ? <FaCheckDouble className="w-3 h-3" /> : <FaCheck className="w-3 h-3" />}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10 bg-white/5">
                    <div className="flex gap-2">
                      <textarea
                        ref={inputRef}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
                        placeholder={`Message ${selectedUser.name}...`}
                        rows="2"
                        value={messageInput}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="self-end px-4 py-2.5"
                        disabled={!messageInput.trim() || isSending}
                        loading={isSending}
                      >
                        <FaPaperPlane className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 text-center">
                      Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Shift+Enter</kbd> for new line
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FaUserCircle className="w-20 h-20 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 text-lg">Select a conversation</p>
                    <p className="text-sm text-zinc-500">Choose someone to start chatting</p>
                    <button 
                      onClick={handleOpenNewMessage}
                      className="mt-4 text-violet-400 hover:text-violet-300 transition flex items-center justify-center gap-2"
                    >
                      <FaUserPlus className="w-4 h-4" />
                      Start a new conversation
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        title="New Message"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search by name, email, or title..."
            icon={<FaSearch className="w-4 h-4" />}
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />

          <div className="max-h-96 overflow-y-auto -mx-2 px-2">
            {loadingUsers ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
                <p className="mt-2 text-zinc-400 text-sm">Loading users...</p>
              </div>
            ) : filteredAvailableUsers.length === 0 ? (
              <div className="text-center py-8">
                <FaUser className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400">No users available</p>
                <p className="text-sm text-zinc-500 mt-1">
                  {userSearch ? 'Try a different search term' : 'All users are already in your conversations'}
                </p>
              </div>
            ) : (
              filteredAvailableUsers.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleStartConversation(u)}
                  className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {u.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-zinc-400 truncate">{u.headline || u.email}</p>
                    {u.hourlyRate > 0 && (
                      <p className="text-xs text-green-400">${u.hourlyRate}/hr</p>
                    )}
                  </div>
                  <Button size="sm" className="flex-shrink-0">
                    Message
                  </Button>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default MessagesPage;