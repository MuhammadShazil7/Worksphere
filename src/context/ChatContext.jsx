// src/context/ChatContext.jsx - Updated selectUser function
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const socketRef = useRef(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    setIsConversationsLoading(true);
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsConversationsLoading(false);
    }
  }, [user]);

  // Fetch messages for a specific user - CLEAR messages first
  const fetchMessages = useCallback(async (userId) => {
    if (!userId) {
      setMessages([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data.messages || []);
      
      // Mark messages as read
      await api.put(`/messages/read/${userId}`);
      
      // Update conversations to refresh unread count
      fetchConversations();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchConversations]);

  // Send message
  const sendMessage = useCallback(async (receiverId, content, jobId = null) => {
    try {
      const response = await api.post('/messages', {
        receiver: receiverId,
        content,
        job: jobId
      });
      
      const newMessage = response.data.message;
      
      // Add message to local state immediately
      if (selectedUser && selectedUser._id === receiverId) {
        setMessages(prev => [...prev, newMessage]);
      }
      
      // Update conversations list
      setConversations(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(c => c.user._id === receiverId);
        
        const newConversation = {
          user: selectedUser || { _id: receiverId },
          lastMessage: newMessage,
          unreadCount: 0
        };
        
        if (existingIndex !== -1) {
          updated[existingIndex] = newConversation;
          const [item] = updated.splice(existingIndex, 1);
          updated.unshift(item);
        } else {
          updated.unshift(newConversation);
        }
        
        return updated;
      });
      
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [selectedUser]);

  // Select a user to chat with - CLEAR messages first
  const selectUser = useCallback((user) => {
    // Clear messages immediately when switching
    setMessages([]);
    setSelectedUser(user);
    
    if (user) {
      fetchMessages(user._id);
    }
  }, [fetchMessages]);

  // Send typing indicator
  const sendTyping = useCallback((receiverId, isTyping) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', { receiverId, isTyping });
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    if (!socketRef.current || !socketRef.current.connected) {
      const socketInstance = io('http://localhost:5000', {
        query: { userId: user.id },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socketInstance;
      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
      });

      socketInstance.on('new_message', (message) => {
        // Update messages if the chat is open
        if (selectedUser && message.sender._id === selectedUser._id) {
          setMessages(prev => [...prev, message]);
        }
        
        // Update conversations
        setConversations(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(c => c.user._id === message.sender._id);
          
          const newConversation = {
            user: message.sender,
            lastMessage: message,
            unreadCount: 1
          };
          
          if (existingIndex !== -1) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastMessage: message,
              unreadCount: (updated[existingIndex].unreadCount || 0) + 1
            };
            const [item] = updated.splice(existingIndex, 1);
            updated.unshift(item);
          } else {
            updated.unshift(newConversation);
          }
          
          return updated;
        });
      });

      socketInstance.on('message_sent', (message) => {
        console.log('Message sent successfully:', message);
      });

      socketInstance.on('user_typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping
        }));
        
        if (data.isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => ({
              ...prev,
              [data.userId]: false
            }));
          }, 3000);
        }
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    fetchConversations();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('new_message');
        socketRef.current.off('message_sent');
        socketRef.current.off('user_typing');
        socketRef.current.off('disconnect');
      }
    };
  }, [user, fetchConversations, selectedUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const value = {
    socket,
    conversations,
    messages,
    selectedUser,
    loading: loading || isConversationsLoading,
    typingUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectUser,
    sendTyping,
    isConversationsLoading,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};