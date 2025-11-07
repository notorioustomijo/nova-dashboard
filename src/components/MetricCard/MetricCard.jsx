import styles from './MetricCard.module.css';

export default function MetricCard({
    title,
    value,
    icon,
    trend,
    trendLabel
}) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <span className={styles.icon}>{icon}</span>
                    <h3 className={styles.title}>{title}</h3>
                </div>
                {trend && (
                    <div className={`${styles.trend} ${trend > 0 ? styles.trendUp : styles.trendDown }`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className={styles.value}>{value}</div>
            {trendLabel && <div className={styles.trendLabel}>{trendLabel}</div>}
        </div>
    )
}