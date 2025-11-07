import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size='medium', message='Loading...'}) {
    return (
        <div className={styles.container}>
            <div className={`${styles.spinner} ${styles[size]}`}></div>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    )
}