// app.js

import ApiClient from './apiClient.js';

console.log("app.js loaded");

// Instantiate with base URL of the JSONPlaceholder API
const api = new ApiClient('https://jsonplaceholder.typicode.com');

// Example: fetch all users and log them
api.get('/users')
   .then(data => console.log("GET /users response:", data))
   .catch(error => console.error("Error fetching users:", error));