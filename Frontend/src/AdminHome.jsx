import React from "react";

const HomePage = () => {
  const token = localStorage.getItem('token');

  const openAnalytics = () => {
    window.location.href = "/adminTable.html";
  };

  const openHeatmap = () => {
    window.location.href = "/";
    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3A364F] font-sans">
      <div className="flex flex-col md:flex-row bg-[#FAF9FF] w-full h-screen">
        {/* Left-side content block */}
        <div className="flex flex-1 flex-col justify-between p-12 lg:p-16">
          <div className="absolute top-8 left-8">
            <h1 className="text-3xl font-bold text-[#3A364F]">Spotlight</h1>
          </div>
          <div className="mt-50">
            <h1 className="text-[80px] md:text-5xl lg:text-6xl font-bold leading-tight text-[#3A364F]">
              Empowering our Community.
            </h1>
            <p className="mt-3 text-[28px] text-gray-600 max-w-[90%]">
              Empowering citizens to report, unite, and improve communities together.
            </p>
            <div className="flex space-x-4 mt-8">
              <button
                className="px-6 py-3 border-2 bg-[#3A364F] border-[#3A364F] text-[#FAF9FF] text-[22px] font-semibold rounded-2xl transition-colors hover:bg-[#FAF7FF] hover:text-[#3A364F] hover:border-[#3A364F]"
                onClick={openAnalytics}
              >
                See analytics
              </button>
            </div>
          </div>
        </div>

        {/* Right-side image block */}
      <div className="hidden lg:block w-1/2 m-6 bg-black rounded-[66px]">
        <img
          src="https://img.freepik.com/premium-photo/busy-indian-street-middle-day_896360-157.jpg?w=2000"
          alt="Beautiful Golden Temple at sunset"
          className="w-full h-full object-cover rounded-[60px]"
        />
      </div>
      </div>
    </div>
    
  );
};

export default HomePage;
