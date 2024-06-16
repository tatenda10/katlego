// src/components/AddMeal.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../services/api';

const AddMeal = () => {
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState([{ item: '', cost: '' }]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { item: '', cost: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('recipe', recipe);
    formData.append('ingredients', JSON.stringify(ingredients));
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${BASE_URL}/meal-planning/meals`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Meal successfully added!');
      navigate('/home');
    } catch (error) {
      console.error('Failed to add meal:', error);
      toast.error('Failed to add meal.');
    }
  };

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
      <div className="flex-grow flex flex-col items-center bg-gray-100 py-8">
        <h2 className="text-2xl font-bold mb-6">Add a New Meal</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipe">
              Recipe
            </label>
            <textarea
              id="recipe"
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ingredients
            </label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Item"
                  value={ingredient.item}
                  onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <input
                  type="text"
                  placeholder="Cost"
                  value={ingredient.cost}
                  onChange={(e) => handleIngredientChange(index, 'cost', e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <button type="button" onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-600">
              Add Ingredient
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddMeal;
