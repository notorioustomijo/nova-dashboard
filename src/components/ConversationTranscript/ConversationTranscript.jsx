import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { fetchConversationTranscript, formatTime } from '../../utils/api';
import styles from './ConversationTranscript.module.css';

export default function ConversationTranscript({ sessionId, isOpen, onClose }) {
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && sessionId) {
            loadTranscript();
        }
    }, [isOpen, sessionId]);

    const loadTranscript = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchConversationTranscript(sessionId);
            setConversation(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Conversation Transcript" size="large">
            {loading ? (
                <LoadingSpinner message="Loading conversation..." />
            ): error ? (
                <div className={styles.error}>
                    <p>Failed to load conversation: {error}</p>
                    <button onClick={loadTranscript} className={styles.retryBtn}>
                        Retry
                    </button>
                </div>
            ): conversation ? (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.meta}>
                            <span className={styles.metaItem}>
                                <strong>Session:</strong> {conversation.session_id}
                            </span>
                            <span className={styles.metaItem}>
                                <strong>Messages:</strong> {conversation.message_count || 0}
                            </span>
                            <span className={styles.metaItem}>
                                <strong>Started:</strong> {new Date(conversation.started_at).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className={styles.messagesContainer}>
                        {conversation.messages && conversation.messages.length > 0 ? (
                            conversation.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`${styles.message} ${
                                        msg.role === 'user' ? styles.messageUser : styles.messageAssistant
                                    }`}
                                >
                                    <div className={styles.messageHeader}>
                                        <span className={styles.messageSender}>
                                            {msg.role === 'user' ? '👤 Customer' : '👩🏾‍🦱 Nova'}
                                        </span>
                                        <span className={styles.messageTime}>
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                    <div className={styles.messageContent}>{msg.content}</div>
                                </div>
                            ))
                        ): (
                            <div className={styles.emptyState}>No messages in this conversation</div>
                        )}
                    </div>
                </div>
            ): (
                <div className={styles.emptyState}>No conversation data available</div>
            )}
        </Modal>
    )
}