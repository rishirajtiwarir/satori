// This switches the API URL dynamically based on whether you are running locally or in production.
// Once you deploy the backend on Render, replace the production URL with your actual Render URL.
export const API_BASE_URL = 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:8080' 
    : 'https://satori-backend-qw0h.onrender.com'; 

