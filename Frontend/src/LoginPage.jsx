import { useState } from "react";
import HomePage from "./HomePage";

const LoginPage = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [formattedotp, setFormattedOtp] = useState("");
  const [details, setDetails] = useState("");
  const ip = "http://localhost:3000";

  const handleGetOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`${ip}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDetails(data.details);
        setIsOTPSent(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
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
      fetch(`${ip}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ details: details, otp: otp }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.valid) {
            setIsLoggedIn(true);
            setIsLoading(false);
            window.location.href = "/homepage";
            return null;
          }
          else{
            alert('Invalid OTP!')
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
    }, 1500);
  };

  const loginfunc = (e) => {
    const data = { phoneNumber: phoneNumber };
    fetch(`${ip}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        localStorage.setItem("token", data.token);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleAnonymousLogin = (e) => {
    setIsLoggedIn(true);
    setIsLoading(false);
    loginfunc();
    e.preventDefault();
    setIsLoading(true);
    window.location.href = "/homepage";
  };

  // Conditionally render the Home Page after successful login
  if (isLoggedIn) {
    loginfunc();
    window.location.href = "/homepage";
    return null;
  }

  const handleOtpChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, "").slice(0, 7);
    setOtp(numericValue);
    const formattedValue = numericValue.split("").join(" • ");
    setFormattedOtp(formattedValue);
  };

  // Render the login form otherwise
  return (
    <div className="flex min-h-screen font-sans bg-[#FAF9FF]">
      {/* Left Column - Form Section */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center rounded-l-2xl">
        {/* Spotlight Title */}
        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-[#3A364F]">Spotlight</h1>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-sm px-6 py-8">
          <h2 className="text-4xl font-bold mb-8 text-[#3A364F]">
            Hello, <br /> Welcome Back
          </h2>

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
                value={formattedotp}
                onChange={handleOtpChange}
                disabled={isOTPSent ? false : true}
                className="w-full px-4 py-3 border-2 tracking-[0.4em] text-center border-[#3A364F] focus:outline-none focus:border-blue-500 transition-all rounded-2xl"
              />
            </div>

            {/* Remember Me and Resend OTP */}
            <div className="flex justify-between items-center text-sm text-[#3A364F]">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-[#3A364F]" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:underline">
                Resend OTP
              </a>
            </div>

            {/* Conditional button based on state and loading */}
            {isOTPSent ? (
              <div className="flex space-x-4 my-20">
                <button
                  type="submit"
                  onClick={handleSignIn}
                  className={`flex-1 px-4 py-3 font-semibold rounded-2xl shadow-md transition-colors ${isLoading
                      ? "bg-[#3A364F] cursor-not-allowed"
                      : "bg-[#3A364F] hover:bg-[#2B283C] text-white"
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
                <button
                  onClick={handleAnonymousLogin}
                  className={`flex-1 px-4 py-3 font-semibold rounded-2xl shadow-md transition-colors ${isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  disabled={phoneNumber.length == 10 ? false : true}
                >
                  {isLoading ? "Loading..." : "Anonymous"}
                </button>
              </div>
            ) : (
              <div className="flex space-x-4 my-20">
                <button
                  type="submit"
                  onClick={handleGetOTP}
                  className={`flex-1 px-4 py-3 font-semibold rounded-2xl shadow-md transition-colors ${isLoading
                      ? "bg-[#3A364F]cursor-not-allowed"
                      : "bg-[#3A364F] hover:bg-[#2B283C] text-white"
                    }`}
                  disabled={phoneNumber.length == 10 ? false : true}
                >
                  {isLoading ? "Getting OTP" : "Get OTP"}
                </button>
                <a
                  href="#"
                  onClick={handleAnonymousLogin}
                  className={`flex-1 flex items-center justify-center text-[#3A364F] text-sm transition-colors ${isLoading ? "cursor-not-allowed" : "hover:underline"
                    }`}
                >
                  {isLoading ? "Loading..." : "Login Anonymously"}
                </a>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Column - Image Section */}
      <div className="hidden lg:block w-1/2 m-6 bg-black rounded-[66px]">
        <img
          src="https://img.freepik.com/premium-photo/busy-indian-street-middle-day_896360-157.jpg?w=2000"
          alt="Beautiful Golden Temple at sunset"
          className="w-full h-full object-cover rounded-[60px]"
        />
      </div>
    </div>
  );
};

export default LoginPage;
