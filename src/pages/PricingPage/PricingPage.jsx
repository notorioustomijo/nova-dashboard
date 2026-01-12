export default function PricingPage({ onSelectPlan }) {
    const plans = [
        { id: 'trial', name: 'Free Trial', price: 0, duration: '7 days', features: ['100 conversations', 'Stores leads', 'Basic Analytics', 'Email support' ] },
        { id: 'starter', name: 'Starter', price: 45000, duration: '30 days', features: ['1,000 conversations', 'Stores leads', 'Advanced analytics', '5 RAG pages', 'Email support'] },
        { id: 'pro', name: 'Professional', price: 120000, duration: '30 days', features: ['5,000 conversations', 'Stores leads', 'Advanced analytics', '20 RAG pages', 'Priority email support', 'Custom Branding'] },
        { id: 'enterprise', name: 'Enterprise', price: 300000, duration: '30 days', features: ['Unlimited conversations', 'Stores leads', 'Advanced analytics', 'Unlimited RAG pages', 'Dedicated email support', 'Custom Branding', 'White Label'] },
    ];

    return (
        <div>
            {plans.map(plan => (
                <PricingCard 
                    key={plan.id}
                    plan={plan}
                    onSelect={() => onSelectPlan(plan.id)}
                />
            ))}
        </div>
    );
}

