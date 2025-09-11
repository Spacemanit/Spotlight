import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const token = localStorage.getItem("token");
  const ip = 'http://localhost:3000';
  const [issue, setIssue] = useState({
    title: "",
    issueType: "",
    state: "",
    address1: "",
    address2: "",
    city: "",
    zipcode: "",
    file: null,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setIssue((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Issue submitted:", issue);
    const formData = new FormData();
    formData.append("title", issue.title);
    formData.append("description", issue.description);
    formData.append("category", issue.issueType);
    formData.append("location", issue.address1);
    formData.append("token", token);
    formData.append("image", issue.file);

    fetch(`${ip}/issue/submit`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "Login Successful") {
          console.log(data);
          localStorage.setItem("username", data.username);
          location = "chat.html";
        } else {
          alert(data.message);
        }
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];
  const problems = [
    "Air pollution in urban areas",
    "Traffic congestion and poor road infrastructure",
    "Inconsistent electricity and water supply",
    "Lack of proper sanitation and waste management",
    "Unemployment and underemployment",
    "Corruption in public offices",
    "Poor quality of public healthcare",
    "Inaccessible and expensive education",
    "Crime and safety concerns, especially for women",
    "Flooding and poor drainage during monsoons",
    "Overcrowding in public transport",
    "Poverty and income inequality",
    "Access to clean drinking water",
    "Internet and digital infrastructure gaps in rural areas",
    "Encroachment and lack of urban planning",
    "Other Problem",
  ];
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <h1 className="absolute text-3xl font-bold text-[#3A364F] top-8 left-8">Spotlight</h1>
      <div className="bg-white p-8 md:p-12 w-full max-w-2xl rounded-lg shadow-lg">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-[#3A364F] mb-4">
            About your issue
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="issueType"
                className="block text-sm font-medium text-[#3A364F]"
              >
                What type of issue do you have?
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={issue.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="mt-1 block w-full px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <select
                id="issueType"
                name="issueType"
                value={issue.issueType}
                onChange={handleInputChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select issue type</option>
                {problems.map((problem, index) => (
                  <option key={index} value={problem}>
                    {problem}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#3A364F]">
                Location and address of the issue
              </label>
              <select
                id="state"
                name="state"
                value={issue.state}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select your state</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <input
                type="text"
                id="address1"
                name="address1"
                value={issue.address1}
                onChange={handleInputChange}
                placeholder="Location line 1"
                className="mt-1 block w-full px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                type="text"
                id="address2"
                name="address2"
                value={issue.address2}
                onChange={handleInputChange}
                placeholder="Location line 2"
                className="mt-1 block w-full px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={issue.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="mt-1 block w-full md:w-1/2 px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={issue.zipcode}
                  onChange={handleInputChange}
                  placeholder="Zipcode"
                  className="mt-1 block w-full md:w-1/2 px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-[#3A364F]"
              >
                Upload image of the issue
              </label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border[#3A364F]"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.207l-.007-.007A5.002 5.002 0 0 0 6 12v1m-7 0H3.5l2-2.5L5.707 13M9 1v12h1v-12z"
                      />
                    </svg>
                    <p className="text-xs text-gray-500">
                      {issue.file ? issue.file.name : "Upload file"}
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#3A364F]"
              >
                Short description of the issue
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={issue.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border[#3A364F] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#3A364F] text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

export default App;
