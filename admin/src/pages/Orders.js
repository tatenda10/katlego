// src/components/OrderList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/meal-planning/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
      <div className="container mx-auto my-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6">Orders</h2>
        {orders.map(order => (
          <div key={order.id} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Order ID: {order.id}</h3>
            <p className="mb-2">Total Cost: ${order.total_cost}</p>
            <p className="mb-4">Created At: {new Date(order.created_at).toLocaleString()}</p>
            <table className="min-w-full bg-white border-collapse border border-gray-200 shadow-lg">
              <thead>
                <tr className="bg-[#04071E] text-white font-bold">
                  <th className="border border-gray-300 px-4 py-2 text-navy-800">Meal</th>
                  <th className="border border-gray-300 px-4 py-2 text-navy-800">Recipe</th>
                  <th className="border border-gray-300 px-4 py-2 text-navy-800">Ingredients</th>
                </tr>
              </thead>
              <tbody>
                {order.meals.map((mealEntry, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{mealEntry.meal.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{mealEntry.meal.recipe}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <ul>
                        {mealEntry.ingredients.map(ingredient => (
                          <li key={ingredient.id} className="flex justify-between">
                            <span>{ingredient.item}</span>
                            <span>${ingredient.cost}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
