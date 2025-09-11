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
  const [backendEndpoint] = ['http://localhost:3000/admin/issues'];

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
      <div className="min-h-screen flex items-center justify-center text-xl text-[#3A364F] font-sans">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#3A364F] text-lg font-sans">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF] p-10 font-sans text-[#3A364F]">
      {/* Header */}
      <h1 className="absolute text-3xl font-bold text-[#3A364F] top-8 left-8">
        <a
          href="/spotlight"
          className=""
        >
          Spotlight
        </a>
      </h1>

      <div className="flex justify-center items-center mb-6 mt-12">
        <h2 className="text-[30px] font-bold">Admin Page</h2>
      </div>

      {/* Summary Cards */}
      <div className="flex space-x-6 mb-8 justify-center">
        {summaryData.map(({ label, count, color }) => (
          <div
            key={label}
            className="flex items-center space-x-3 rounded-lg border border-[#E0DEF0] bg-[#FAF9FF] py-3 px-6"
          >
            <span className={`${color} block w-3 h-3 rounded-full`} />
            <div>
              <div className="text-xs opacity-80">{label}</div>
              <div className="font-bold text-lg">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#FAF9FF] rounded-lg border border-[#E0DEF0]">
        <table className="min-w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-[#E0DEF0]">
              <th className="px-4 py-3 w-1/12">Date</th>
              <th className="px-4 py-3 w-1/12">Issue ID</th>
              <th className="px-4 py-3 w-1/12">Type</th>
              <th className="px-4 py-3 w-1/12">Title</th>
              <th className="px-4 py-3 w-2/12">Description</th>
              <th className="px-4 py-3 w-1/12">Status</th>
              <th className="px-4 py-3 w-1/12 text-center">Image</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr
                key={`${issue.issueId}-${idx}`}
                className="border-b border-[#E0DEF0] hover:bg-[#F1EEFF]"
              >
                <td className="px-4 py-3">{(issue.created_at || '').slice(0, 10)}</td>
                <td className="px-4 py-3">{issue.tracking_id}</td>
                <td className="px-4 py-3">{issue.category}</td>
                <td className="px-4 py-3">{issue.title}</td>
                <td className="px-4 py-3">{issue.description}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status] || 'bg-gray-200 text-gray-800'}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {issue.imageUrl ? (
                    <button
                      className="text-[#3A364F] underline text-sm hover:text-[#3A364F] focus:outline-none focus:ring-2 focus:ring-[#3A364F] focus:ring-offset-2 focus:ring-offset-[#FAF9FF]"
                      onClick={() => {
                        console.log(`http://localhost:3000/${(issue.imageUrl || '').slice(3, issue.imageUrl.length + 1)}`)
                        window.open(`http://localhost:3000/${(issue.imageUrl || '').slice(3, issue.imageUrl.length + 1)}`, '_blank')
                      }}
                    >
                      Click to view
                    </button>
                  ) : (
                    <span className="opacity-60">No Image</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex justify-between text-sm px-2">
        <div>
          Showing {Math.min(endIndex, totalEntries)} of {totalEntries} entries
        </div>
        <div className="flex items-center space-x-3">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className={`px-3 py-1 rounded border border-[#E0DEF0] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F1EEFF]'
              }`}
          >
            &lt; Last page
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className={`px-3 py-1 rounded border border-[#E0DEF0] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F1EEFF]'
              }`}
          >
            Next page &gt;
          </button>
        </div>
      </div>
    </div>
  );
}