import styles from './PricingCard.module.css';

export default function PricingCard({ plan, onSelect, isSelected }) {
    return (
        <div
            style={{...styles.card, ...(isSelected ? styles.cardSelected : {}), ...(plan.featured ? styles.cardFeatured : {})}}
            onClick={onSelect}
        >
            {plan.featured && (
                <div style={styles.featuredBadge}>Most Popular</div>
            )}

            <div style={styles.cardHeader}>
                <h3 style={styles.planName}>{plan.name}</h3>
                <div style={styles.priceContainer}>
                    {plan.price === 0 ? (
                        <span style={styles.priceText}>Free</span>
                    ): (
                        <>
                            <span style={styles.currency}>₦</span>
                            <span style={styles.price}>{plan.price.toLocaleString}</span>
                            <span style={styles.period}>/{plan.duration}</span>
                        </>
                    )}
                </div>
            </div>

            <ul style={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                    <li key={idx} style={styles.featureItem}>
                        <span style={styles.checkmark}>✓</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                style={{
                    ...styles.selectButton,
                    ...(isSelected ? styles.selectButtonActive : {}),
                    ...(plan.featured ? styles.selectButtonFeatured: {})
                }}
            >
                {isSelected ? '✓ Selected': `Select ${plan.name}`}
            </button>
        </div>
    )
}