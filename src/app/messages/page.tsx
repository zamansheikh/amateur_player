'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Conversation {
  id: string;
  name: string;
  type: 'individual' | 'group';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants?: string[];
}

interface Message {
  id: string;
  conversationId: string;
  from: string;
  userAvatar?: string;
  itsMe: boolean;
  content: string;
  timestamp: string;
  read: boolean;
  mediaType?: 'video' | 'image';
  mediaUrls?: string[];
}

const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: 'conv1',
    from: 'fan123',
    content: 'Your technique is incredible! Any tips for a beginner?',
    timestamp: '2024-01-17T16:30:00Z',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan123',
    itsMe: false,
    read: false
  },
  {
    id: '2',
    conversationId: 'conv1',
    from: 'me',
    content: 'Thanks! Try focusing on your release timing and follow-through.',
    timestamp: '2024-01-17T17:00:00Z',
    itsMe: true,
    read: true,
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
    mediaType: 'image',
    mediaUrls: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ]
  },
  {
    id: '3',
    conversationId: 'conv2',
    from: 'coachsmith',
    content: 'Would love to collaborate on a youth program!',
    timestamp: '2024-01-15T14:20:00Z',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coachsmith',
    itsMe: false,
    read: true
  },
  {
    id: '4',
    conversationId: 'conv2',
    from: 'me',
    content: 'Sure, I’ll send you a clip.',
    timestamp: '2024-01-15T14:45:00Z',
    itsMe: true,
    read: true,
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
    mediaType: 'video',
    mediaUrls: ['https://www.w3schools.com/html/mov_bbb.mp4']
  }
];

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    name: 'Fan 123',
    type: 'individual',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan123',
    lastMessage: 'Thanks! Try focusing on your release timing and follow-through.',
    lastMessageTime: '2024-01-17T17:00:00Z',
    unreadCount: 0
  },
  {
    id: 'conv2',
    name: 'Coach Smith',
    type: 'individual',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coachsmith',
    lastMessage: 'Sure, I’ll send you a clip.',
    lastMessageTime: '2024-01-15T14:45:00Z',
    unreadCount: 0
  },
  {
    id: 'group1',
    name: 'Training Group',
    type: 'group',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group1',
    lastMessage: 'Don’t forget about the training tomorrow at 10 AM!',
    lastMessageTime: '2024-01-14T09:00:00Z',
    unreadCount: 3,
    participants: ['me', 'fan123', 'coachsmith']
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessages(mockMessages);
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
      // Load messages for the first conversation
      const conversationMessages = mockMessages.filter(
        msg => msg.conversationId === mockConversations[0].id
      );
      setMessages(conversationMessages);
      if (conversationMessages.length > 0) {
        setSelectedMessage(conversationMessages[0]);
      }
    }
    setLoading(false);
  }, []);

  // Filter conversations instead of messages
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'individual' && conversation.type === 'individual') ||
      (filterType === 'group' && conversation.type === 'group');
    return matchesSearch && matchesFilter;
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Load messages for selected conversation
    const conversationMessages = mockMessages.filter(
      msg => msg.conversationId === conversation.id
    );
    setMessages(conversationMessages);
    
    // Clear selected message since we're viewing the conversation as a whole
    setSelectedMessage(null);
    
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    alert('Sending message: ' + replyText);
    setReplyText('');
  };

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" style={{ color: '#8BC342' }} />
                    Messages
                  </h1>
                  <div className="text-sm text-gray-500">
                    {conversations.reduce((total, conv) => total + conv.unreadCount, 0)} unread
                  </div>
                </div>

                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-2">
                  {(['all', 'individual', 'group'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterType(filter)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        filterType === filter ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={filterType === filter ? { backgroundColor: '#8BC342' } : {}}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-green-50 border-r-2' : ''
                      }`}
                      style={selectedConversation?.id === conversation.id ? { borderRightColor: '#8BC342' } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={conversation.avatar}
                          className="w-10 h-10 rounded-full object-cover"
                          alt="avatar"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-800">{conversation.name}</h3>
                              {conversation.type === 'group' && (
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                                  Group
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {conversation.unreadCount > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#8BC342' }}>
                                  {conversation.unreadCount}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {format(parseISO(conversation.lastMessageTime), 'MMM dd')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Viewer */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={selectedConversation.avatar} className="w-10 h-10 rounded-full" alt="avatar" />
                        <div>
                          <h2 className="font-semibold text-gray-800">{selectedConversation.name}</h2>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {selectedConversation.type === 'group' ? 
                              `${selectedConversation.participants?.length || 0} members` :
                              'Active now'
                            }
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500">No messages yet</p>
                          <p className="text-gray-400 text-sm">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.itsMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end gap-3 ${message.itsMe ? 'flex-row-reverse' : ''}`}>
                              <img src={message.userAvatar} className="w-8 h-8 rounded-full" alt="avatar" />
                              <div className="max-w-xs bg-gray-100 p-3 rounded-lg">
                                <p className="text-sm text-gray-800">{message.content}</p>
                                {/* MEDIA PREVIEW */}
                                {message.mediaType && message.mediaUrls && (
                                  <div className="mt-2">
                                    {message.mediaType === 'video' ? (
                                      <video controls className="rounded-lg max-w-full">
                                        <source src={message.mediaUrls[0]} type="video/mp4" />
                                      </video>
                                    ) : (
                                      <div className="grid grid-cols-2 gap-2">
                                        {message.mediaUrls?.slice(0, 4).map((url, idx) => (
                                          <div key={idx} className="relative">
                                            <img src={url} className="w-full h-24 object-cover rounded-md" />
                                            {idx === 3 && message.mediaUrls && message.mediaUrls.length > 4 && (
                                              <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex items-center justify-center text-lg font-bold rounded-md">
                                                +{message.mediaUrls.length - 3}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-3 items-end">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Type a message to ${selectedConversation.name}...`}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={1}
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="px-3 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex-shrink-0"
                        style={{ backgroundColor: !replyText.trim() ? '' : '#8BC342' }}
                      >
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
