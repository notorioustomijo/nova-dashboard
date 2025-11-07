import Modal from '../Modal/Modal';
import { formatDateTime } from '../../utils/api';
import styles from './LeadDetails.module.css';

export default function LeadDetails({ lead, isOpen, onClose}) {
    if (!lead) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="medium">
            <div className={styles.container}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Contact Information</h3>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Name</span>
                            <span className={styles.value}>{lead.customer_name || 'Not provided'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Email</span>
                            <span className={styles.value}>
                                {lead.customer_email ? (
                                    <a href={`mailto:${lead.customer_email}`} className={styles.link}>
                                        {lead.customer_email}
                                    </a>
                                ): (
                                    'Not provided'
                                )}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Phone</span>
                            <span className={styles.value}>
                                {lead.customer_phone ? (
                                    <a href={`tel:${lead.customer_phone}`} className={styles.link}>
                                        {lead.customer_phone}
                                    </a>
                                ): (
                                    'Not provided'
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Lead Information</h3>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Intent</span>
                            <span className={`${styles.badge} ${styles[lead.intent]}`}>
                                {lead.intent}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Session ID</span>
                            <span className={styles.valueSmall}>{lead.session_id}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.closeBtn}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    )
}