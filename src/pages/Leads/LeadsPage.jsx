// pages/Leads/LeadsPage.jsx
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import LeadDetails from '../../components/LeadDetails/LeadDetails';
import { fetchLeads, exportLeadsToCSV, formatDateTime } from '../../utils/api';
import styles from './Leads.module.css';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntent, setFilterIntent] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [leads, searchTerm, filterIntent, sortBy]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await fetchLeads();
      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        (lead.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.customer_phone?.includes(searchTerm))
      );
    }

    // Intent filter
    if (filterIntent !== 'all') {
      filtered = filtered.filter(lead => lead.intent === filterIntent);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'date-asc':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'name-asc':
          return (a.customer_name || '').localeCompare(b.customer_name || '');
        case 'name-desc':
          return (b.customer_name || '').localeCompare(a.customer_name || '');
        default:
          return 0;
      }
    });

    setFilteredLeads(filtered);
  };

  const handleRowClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    exportLeadsToCSV(filteredLeads);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner message="Loading leads..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <title>Leads - Nova</title>
      <meta name="description" content="Manage and export leads captured by Nova, with search, filters, and intent-based sorting." />
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageDescription}>
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} captured
          </p>
        </div>
        <button 
          onClick={handleExport} 
          disabled={filteredLeads.length === 0}
          className={`${styles.exportBtn} ${filteredLeads.length === 0 ? styles.exportBtnDisabled : ''}`}
        >
          📥 Export CSV
        </button>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={filterIntent}
          onChange={(e) => setFilterIntent(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Intents</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
          <option value="general">General</option>
          <option value="feedback">Feedback</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.select}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>

      {filteredLeads.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Intent</th>
                <th>Captured</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(lead)}
                  className={styles.clickableRow}
                >
                  <td className={styles.nameCell}>
                    {lead.customer_name || 'N/A'}
                  </td>
                  <td className={styles.emailCell}>
                    {lead.customer_email || 'N/A'}
                  </td>
                  <td className={styles.phoneCell}>
                    {lead.customer_phone || 'N/A'}
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
          <p>
            {searchTerm || filterIntent !== 'all'
              ? 'No leads match your filters'
              : 'No leads captured yet'}
          </p>
        </div>
      )}

      <LeadDetails
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}