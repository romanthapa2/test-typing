import React from "react";

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-500 flex items-center justify-center">
        <div className="flex mx-auto px-4 gap-10">
          {/* Create Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Create</h1>
            <h3 className="text-lg text-gray-600 mb-2">Word Length</h3>
            <div className="flex space-x-4 mb-4">
              <button className="px-4 py-2 bg-black text-white rounded-md">
                Short
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md ">
                Medium
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md ">
                Long
              </button>
            </div>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Create Room
            </button>
          </div>

          {/* Join Section */}
          <div className="bg-white h-56 shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Join</h1>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Enter code..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
