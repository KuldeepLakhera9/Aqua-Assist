import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Video, Users, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const CommunicationHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('channels');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const { data: channels = [] } = useQuery({
    queryKey: ['communicationChannels'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/communication/channels');
      return response.data;
    }
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['channelMessages', selectedChannel?._id],
    queryFn: async () => {
      if (!selectedChannel) return [];
      const response = await axios.get(`/api/admin/rescuers/communication/channels/${selectedChannel._id}/messages`);
      return response.data;
    },
    enabled: !!selectedChannel
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['rescueTeams'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/rescuers/teams');
      return response.data;
    }
  });

  const createChannel = useMutation({
    mutationFn: async (channelData) => {
      const response = await axios.post('/api/admin/rescuers/communication/channels', channelData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communicationChannels']);
      onClose();
      toast.success('Channel Created');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create channel');
    }
  });

  const sendMessage = useMutation({
    mutationFn: async ({ channelId, messageData }) => {
      const response = await axios.post(`/api/admin/rescuers/communication/channels/${channelId}/messages`, messageData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelMessages', selectedChannel?._id]);
      setMessage('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send message');
    }
  });

  const handleCreateChannel = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const channelData = {
      name: formData.get('name'),
      type: formData.get('type'),
      teams: Array.from(e.target.teams?.selectedOptions || []).map(option => option.value),
      description: formData.get('description')
    };

    createChannel.mutate(channelData);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChannel) return;

    sendMessage.mutate({
      channelId: selectedChannel._id,
      messageData: {
        content: message,
        type: 'text'
      }
    });
  };

  return (
    <div className="space-y-4 text-app-text">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-app-text">Dispatch Communications</h3>
          <p className="text-xs text-app-muted">Real-time tactical communication channels</p>
        </div>
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Channel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-app-border space-x-2">
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'channels'
              ? 'border-primary-600 text-primary-600 dark:text-sky-400'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'direct'
              ? 'border-primary-600 text-primary-600 dark:text-sky-400'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Direct Messages
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'announcements'
              ? 'border-primary-600 text-primary-600 dark:text-sky-400'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Announcements
        </button>
      </div>

      {activeTab === 'channels' && (
        <div className="bg-app-card rounded-xl border border-app-card-border shadow-sm flex h-[580px] overflow-hidden">
          {/* Channels List */}
          <div className="w-64 border-r border-app-border p-3 flex flex-col space-y-1 overflow-y-auto bg-app-surface shrink-0">
            <div className="text-xs font-semibold text-app-muted uppercase tracking-wider px-2 py-1">
              Active Feeds
            </div>
            {channels.map((channel) => (
              <button
                key={channel._id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium text-left truncate transition-colors ${
                  selectedChannel?._id === channel._id
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-sky-300 font-semibold'
                    : 'text-app-muted hover:bg-app-hover hover:text-app-text'
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
            {channels.length === 0 && (
              <div className="text-center py-8 text-xs text-app-muted">
                No active channels
              </div>
            )}
          </div>

          {/* Chat Area */}
          {selectedChannel ? (
            <div className="flex-1 flex flex-col h-full bg-app-card">
              <div className="p-3.5 border-b border-app-border flex items-center justify-between bg-app-surface">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-app-text">{selectedChannel.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-950/40 dark:text-sky-300 dark:border-primary-800">
                    {selectedChannel.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors" title="Voice call">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors" title="Video call">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-hover transition-colors" title="Participants">
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg._id} className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-300 dark:border-primary-800 text-primary-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {msg.sender?.name ? msg.sender.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xs font-semibold text-app-text">{msg.sender?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-app-muted">
                          {msg.timestamp ? format(new Date(msg.timestamp), 'MMM d, HH:mm') : ''}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-app-text leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-xs text-app-muted">
                    No messages yet in this channel.
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-app-border flex items-center gap-2 bg-app-surface">
                <input
                  type="text"
                  placeholder="Type dispatch message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-app-input border border-app-input-border text-app-text text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={sendMessage.isPending}
                  className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-app-muted">
              <MessageCircle className="w-12 h-12 mb-2 text-app-muted opacity-40" />
              <p className="text-sm font-medium">Select a channel to start dispatch messaging</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'direct' && (
        <div className="bg-app-card rounded-xl border border-app-card-border p-8 text-center text-xs text-app-muted">
          Direct messaging is reserved for verified rescue officers.
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="bg-app-card rounded-xl border border-app-card-border p-8 text-center text-xs text-app-muted">
          Official disaster priority announcements will broadcast here.
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-app-card rounded-xl border border-app-card-border p-6 w-full max-w-md shadow-xl text-app-text">
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
              <h3 className="text-base font-bold text-app-text">Create New Channel</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-app-muted hover:text-app-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Channel Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Sector-4-Rescue-Coord"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Channel Type</label>
                <select
                  name="type"
                  defaultValue="team"
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="team">Team Channel</option>
                  <option value="emergency">Emergency Channel</option>
                  <option value="coordination">Coordination Channel</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Teams</label>
                <select
                  name="teams"
                  multiple
                  size={3}
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-app-muted uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Operational purpose of channel..."
                  className="w-full px-3 py-2 bg-app-input border border-app-input-border text-app-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-app-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-app-muted hover:text-app-text bg-app-surface border border-app-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createChannel.isPending}
                  className="px-4 py-2 font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  {createChannel.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationHub;