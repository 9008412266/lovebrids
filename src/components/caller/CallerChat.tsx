import { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatThread {
  id: string;
  hostName: string;
  hostAvatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const mockChats: ChatThread[] = [
  {
    id: '1',
    hostName: 'Priya Sharma',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'Hey! Are you free for a call?',
    timestamp: new Date('2024-01-15T14:30:00'),
    unread: 2,
  },
  {
    id: '2',
    hostName: 'Ananya Patel',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    lastMessage: 'That was a great conversation!',
    timestamp: new Date('2024-01-15T10:15:00'),
    unread: 0,
  },
  {
    id: '3',
    hostName: 'Riya Singh',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    lastMessage: 'Talk to you soon! 💕',
    timestamp: new Date('2024-01-14T22:45:00'),
    unread: 0,
  },
];

const mockMessages: ChatMessage[] = [
  { id: '1', senderId: 'host', text: 'Hey! How are you doing?', timestamp: new Date(), isMe: false },
  { id: '2', senderId: 'me', text: 'Hi! I\'m great, thanks for asking!', timestamp: new Date(), isMe: true },
  { id: '3', senderId: 'host', text: 'Would you like to have a video call?', timestamp: new Date(), isMe: false },
  { id: '4', senderId: 'me', text: 'Sure, that sounds great!', timestamp: new Date(), isMe: true },
  { id: '5', senderId: 'host', text: 'Perfect! I\'m available now 😊', timestamp: new Date(), isMe: false },
];

const CallerChat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (selectedChat) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <button onClick={() => setSelectedChat(null)} className="text-muted-foreground">
            ←
          </button>
          <img
            src={selectedChat.hostAvatar}
            alt={selectedChat.hostName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{selectedChat.hostName}</h2>
            <p className="text-xs text-success">Online</p>
          </div>
          <Button variant="ghost" size="icon">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.isMe
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-secondary text-foreground rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 bg-secondary rounded-full px-4 py-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0"
            />
            <Button variant="gradient" size="icon" className="rounded-full h-10 w-10">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
      </div>

      {/* Search */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2">
          <Search className="text-muted-foreground" size={20} />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-3">
        {mockChats.map((chat, index) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <img
                src={chat.hostAvatar}
                alt={chat.hostName}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground truncate">{chat.hostName}</h3>
                <span className="text-xs text-muted-foreground">
                  {chat.timestamp.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="min-w-[20px] h-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-medium">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallerChat;
