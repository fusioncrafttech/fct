import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/forms/Input';
import { sendInternalMessage, getTeamMembers, type TeamMember } from '../../../services/messaging';
import { getStoredUserProfile } from '../../../services/auth';

interface ExtendedTeamMember extends TeamMember {
  type?: 'team_member' | 'admin';
}

interface MessageComposeProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'compose' | 'reply' | 'forward';
  originalMessage?: any;
  onMessageSent?: () => void;
}

const MessageCompose: React.FC<MessageComposeProps> = ({
  isOpen,
  onClose,
  mode = 'compose',
  originalMessage,
  onMessageSent
}) => {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<ExtendedTeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  
  const currentUser = getStoredUserProfile();

  React.useEffect(() => {
    if (isOpen) {
      fetchTeamMembers();
      // Pre-fill based on mode
      if (mode === 'reply' && originalMessage) {
        setSubject(`Re: ${originalMessage.subject}`);
        setMessage(`\n\n---\nOn ${new Date(originalMessage.created_at).toLocaleDateString()}, ${originalMessage.sender_name} wrote:\n${originalMessage.message}`);
        setRecipientId(originalMessage.sender_id);
      } else if (mode === 'forward' && originalMessage) {
        setSubject(`Fwd: ${originalMessage.subject}`);
        setMessage(`\n\n--- Forwarded message ---\nFrom: ${originalMessage.sender_name}\nDate: ${new Date(originalMessage.created_at).toLocaleDateString()}\nSubject: ${originalMessage.subject}\n\n${originalMessage.message}`);
      }
    }
  }, [isOpen, mode, originalMessage]);

  const fetchTeamMembers = async () => {
    setLoadingMembers(true);
    try {
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to send messages');
      return;
    }

    // For reply mode, recipient should be pre-filled
    if (mode === 'compose' || mode === 'forward') {
      if (!recipientId) {
        alert('Please select a recipient');
        return;
      }
    } else if (mode === 'reply') {
      if (!recipientId) {
        alert('Reply recipient not found');
        return;
      }
    }

    setLoading(true);
    try {
      await sendInternalMessage({
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_email: currentUser.email,
        recipient_id: recipientId || undefined,
        subject,
        message,
        priority,
        reply_to: mode === 'reply' ? originalMessage?.id : undefined,
        forwarded_from: mode === 'forward' ? originalMessage?.id : undefined,
        attachments: attachments.length > 0 ? attachments : undefined
      });

      // Reset form
      setRecipientId('');
      setSubject('');
      setMessage('');
      setPriority('medium');
      setAttachments([]);
      
      onClose();
      onMessageSent?.();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'reply' ? 'Reply to Message' : mode === 'forward' ? 'Forward Message' : 'Compose Message'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Recipient */}
          {mode === 'compose' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              {loadingMembers ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
              ) : (
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select recipient...</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email}) - {member.role}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Reply Mode - Show recipient as read-only */}
          {mode === 'reply' && originalMessage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {originalMessage.sender_name} ({originalMessage.sender_email})
              </div>
              <input
                type="hidden"
                value={recipientId}
                readOnly
              />
            </div>
          )}

          {/* Forward Mode - Allow recipient selection */}
          {mode === 'forward' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              {loadingMembers ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
              ) : (
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select recipient...</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email}) - {member.role}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-4">
              {['low', 'medium', 'high'].map((p) => (
                <label key={p} className="flex items-center">
                  <input
                    type="radio"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="mr-2"
                  />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Attachments - Disabled until database schema is updated */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mb-3"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Attach Files
            </Button>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {mode === 'reply' ? 'Reply' : mode === 'forward' ? 'Forward' : 'Send'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageCompose;
