export async function InitializePayment(plan, email) {
    const response = await fetch(`${API_URL}/payments/initialize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ plan, email, currency: 'NGN' })
    });

    const data = await response.json();
    // Redirect to Paystack
    window.location.href = data.authorization_url;
}