'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Message {
    id: string;
    from: string;
    content: string;
    timestamp: string;
    read: boolean;
}

const mockMessages: Message[] = [
    {
        id: '1',
        from: 'fan123',
        content: 'Your technique is incredible! Any tips for a beginner? I\'ve been watching your videos and trying to improve my form, but I\'m still struggling with consistency.',
        timestamp: '2024-01-17T10:30:00Z',
        read: false
    },
    {
        id: '2',
        from: 'youngbowler',
        content: 'I\'m 16 and just started bowling. You\'re my inspiration! Could you share some beginner-friendly drills?',
        timestamp: '2024-01-17T09:15:00Z',
        read: false
    },
    {
        id: '3',
        from: 'coachsmith',
        content: 'Would love to collaborate on a youth program! We have some talented young bowlers who could benefit from your expertise.',
        timestamp: '2024-01-15T14:20:00Z',
        read: true
    },
    {
        id: '4',
        from: 'bowlingfan2024',
        content: 'Amazing performance at the last tournament! What ball did you use for the final frame?',
        timestamp: '2024-01-14T16:45:00Z',
        read: true
    },
    {
        id: '5',
        from: 'proshop_owner',
        content: 'Hi! We\'d like to discuss a potential equipment sponsorship. Please let me know when you\'re available for a call.',
        timestamp: '2024-01-13T11:30:00Z',
        read: false
    }
];

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setMessages(mockMessages);
                if (mockMessages.length > 0) {
                    setSelectedMessage(mockMessages[0]);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, []);

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' ||
            (filterType === 'unread' && !message.read) ||
            (filterType === 'read' && message.read);
        return matchesSearch && matchesFilter;
    });

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedMessage) return;

        // TODO: Implement actual message sending
        alert('Reply functionality will be implemented with real API');
        setReplyText('');
    };

    const markAsRead = (messageId: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
        ));
    };

    const handleSelectMessage = (message: Message) => {
        setSelectedMessage(message);
        if (!message.read) {
            markAsRead(message.id);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-xl" style={{ color: '#8BC342' }}>Loading Messages...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
                    <div className="flex h-full">
                        {/* Messages List */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" style={{ color: '#8BC342' }} />
                                        Messages
                                    </h1>
                                    <div className="text-sm text-gray-500">
                                        {messages.filter(m => !m.read).length} unread
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>                                {/* Filter */}
                                <div className="flex gap-2">
                                    {(['all', 'unread', 'read'] as const).map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setFilterType(filter)}
                                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filterType === filter
                                                ? 'text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            style={filterType === filter ? { backgroundColor: '#8BC342' } : {}}
                                        >
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredMessages.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500">No messages found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {filteredMessages.map((message) => (<div
                                            key={message.id}
                                            onClick={() => handleSelectMessage(message)}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-green-50 border-r-2' : ''
                                                }`}
                                            style={selectedMessage?.id === message.id ? { borderRightColor: '#8BC342' } : {}}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-medium">{message.from.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-800 truncate">{message.from}</h3>                                                            <div className="flex items-center gap-1">
                                                            {!message.read ? (
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8BC342' }}></div>
                                                            ) : (
                                                                <CheckCircle className="w-3 h-3 text-gray-400" />
                                                            )}
                                                            <span className="text-xs text-gray-500">
                                                                {format(parseISO(message.timestamp), 'MMM dd')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 truncate">{message.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Message Detail */}
                        <div className="flex-1 flex flex-col">
                            {selectedMessage ? (
                                <>
                                    {/* Message Header */}
                                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium">{selectedMessage.from.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <h2 className="font-semibold text-gray-800">{selectedMessage.from}</h2>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(parseISO(selectedMessage.timestamp), 'MMM dd, yyyy \'at\' h:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div className="flex-1 p-4 overflow-y-auto">
                                        <div className="bg-gray-100 rounded-lg p-4">
                                            <p className="text-gray-800 leading-relaxed">{selectedMessage.content}</p>
                                        </div>
                                    </div>

                                    {/* Reply Section */}
                                    <div className="p-4 border-t border-gray-200">                                        <div className="flex gap-3">
                                        <div className="flex-1">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your reply..."
                                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                                rows={3}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!replyText.trim()}
                                            className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                                            style={{ backgroundColor: !replyText.trim() ? '' : '#8BC342' }}
                                            onMouseEnter={(e) => {
                                                if (!e.currentTarget.disabled) {
                                                    e.currentTarget.style.backgroundColor = '#7AB63C';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!e.currentTarget.disabled) {
                                                    e.currentTarget.style.backgroundColor = '#8BC342';
                                                }
                                            }}
                                        >
                                            <Send className="w-4 h-4" />
                                            Send
                                        </button>
                                    </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500">Select a message to view</p>
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
