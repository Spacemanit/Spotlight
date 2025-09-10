import { useState } from 'react';
import HomePage from './HomePage';

const LoginPage = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleGetOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Backend Script Simulation ---
    // In a real application, you would make an API call here to your backend script
    // to send an OTP to the `phoneNumber` you've captured.
    // e.g., fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) })
    // For this example, we'll simulate a 1.5-second network delay.
    setTimeout(() => {
      console.log(`Sending OTP to ${phoneNumber}... (Simulated)`);
      setIsOTPSent(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Backend Script Simulation ---
    // In a real application, you would make an API call here to your backend script
    // to verify the `otp` and log the user in.
    // e.g., fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) })
    // We'll simulate a successful login after a 1.5-second delay.
    setTimeout(() => {
      console.log('Verifying OTP and signing in... (Simulated)');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleAnonymousLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Backend Script Simulation ---
    // Simulate an anonymous login call.
    // In a real application, this would be an API call to create or authenticate
    // a temporary anonymous user.
    setTimeout(() => {
      console.log('Logging in anonymously... (Simulated)');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1500);
  };

  // Conditionally render the Home Page after successful login
  if (isLoggedIn) {
    localStorage.setItem('phone', phoneNumber);
    window.location.href = '/homepage';
    return null;
  }

  const handleOtpChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '').slice(0, 7);
    const formattedValue = numericValue.split('').join(' • ');
    setOtp(formattedValue);
  };

  // Render the login form otherwise
  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Column - Form Section */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center rounded-l-2xl">
        {/* Spotlight Title */}
        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-[#3A364F]">Spotlight</h1>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-sm px-6 py-8">
          <h2 className="text-4xl font-bold mb-8 text-[#3A364F]">Hello, <br /> Welcome Back</h2>

          {/* Form Fields */}
          <form className="flex flex-col space-y-4">
            {/* Phone Number Input */}
            <div>
              <input
                type="tel"
                placeholder="9892342310"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#3A364F] focus:outline-none focus:border-blue-500 transition-all rounded-2xl"
              />
            </div>
            {/* Conditional input field based on state */}
            <div>
              <input
                type="text"
                placeholder="0 • 0 • 0 • 0 • 0 • 0"
                value={otp}
                onChange={handleOtpChange}
                className="w-full px-4 py-3 border-2 tracking-[0.4em] text-center border-[#3A364F] focus:outline-none focus:border-blue-500 transition-all rounded-2xl"
              />
            </div>

            {/* Remember Me and Resend OTP */}
            <div className="flex justify-between items-center text-sm text-[#3A364F]">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-[#3A364F]" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:underline">Resend OTP</a>
            </div>

            {/* Conditional button based on state and loading */}
            {isOTPSent ? (
              <div className="flex space-x-4 my-20">
                <button
                  type="submit"
                  onClick={handleSignIn}
                  className={`flex-1 px-4 py-3 font-semibold rounded-2xl shadow-md transition-colors ${isLoading ? 'bg-[#3A364F] cursor-not-allowed' : 'bg-[#3A364F] hover:bg-[#2B283C] text-white'
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <button
                  onClick={handleAnonymousLogin}
                  className={`flex-1 px-4 py-3 font-semibold rounded-2xl shadow-md transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Anonymous'}
                </button>
              </div>
            ) : (
              <div className="flex space-x-4 my-20">
                <button
                  type="submit"
                  onClick={handleGetOTP}
                  className={`flex-1 px-4 py-3 font-semibold rounded-2xl shadow-md transition-colors ${isLoading ? 'bg-[#3A364F]cursor-not-allowed' : 'bg-[#3A364F] hover:bg-[#2B283C] text-white'
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Getting OTP' : 'Get OTP'}
                </button>
                <a
                  href="#"
                  onClick={handleAnonymousLogin}
                  className={`flex-1 flex items-center justify-center text-[#3A364F] text-sm transition-colors ${isLoading ? 'cursor-not-allowed' : 'hover:underline'}`}
                >
                  {isLoading ? 'Loading...' : 'Login Anonymously'}
                </a>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Column - Image Section */}
      <div className="hidden lg:block w-1/2 m-6 bg-black rounded-[66px]">
        <img
          src="https://images.unsplash.com/photo-1587889311634-1c5c50c05973?q=80&w=1974&auto=format&fit=crop"
          alt="Beautiful Golden Temple at sunset"
          className="w-full h-full object-cover rounded-r-2xl"
        />
      </div>
    </div>
  );
};

export default LoginPage;
