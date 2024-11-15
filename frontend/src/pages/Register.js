import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
  // Define state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();


  const handleRegister = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Implement registration logic here
    console.log('Register:', { email, password });
   
    try {
        // Send registration data to the telemetry service
        await axios.post('http://localhost:6000/register', {
          email,
          password,
        });
        alert('Registered: You will be redirected to Login Page');
        // Redirect to login page after successful registration
        navigate('/login');
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Registration failed. Please try again.');
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create an Account</h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:bg-green-700"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
