import React, { useEffect, useState, useCallback } from 'react';
import { Mail, MailOpen, Search, Bell, User, Reply, Forward, Send, Paperclip } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/forms/Input';
import { getUserMessages, markMessageAsRead, getMessageStats, getAttachmentUrl } from '../../../services/messaging';
import { getStoredUserProfile } from '../../../services/auth';
import MessageCompose from '../components/MessageCompose';

const InternalMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [isUpdating, setIsUpdating] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<'compose' | 'reply' | 'forward'>('compose');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  const currentUser = getStoredUserProfile();

  const fetchMessages = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const data = await getUserMessages(currentUser.id, showUnreadOnly);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, showUnreadOnly]);

  const fetchStats = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const statsData = await getMessageStats(currentUser.id);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ total: 0, unread: 0, read: 0 });
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      fetchMessages();
      fetchStats();
    }
  }, [currentUser?.id, showUnreadOnly]);

  const handleMessageClick = async (message: any) => {
    if (!message.is_read && currentUser && !isUpdating) {
      setIsUpdating(true);
      try {
        await markMessageAsRead(message.id, currentUser.id);
        
        // Update local state immediately to prevent blinking
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, is_read: true } : msg
        ));
        
        // Update stats locally
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1
        }));
        
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setComposeMode('reply');
    setComposeOpen(true);
  };

  const handleForward = (message: any) => {
    setSelectedMessage(message);
    setComposeMode('forward');
    setComposeOpen(true);
  };

  const handleCompose = () => {
    setSelectedMessage(null);
    setComposeMode('compose');
    setComposeOpen(true);
  };

  const handleMessageSent = () => {
    fetchMessages();
    fetchStats();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internal Messages</h1>
          <p className="text-gray-600 mt-1">
            Messages from your team
            {stats.unread > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {stats.unread} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{stats.total} total messages</span>
          </div>
          <Button onClick={handleCompose}>
            <Send className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unread-only"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="unread-only" className="text-sm text-gray-700">
              Unread only
            </label>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">
              {showUnreadOnly ? 'No unread messages' : 'No messages match your search'}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md cursor-pointer ${
                !message.is_read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                      {message.priority.toUpperCase()}
                    </span>
                    {!message.is_read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {message.subject}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    From: {message.sender_name} ({message.sender_email})
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                  {message.is_read ? (
                    <MailOpen className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {message.message}
              </p>

              {/* Attachments - Hidden until database schema is updated */}
              {/* {message.attachments && message.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Attachments ({message.attachments.length})</span>
                  </div>
                  <div className="space-y-2">
                    {message.attachments.map((attachment: any) => (
                      <a
                        key={attachment.id}
                        href={getAttachmentUrl(attachment.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg inline-block"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>{attachment.file_name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(attachment.file_size)})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReply(message);
                  }}
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleForward(message);
                  }}
                >
                  <Forward className="w-3 h-3 mr-1" />
                  Forward
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Compose Modal */}
      <MessageCompose
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        mode={composeMode}
        originalMessage={selectedMessage}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default InternalMessages;
