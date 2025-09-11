import React, { useState, useEffect } from 'react';

const summaryData = [
  { label: 'Total reports reports', count: 4, color: 'bg-blue-400' },
  { label: 'Total pending reports', count: 2, color: 'bg-yellow-400' },
  { label: 'Total completed reports', count: 3, color: 'bg-green-400' },
  { label: 'Total incomplete reports', count: 1, color: 'bg-red-400' },
];

const verificationStatusColors = {
  Suspicious: 'bg-yellow-200 text-yellow-800',
  Rejected: 'bg-red-200 text-red-800',
  Approved: 'bg-green-200 text-green-800',
};

const statusColors = {
  Completed: 'bg-green-200 text-green-800',
  Incomplete: 'bg-red-200 text-red-800',
  Pending: 'bg-red-200 text-red-800',
  'In Progress': 'bg-blue-200 text-blue-800',
};

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendEndpoint] = ['http://localhost:3000/admin/issues']

  const entriesPerPage = 8;
  const totalEntries = issues.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentIssues = issues.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(backendEndpoint);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setIssues(data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [`http://localhost:3000/admin/issues`]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fc] p-10 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">SpotLight</h1>
        <h2 className="text-lg font-semibold">Admin Page</h2>
      </div>

      {/* Summary Cards */}
      <div className="flex space-x-6 mb-8">
        {summaryData.map(({ label, count, color }) => (
          <div
            key={label}
            className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white py-3 px-6"
          >
            <span className={`${color} block w-3 h-3 rounded-full`} />
            <div>
              <div className="text-xs text-gray-600">{label}</div>
              <div className="font-bold text-lg">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-300 shadow">
        <table className="min-w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-3 w-1/12">Date</th>
              <th className="px-4 py-3 w-1/12">Issue ID</th>
              <th className="px-4 py-3 w-1/12">Type</th>
              <th className="px-4 py-3 w-1/12">Title</th>
              <th className="px-4 py-3 w-2/12">Description</th>
              <th className="px-4 py-3 w-2/12">Verification status</th>
              <th className="px-4 py-3 w-1/12">Status</th>
              <th className="px-4 py-3 w-1/12 text-center">Image</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr
                key={`${issue.issueId}-${idx}`}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{issue.date}</td>
                <td className="px-4 py-3">{issue.issueId}</td>
                <td className="px-4 py-3">{issue.type}</td>
                <td className="px-4 py-3">{issue.title}</td>
                <td className="px-4 py-3">{issue.description}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${verificationStatusColors[issue.verificationStatus] || 'bg-gray-200 text-gray-800'}`}
                  >
                    {issue.verificationStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status] || 'bg-gray-200 text-gray-800'}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {issue.image ? (
                    <button
                      className="text-blue-600 underline text-sm hover:text-blue-800 focus:outline-none"
                      onClick={() => alert(`View image for issue ${issue.issueId}`)}
                    >
                      Click to view
                    </button>
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex justify-between text-gray-600 text-sm px-2">
        <div>
          Showing {Math.min(endIndex, totalEntries)} of {totalEntries} entries
        </div>
        <div className="flex items-center space-x-3">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
          >
            &lt; Last page
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
          >
            Next page &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
