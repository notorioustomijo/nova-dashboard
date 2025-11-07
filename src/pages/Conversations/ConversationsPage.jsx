// pages/Conversations/ConversationsPage.jsx
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ConversationTranscript from '../../components/ConversationTranscript/ConversationTranscript';
import { fetchConversations, formatDateTime } from '../../utils/api';
import styles from './Conversations.module.css';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all | with-contact | without-contact

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [conversations, filter]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await fetchConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...conversations];

    // Note: We're checking if conversations have associated leads
    // You might need to add a 'has_contact' field to conversations in backend
    if (filter === 'with-contact') {
      // For now, we'll just show all (backend should add this field)
      filtered = conversations;
    } else if (filter === 'without-contact') {
      // For now, we'll just show all (backend should add this field)
      filtered = conversations;
    }

    setFilteredConversations(filtered);
  };

  const handleRowClick = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner message="Loading conversations..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <title>Conversations - Nova</title>
      <meta name="description" content="View and analyze recent conversations handled by your Nova AI chat agent, with filters and transcripts." />
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Conversations</h1>
          <p className={styles.pageDescription}>
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
          >
            All Conversations
          </button>
          <button
            onClick={() => setFilter('with-contact')}
            className={`${styles.filterTab} ${filter === 'with-contact' ? styles.filterTabActive : ''}`}
          >
            With Contact Info
          </button>
          <button
            onClick={() => setFilter('without-contact')}
            className={`${styles.filterTab} ${filter === 'without-contact' ? styles.filterTabActive : ''}`}
          >
            Without Contact Info
          </button>
        </div>
      </div>

      {filteredConversations.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Messages</th>
                <th>Started</th>
                <th>Last Activity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conv, index) => (
                <tr key={index} className={styles.clickableRow}>
                  <td className={styles.sessionCell}>
                    {conv.session_id.substring(0, 12)}...
                  </td>
                  <td>
                    <span className={styles.messageCount}>
                      {conv.message_count || 0} messages
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {formatDateTime(conv.started_at)}
                  </td>
                  <td className={styles.dateCell}>
                    {formatDateTime(conv.last_activity)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleRowClick(conv.session_id)}
                      className={styles.viewBtn}
                    >
                      View Transcript
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>
            {filter !== 'all'
              ? 'No conversations match this filter'
              : 'No conversations yet'}
          </p>
        </div>
      )}

      <ConversationTranscript
        sessionId={selectedSessionId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}