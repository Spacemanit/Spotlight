import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SpotLightIssuesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalEntries = 200;
  const entriesPerPage = 8;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  // Sample data - in a real app, this would come from an API
  const issues = [
    {
      date: '27BR890',
      issueId: '0003478A',
      type: 'Electricity',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700068',
      verificationStatus: 'Suspicious',
      status: 'Completed',
      image: 'Click to view'
    },
    {
      date: '187AAH8',
      issueId: '000231B',
      type: 'Water',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700029',
      verificationStatus: 'Rejected',
      status: 'Incomplete',
      image: 'Click to view'
    },
    {
      date: '27BR890',
      issueId: '0003478A',
      type: 'Electricity',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700068',
      verificationStatus: 'Suspicious',
      status: 'Completed',
      image: 'Click to view'
    },
    {
      date: '187AAH8',
      issueId: '000231B',
      type: 'Water',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700029',
      verificationStatus: 'Rejected',
      status: 'Incomplete',
      image: 'Click to view'
    },
    {
      date: '27BR890',
      issueId: '0003478A',
      type: 'Electricity',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700068',
      verificationStatus: 'Suspicious',
      status: 'Completed',
      image: 'Click to view'
    },
    {
      date: '187AAH8',
      issueId: '000231B',
      type: 'Water',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700029',
      verificationStatus: 'Rejected',
      status: 'Incomplete',
      image: 'Click to view'
    },
    {
      date: '27BR890',
      issueId: '0003478A',
      type: 'Electricity',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700068',
      verificationStatus: 'Suspicious',
      status: 'Completed',
      image: 'Click to view'
    },
    {
      date: '187AAH8',
      issueId: '000231B',
      type: 'Water',
      description: 'Lorem Ipsum is simply dummy text of',
      zipcode: '700029',
      verificationStatus: 'Rejected',
      status: 'Incomplete',
      image: 'Click to view'
    }
  ];

  const getVerificationStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'Suspicious':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Incomplete':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'In Progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleImageClick = (issueId) => {
    console.log('Viewing image for issue:', issueId);
    // Handle image viewing logic
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">SpotLight</h1>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Registered issues by phone number
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Issue ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Verification status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Image</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {issues.map((issue, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.issueId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{issue.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{issue.description}</td>
                    <td className="px-6 py-4">
                      <span className={getVerificationStatusBadge(issue.verificationStatus)}>
                        {issue.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(issue.status)}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleImageClick(issue.issueId)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                      >
                        {issue.image}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startEntry}</span> of{' '}
              <span className="font-medium">{totalEntries}</span> entries
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-1 px-3 py-1 text-sm ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                } transition-colors`}
              >
                <ChevronLeft size={16} />
                <span>Last page</span>
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-1 px-3 py-1 text-sm ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                } transition-colors`}
              >
                <span>Next page</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}