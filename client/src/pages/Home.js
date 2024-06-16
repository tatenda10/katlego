// src/components/Home.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold">
          Admin Panel
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </nav>
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="bg-white shadow-lg border border-gray-300 p-8 rounded flex space-x-4">
          <Link to="/add-meal" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add a Meal
          </Link>
          <Link to="/orders" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
