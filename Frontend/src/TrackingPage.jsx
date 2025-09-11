import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

// Main App Component
export default function TrackingPage() {
  const [currentView, setCurrentView] = useState('tracker'); // 'tracker' or 'results'
  const [searchType, setSearchType] = useState(''); // 'tracking' or 'phone'
  const [searchValue, setSearchValue] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ip = 'http://localhost:3000';

  const resetApp = () => {
    setCurrentView('tracker');
    setSearchType('');
    setSearchValue('');
    setIssues([]);
    setError('');
  };

  // API call functions
  const fetchIssueByTracking = async (trackingId) => {
    try {
      const response = await fetch(`${ip}/issue/track/${trackingId}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'No issue found with this tracking ID' : 'Error fetching issue');
      }
      const issue = await response.json();
      return [issue]; // Return as array for consistency
    } catch (err) {
      throw new Error("fetchingissuebytid"+err.message);
    }
  };

  const fetchIssuesByPhone = async (phone) => {
    try {
      const response = await fetch(`${ip}/issue/phone/${phone}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'No issues found for this phone number' : 'Error fetching issues');
      }
      const issues = await response.json();
      return issues;
    } catch (err) {
      throw new Error("fetchingissuebypo"+err.message);
    }
  };

  const handleSearch = async (type, value) => {
    if (!value.trim()) return;

    setLoading(true);
    setError('');
    setSearchType(type);
    setSearchValue(value);

    try {
      let fetchedIssues;
      if (type === 'tracking') {
        fetchedIssues = await fetchIssueByTracking(value.trim());
      } else {
        fetchedIssues = await fetchIssuesByPhone(value.trim());
      }
      
      setIssues(fetchedIssues);
      setCurrentView('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (currentView === 'tracker') {
    return <TrackerForm onSearch={handleSearch} loading={loading} error={error} />;
  } else {
    return (
      <ResultsTable 
        issues={issues} 
        searchType={searchType} 
        searchValue={searchValue} 
        onBack={resetApp} 
      />
    );
  }
}

// Tracker Form Component
function TrackerForm({ onSearch, loading, error }) {
  const [trackingId, setTrackingId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleTrackingSubmit = () => {
    onSearch('tracking', trackingId);
  };

  const handlePhoneSubmit = () => {
    onSearch('phone', phoneNumber);
  };

  const handleKeyPress = (e, submitFunction) => {
    if (e.key === 'Enter') {
      submitFunction();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">SpotLight</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Track Your Issue
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Enter your tracking number or the phone number<br />
              you provided to see the latest updates.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form Section */}
          <div className="space-y-8">
            {/* Tracking ID Input */}
            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-700">
                Tracking ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleTrackingSubmit)}
                  disabled={loading}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-12 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter tracking ID"
                />
                <button
                  onClick={handleTrackingSubmit}
                  disabled={loading || !trackingId.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:text-gray-300"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-4 text-gray-500 font-medium">OR</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-700">
                Phone No.
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handlePhoneSubmit)}
                  disabled={loading}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-12 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter phone number"
                />
                <button
                  onClick={handlePhoneSubmit}
                  disabled={loading || !phoneNumber.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:text-gray-300"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Results Table Component
function ResultsTable({ issues, searchType, searchValue, onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;
  const totalEntries = issues.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Paginate issues
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentIssues = issues.slice(startIndex, endIndex);

  const getVerificationStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status?.toLowerCase()) {
      case 'suspicious':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status?.toLowerCase()) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'incomplete':
      case 'pending':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'in progress':
      case 'in_progress':
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const startEntry = startIndex + 1;
  const endEntry = Math.min(endIndex, totalEntries);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">SpotLight</h1>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              {searchType === 'tracking' 
                ? `Issue Details for Tracking ID: ${searchValue}`
                : `Registered issues for phone number: ${searchValue}`
              }
            </h2>
            <p className="text-sm text-gray-600 text-center mt-1">
              Found {totalEntries} issue{totalEntries !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Issue ID</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Type</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Description</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Zipcode</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Verification Status</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Image</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentIssues.map((issue, index) => (
                  <tr key={issue._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {formatDate(issue.date || issue.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {issue.tracking_id || issue.issue_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize text-center">
                      {issue.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs text-center">
                      <div className="truncate" title={issue.description}>
                        {issue.description || 'No description available'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {issue.zipcode || issue.zip_code || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={getVerificationStatusBadge(issue.verification_status || issue.verificationStatus)}>
                        {issue.verification_status || issue.verificationStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={getStatusBadge(issue.status)}>
                        {issue.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {issue.image_url || issue.imageUrl ? (
                        <button
                          onClick={() => handleImageClick(issue.tracking_id || issue._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors text-center"
                        >
                          Click to view
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm text-center">No image</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-[#3A364F]">
                Showing <span className="font-medium">{startEntry}</span> to{' '}
                <span className="font-medium">{endEntry}</span> of{' '}
                <span className="font-medium">{totalEntries}</span> entries
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-1 px-3 py-1 text-sm ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#3A364F] hover:text-[#3A3646]'
                  } transition-colors`}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                
                <span className="text-sm text-[#3A364F]">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-1 px-3 py-1 text-sm ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#3A364F] hover:text-[#3A3646]'
                  } transition-colors`}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}