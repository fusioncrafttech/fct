import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Reply, Search, Send, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Table, type TableColumn } from '../../../components/tables/Table';
import { Modal } from '../../../components/modals/Modal';
import { Input } from '../../../components/forms/Input';
import { Textarea } from '../../../components/forms/Textarea';
import { messagesService } from '../services/supabase';
import { sendInternalMessage, getTeamMembers } from '../../../services/messaging';
import { getStoredUserProfile } from '../../../services/auth';
import type { ContactMessage } from '@/types/global';

const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  
  // Internal messaging state
  const [activeTab, setActiveTab] = useState<'contact' | 'internal'>('contact');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeForm, setComposeForm] = useState({
    recipient_id: '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const currentUser = getStoredUserProfile();

  useEffect(() => {
    fetchMessages();
    fetchTeamMembers();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await messagesService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const handleSendInternalMessage = async () => {
    if (!currentUser || !composeForm.subject || !composeForm.message) {
      return;
    }

    setSendingMessage(true);
    try {
      await sendInternalMessage({
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_email: currentUser.email,
        recipient_id: composeForm.recipient_id || undefined,
        subject: composeForm.subject,
        message: composeForm.message,
        priority: composeForm.priority
      });

      // Reset form
      setComposeForm({
        recipient_id: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
      setShowComposeModal(false);
      
      // Show success message
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleMarkAsRead = async (message: ContactMessage) => {
    try {
      if (message.id) {
        await messagesService.updateStatus(message.id, 'read');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleMarkAsReplied = async (message: ContactMessage) => {
    try {
      if (message.id) {
        await messagesService.updateStatus(message.id, 'replied');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to mark message as replied:', error);
    }
  };

  const handleDelete = async (message: ContactMessage) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        if (message.id) {
          await messagesService.delete(message.id);
          fetchMessages();
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    setModalOpen(true);
    if (message.status === 'new') {
      handleMarkAsRead(message);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      (message.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (message.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (message.message?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new':
        return <Mail className="w-4 h-4" />;
      case 'read':
        return <MailOpen className="w-4 h-4" />;
      case 'replied':
        return <Reply className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const columns: TableColumn<ContactMessage>[] = [
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}
        >
          {getStatusIcon(value)}
          <span className="ml-1">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </span>
      )
    },
    {
      key: 'name',
      title: 'Name',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <div className="text-sm text-gray-600">{value}</div>
      )
    },
    {
      key: 'message',
      title: 'Message',
      render: (value) => (
        <div className="text-sm text-gray-600 line-clamp-2">{value}</div>
      )
    },
    {
      key: 'created_at',
      title: 'Date',
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, item) => (
        <div className="flex items-center space-x-2">
          {item.status !== 'replied' && (
            <Button
              size="sm"
              variant="ghost"
              icon={<Reply className="w-4 h-4" />}
              onClick={() => handleMarkAsReplied(item)}
            />
          )}
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(item)}
          />
        </div>
      )
    }
  ];

  const unreadCount = messages.filter(m => m.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Manage contact messages and internal communications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {activeTab === 'internal' && (
          <Button
            icon={<Send className="w-4 h-4" />}
            onClick={() => setShowComposeModal(true)}
          >
            Compose Message
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'contact'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Contact Messages ({messages.length})
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'internal'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('internal')}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Internal Messages
          </button>
        </div>
      </div>

      {/* Contact Messages Tab */}
      {activeTab === 'contact' && (
        <>
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
              <div className="flex gap-2">
                {(['all', 'new', 'read', 'replied'] as const).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? 'primary' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <Table
              data={filteredMessages}
              columns={columns}
              loading={loading}
              emptyMessage="No messages found"
              onRowClick={handleMessageClick}
            />
          </div>
        </>
      )}

      {/* Internal Messages Tab */}
      {activeTab === 'internal' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Internal Messaging</h3>
          <p className="text-gray-600 mb-6">
            Send messages to team members or broadcast to everyone
          </p>
          <Button
            icon={<Send className="w-4 h-4" />}
            onClick={() => setShowComposeModal(true)}
          >
            Send Internal Message
          </Button>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedMessage.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}
              >
                {getStatusIcon(selectedMessage.status)}
                <span className="ml-1">{selectedMessage.status ? selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1) : 'Unknown'}</span>
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Received</label>
              <p className="text-gray-600">
                {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : 'No date'}
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {selectedMessage.status !== 'replied' && (
                <Button
                  icon={<Reply className="w-4 h-4" />}
                  onClick={() => handleMarkAsReplied(selectedMessage)}
                >
                  Mark as Replied
                </Button>
              )}
              <Button
                variant="danger"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleDelete(selectedMessage)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Compose Message Modal */}
      <Modal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        title="Compose Internal Message"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSendInternalMessage(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
            <select
              value={composeForm.recipient_id}
              onChange={(e) => setComposeForm({ ...composeForm, recipient_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Team Members</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email}) - {member.role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <Input
              value={composeForm.subject}
              onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
              placeholder="Enter message subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={composeForm.priority}
              onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <Textarea
              value={composeForm.message}
              onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
              placeholder="Type your message here..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowComposeModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendingMessage}
              icon={<Send className="w-4 h-4" />}
            >
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessagesManager;
