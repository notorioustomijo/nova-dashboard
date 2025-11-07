function getAuthHeaders() {
    const token = localStorage.getItem('nova_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

export async function fetchLeads() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/leads`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch leads');
    const data = await response.json();
    return data.leads || [];
}

export async function fetchConversations() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/conversations`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch conversations');
    const data = await response.json();
    return data.conversations || [];
}

export async function fetchConversationTranscript(sessionId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/conversations/${sessionId}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch transcript');
    const data = await response.json();
    return data.conversation || null;
}

export async function fetchMetrics() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/metrics`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch metrics');
    return response.json();
}

export async function fetchBusinessProfile() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/business-profile`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    const data = await response.json();
    return data.profile || null;
}

export async function updateBusinessProfile(profileData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/business-profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
    });

    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
}

export async function verifyEmail(token) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`, {
        method: 'POST'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
    }
    return response.json();
}

export async function resendVerificationEmail(email) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Failed to resend verification email');
    }
    return response.json();
}

export async function onboardBusiness(data) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/onboard`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to complete onboarding');
    return response.json();
}

export async function generateWidgetCode(userId) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const widgetUrl = import.meta.env.VITE_WIDGET_URL;
    
    // Get user's business name from localStorage
    const userData = JSON.parse(localStorage.getItem('nova_user') || '{}');
    const businessName = userData.business_name || 'Your Business';
    
    const widgetCode = `
    <!-- Nova AI Widget -->
    <script>
    window.NovaConfig = {
        userId: "${userId}",
        businessName: "${businessName}",
        apiUrl: "${apiUrl}"
    };
    </script>
    <script type="module" src="${widgetUrl}/widget.js"></script>
    <!-- End Nova AI Widget -->
    `;
    
    return widgetCode;
}

// Helper to export leads to CSV
export function exportLeadsToCSV(leads) {
    if (!leads || leads.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Intent', 'Date'];
    const rows = leads.map(lead => [
        lead.customer_name || 'N/A',
        lead.customer_email || 'N/A',
        lead.customer_phone || 'N/A',
        lead.intent || 'N/A',
        new Date(lead.timestamp).toLocaleDateString()
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Helper to format date/time
export function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Helper to format time only
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export const formatResponseTime = (milliseconds) => {
    if (!milliseconds || milliseconds === 0) return '0s';
    
    const seconds = (milliseconds / 1000).toFixed(2);
    return `${seconds}s`;
  };
  
export const formatTTFR = (milliseconds) => {
if (!milliseconds || milliseconds === 0) return '0.00s';

const seconds = (milliseconds / 1000).toFixed(2);
return `${seconds}s`;
};