import React from "react";

const App = () => {
  const trackIssue = () => {
    window.location.href = "/tracking";
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8 md:p-16">
        <header className="absolute top-0 left-0 p-8">
          <h1 className="text-xl font-bold text-gray-800">SpotLight</h1>
        </header>
        <div className="flex flex-col items-center text-center mt-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Track Your Issue
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mb-10">
            Enter your tracking number or the phone number you provided to see
            the latest updates.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <label
              htmlFor="trackingId"
              className="w-full md:w-40 text-left md:text-right text-gray-700 font-medium"
            >
              Tracking ID :
            </label>
            <input
              type="text"
              id="trackingId"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
            className="px-6 py-3 border-2 border-[#3A364F] text-[#3A364F] font-semibold rounded-2xl transition-colors hover:bg-[#3A364F] hover:text-white"
            onClick={trackIssue}
          >
            Track issue using tracking ID
          </button>
          </div>
        </div>
        <div className="space-y-6 mt-5">
          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <label
              htmlFor="trackingId"
              className="w-full md:w-40 text-left md:text-right text-gray-700 font-medium"
            >
                Phone Number :
            </label>
            <input
              type="text"
              id="trackingId"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
            className="px-6 py-3 border-2 border-[#3A364F] text-[#3A364F] font-semibold rounded-2xl transition-colors hover:bg-[#3A364F] hover:text-white"
            onClick={trackIssue}
          >
            Track issue using phone number
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
