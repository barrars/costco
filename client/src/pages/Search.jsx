import { useState } from 'react';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/analytics/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Item Search</h1>
      <p>Search for items across all your receipts. Find every purchase instance with dates and prices.</p>

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items (e.g., 'coffee', 'trout', 'shelf')..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {hasSearched && (
        <div style={{ marginBottom: '20px' }}>
          <h3>
            {isLoading ? 'Searching...' : `Found ${searchResults.length} purchase${searchResults.length !== 1 ? 's' : ''}`}
          </h3>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1 }}>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'left' }}>Item</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'left' }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'center' }}>Quantity</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'right' }}>Unit Price</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'right' }}>Total Paid</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'center' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'center' }}>Location</th>
                <th style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'center' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <div style={{ fontWeight: 'bold' }}>{result.item.itemActualName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>#{result.item.itemNumber}</div>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <div>{result.item.itemDescription01}</div>
                    {result.item.itemDescription02 && (
                      <div style={{ fontSize: '12px', color: '#666' }}>{result.item.itemDescription02}</div>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {result.item.quantity}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                    ${result.item.unitPrice?.toFixed(2) || 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                    ${result.item.amount?.toFixed(2) || 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {formatDate(result.transactionDateTime)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {result.warehouseCity}, {result.warehouseState}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {result.receiptType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && hasSearched && searchResults.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No items found</h3>
          <p>Try a different search term or check your spelling.</p>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Search Tips:</h4>
        <ul>
          <li>Search for item names, descriptions, or partial words</li>
          <li>Examples: "coffee", "trout", "shelf", "organic", "kirkland"</li>
          <li>Minimum 2 characters required</li>
          <li>Results show every purchase instance with dates and prices</li>
        </ul>
      </div>
    </div>
  );
}

export default Search;