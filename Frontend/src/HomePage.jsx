import React from "react";

const HomePage = () => {
  const openIssuePage = () => {
    window.location.href = "/issue";
  };

  const openTrackingPage = () => {
    window.location.href = "/tracking";
    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3A364F] font-sans">
      <div className="flex flex-col md:flex-row bg-white w-full h-screen">
        {/* Left-side content block */}
        <div className="flex flex-1 flex-col justify-between p-12 lg:p-16">
          <div className="absolute top-8 left-8">
            <h1 className="text-3xl font-bold text-[#3A364F]">Spotlight</h1>
          </div>
          <div className="mt-52">
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Empowering Our Community.
            </h1>
            <p className="mt-7 text-3xl text-gray-500 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex space-x-4 mt-8">
              <button
                className="px-6 py-3 bg-[#3A364F] text-white font-semibold rounded-2xl shadow-lg transition-transform hover:scale-105"
                onClick={openIssuePage}
              >
                Report an issue
              </button>
              <button
                className="px-6 py-3 border-2 border-[#3A364F] text-[#3A364F] font-semibold rounded-2xl transition-colors hover:bg-[#3A364F] hover:text-white"
                onClick={openTrackingPage}
              >
                Track an issue
              </button>
            </div>
          </div>

          <div className="flex justify-center text-sm text-[#3A364F] mt-44">
            scroll down
          </div>
          <div className="flex justify-center text-sm text-[#3A364F]">V</div>
        </div>

        {/* Right-side image block */}
        <div
          className="hidden lg:block w-1/2 m-6 bg-black rounded-[66px]"
          alt="Random Street Image"
          style={{
            backgroundImage: `url('https://img.freepik.com/premium-photo/busy-indian-street-middle-day_896360-157.jpg?w=2000')`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default HomePage;
