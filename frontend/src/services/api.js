import axios from 'axios';

// Set up a base URL for easier access
const api = axios.create({
  baseURL: 'http://localhost:6000',
});

export default api;
