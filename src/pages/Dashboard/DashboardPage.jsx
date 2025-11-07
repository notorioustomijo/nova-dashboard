import { useState, useEffect } from 'react';
import MetricCard from '../../components/MetricCard/MetricCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import QuickSetupGuide from '../../components/QuickSetupGuide/QuickSetupGuide';
import {
    fetchLeads,
    fetchConversations,
    fetchMetrics,
    formatDateTime
} from '../../utils/api';
import styles from './Dashboard.module.css';

export default function DashboardPage({ onNavigate }) {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);
    const [recentLeads, setRecentLeads] = useState([]);
    const [recentConversations, setRecentConversations] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [metricsData, leadsData, conversationsData] = await Promise.all([
                fetchMetrics(),
                fetchLeads(),
                fetchConversations()
            ]);

            setMetrics(metricsData);
            setRecentLeads(leadsData.slice(0, 5));
            setRecentConversations(conversationsData.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <title>Dashboard - Nova</title>
            <meta name="description" content="Get an overview of your Nova AI chat agent's performance, including key metrics, recent leads, and conversations." />
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageDescription}>
                        Overview of Nova's performance
                    </p>
                </div>

                <button
                    onClick={() => onNavigate('settings')}
                    className={styles.widgetButton}
                >
                    🚀 Get Widget Code
                </button>
            </div>

            <QuickSetupGuide onNavigate={onNavigate} />

            {/* Metrics Cards */}
            <div className={styles.metricsGrid}>
                <MetricCard 
                    title="Total Leads"
                    value={metrics?.total_leads || 0}
                    icon="📋"
                />
                <MetricCard 
                    title="Conversations"
                    value={metrics?.total_conversations || 0}
                    icon="💬"
                />
                <MetricCard 
                    title="Avg Response Time"
                    value={`${metrics?.avg_ttfr_ms || 0}ms`}
                    icon="⚡️"
                />
                <MetricCard 
                    title="Capture Rate"
                    value={`${metrics?.capture_rate || 0}%`}
                    icon="🎯"
                />
            </div>

            {/* Recent Sections - Side by Side */}
            <div className={styles.recentSections}>
                {/* Recent Leads */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Leads</h2>
                        <button
                            onClick={() => onNavigate('leads')}
                            className={styles.viewAllBtn}
                        >
                            View All →
                        </button>
                    </div>

                    {recentLeads.length > 0 ? (
                        <div className={styles.card}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Intent</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLeads.map((lead, index) => (
                                        <tr key={index}>
                                            <td className={styles.nameCell}>
                                                {lead.customer_name || 'N/A'}
                                            </td>
                                            <td>
                                                {lead.customer_email || lead.customer_phone || 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${styles[lead.intent]}`}>
                                                    {lead.intent}
                                                </span>
                                            </td>
                                            <td className={styles.dateCell}>
                                                {formatDateTime(lead.timestamp)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No leads captured yet</p>
                        </div>
                    )}
                </div>

                {/* Recent Conversations */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Conversations</h2>
                        <button
                            onClick={() => onNavigate("conversations")}
                            className={styles.viewAllBtn}
                        >
                            View All →
                        </button>
                    </div>

                    {recentConversations.length > 0 ? (
                        <div className={styles.card}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Session ID</th>
                                        <th>Messages</th>
                                        <th>Started</th>
                                        <th>Last Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentConversations.map((conv, index) => (
                                        <tr key={index}>
                                            <td className={styles.sessionCell}>
                                                {conv.session_id.substring(0,8)}...
                                            </td>
                                            <td>{conv.message_count || 0}</td>
                                            <td className={styles.dateCell}>
                                                {formatDateTime(conv.started_at)}
                                            </td>
                                            <td className={styles.dateCell}>
                                                {formatDateTime(conv.last_activity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No conversations yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}