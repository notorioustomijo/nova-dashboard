import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import MetricCard from '../../components/MetricCard/MetricCard';
import { fetchMetrics } from '../../utils/api';
import styles from './Metrics.module.css';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await fetchMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format milliseconds to seconds
  const formatToSeconds = (ms) => {
    if (!ms || ms === 0) return '0.00s';
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner message="Loading metrics..." />
      </div>
    );
  }

  const hasData = metrics && (metrics.total_conversations > 0 || metrics.total_leads > 0);

  return (
    <div className={styles.page}>
      <title>Metrics - Nova</title>
      <meta name="description" content="Access analytics and insights on Nova's performance, including capture rates, response times, and key stats." />
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Metrics</h1>
        <p className={styles.pageDescription}>
          Analytics and performance insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Conversations"
          value={metrics?.total_conversations || 0}
          icon="💬"
        />
        <MetricCard
          title="Total Leads"
          value={metrics?.total_leads || 0}
          icon="📋"
        />
        <MetricCard
          title="Lead Capture Rate"
          value={`${metrics?.capture_rate || 0}%`}
          icon="🎯"
        />
        <MetricCard
          title="Avg Response Time"
          value={formatToSeconds(metrics?.avg_ttfr_ms)}
          icon="⚡"
        />
      </div>

      {/* Performance Overview */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance Overview</h2>
        <div className={styles.card}>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Conversations</span>
              <span className={styles.statValue}>{metrics?.total_conversations || 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Leads Captured</span>
              <span className={styles.statValue}>{metrics?.total_leads || 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Conversion Rate</span>
              <span className={styles.statValue}>{metrics?.capture_rate || 0}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Avg Time to First Response</span>
              <span className={styles.statValue}>{formatToSeconds(metrics?.avg_ttfr_ms)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Response Time Breakdown */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Response Time Analysis</h2>
        <div className={styles.card}>
          <div className={styles.responseTimeInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Target Response Time</span>
              <span className={styles.infoValue}>{'<'} 10s</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Current Average TTFR</span>
              <span className={styles.infoValue}>
                {hasData ? formatToSeconds(metrics?.avg_ttfr_ms) : 'No data yet'}
              </span>
            </div>
            {hasData && metrics?.avg_ttfr_ms > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status</span>
                <span className={`${styles.badge} ${
                  metrics.avg_ttfr_ms < 10000 ? styles.badgeSuccess : styles.badgeWarning
                }`}>
                  {metrics.avg_ttfr_ms < 10000 ? 'Excellent' : 'Needs Improvement'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Insights</h2>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>📈</div>
            <h3 className={styles.insightTitle}>Capture Rate</h3>
            <p className={styles.insightText}>
              {metrics?.capture_rate >= 50
                ? `Great job! ${metrics.capture_rate}% of conversations result in lead capture.`
                : hasData 
                  ? `Current rate: ${metrics?.capture_rate || 0}%. Consider optimizing your conversation flow.`
                  : 'Start conversations to see your capture rate here.'}
            </p>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>⚡</div>
            <h3 className={styles.insightTitle}>Response Speed</h3>
            <p className={styles.insightText}>
              {!hasData
                ? 'Response time metrics will appear once you have conversations.'
                : (metrics?.avg_ttfr_ms || 0) < 10000
                  ? 'Your response time is excellent! Keep it up.'
                  : 'Consider optimizing your prompts to improve response time.'}
            </p>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>💬</div>
            <h3 className={styles.insightTitle}>Conversations</h3>
            <p className={styles.insightText}>
              {hasData 
                ? `You've handled ${metrics?.total_conversations || 0} conversation${(metrics?.total_conversations || 0) !== 1 ? 's' : ''} so far.`
                : 'No conversations yet. Share your widget link to start engaging with customers!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}