import { supabase } from './supabase';
import { createNotification } from './notifications';

export interface InternalMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  recipient_id?: string; // null for broadcast to all
  recipient_name?: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  reply_to?: string; // ID of the message this is replying to
  forwarded_from?: string; // ID of the message this is forwarded from
  attachments?: MessageAttachment[];
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  recipient_id: string;
  recipient_email: string;
  is_read: boolean;
  read_at?: string;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

// Upload file attachment
export const uploadMessageAttachment = async (file: File, messageId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${messageId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('message-attachments')
      .upload(fileName, file);

    if (error) throw error;

    // Save attachment record to database
    const { data: attachmentData, error: attachmentError } = await supabase
      .from('message_attachments')
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_path: data.path,
        file_size: file.size,
        file_type: file.type
      })
      .select()
      .single();

    if (attachmentError) throw attachmentError;

    return attachmentData;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

// Get file URL
export const getAttachmentUrl = (filePath: string) => {
  return supabase.storage
    .from('message-attachments')
    .getPublicUrl(filePath).data.publicUrl;
};

// Send message to team members
export const sendInternalMessage = async (message: {
  sender_id: string;
  sender_name: string;
  sender_email: string;
  recipient_id?: string; // undefined for broadcast
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  reply_to?: string;
  forwarded_from?: string;
  attachments?: File[];
}) => {
  try {
    // Get all active team members if no specific recipient
    let recipients: any[] = [];
    if (!message.recipient_id) {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, email, name')
        .eq('is_active', true)
        .neq('id', message.sender_id); // Don't send to sender
      
      if (error) throw error;
      recipients = data || [];
    } else {
      // Get specific recipient
      const { data, error } = await supabase
        .from('team_members')
        .select('id, email, name')
        .eq('id', message.recipient_id)
        .single();
      
      if (error) throw error;
      recipients = [data];
    }

    // Create the main message
    const { data: messageData, error: messageError } = await supabase
      .from('internal_messages')
      .insert({
        sender_id: message.sender_id,
        sender_name: message.sender_name,
        sender_email: message.sender_email,
        recipient_id: message.recipient_id || null,
        subject: message.subject,
        message: message.message,
        priority: message.priority,
        is_read: false
        // Note: reply_to and forwarded_from will be added when schema is updated
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Create message recipients
    const recipientData = recipients.map(recipient => ({
      message_id: messageData.id,
      recipient_id: recipient.id,
      recipient_email: recipient.email,
      is_read: false
    }));

    const { error: recipientError } = await supabase
      .from('message_recipients')
      .insert(recipientData);

    if (recipientError) throw recipientError;

    // Create notifications for recipients
    try {
      for (const recipient of recipients) {
        await createNotification({
          user_id: recipient.id,
          title: 'New Message',
          message: `New message from ${message.sender_name}: ${message.subject}`,
          type: 'message',
          action_url: '/dashboard/messages'
        });
      }
    } catch (notificationError) {
      console.error('Failed to create notifications:', notificationError);
      // Don't throw here - message was sent successfully
    }

    return {
      success: true,
      message: messageData,
      recipients: recipients.length
    };
  } catch (error) {
    console.error('Error sending internal message:', error);
    throw error;
  }
};

// Get messages for a specific user
export const getUserMessages = async (userId: string, unreadOnly = false) => {
  try {
    const query = supabase
      .from('message_recipients')
      .select(`
        *,
        internal_messages (
          id,
          sender_name,
          sender_email,
          sender_id,
          subject,
          message,
          priority,
          created_at,
          reply_to,
          forwarded_from
        )
      `)
      .eq('recipient_id', userId);

    if (unreadOnly) {
      query.eq('is_read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      ...item.internal_messages,
      recipient_id: item.recipient_id,
      is_read: item.is_read,
      read_at: item.read_at,
      attachments: [], // Empty for now until attachments table is added
      sender_name: item.profiles?.name || 'Unknown',
      sender_avatar: item.profiles?.avatar_url || ''
    }));
  } catch (error) {
    console.error('Error fetching user messages:', error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('message_recipients')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('message_id', messageId)
      .eq('recipient_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Get all team members for recipient selection (including admins)
export const getTeamMembers = async () => {
  try {
    // For now, just get team members
    // Admin functionality will be added when users table is properly set up
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, email, role, is_active')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    // Mark all as team members for now
    const allMembers = (data || []).map((member: any) => ({
      ...member,
      type: 'team_member'
    }));

    return allMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

// Get message statistics
export const getMessageStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('message_recipients')
      .select('is_read')
      .eq('recipient_id', userId);

    if (error) throw error;

    const total = data?.length || 0;
    const unread = data?.filter((item: any) => !item.is_read).length || 0;
    const read = total - unread;

    return { total, unread, read };
  } catch (error) {
    console.error('Error fetching message stats:', error);
    throw error;
  }
};
