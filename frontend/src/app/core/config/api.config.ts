import { isDevMode } from '@angular/core';

// This switches the API URL dynamically based on whether you are running locally or in production.
// Once you deploy the backend on Render, replace the production URL with your actual Render URL.
export const API_BASE_URL = isDevMode() 
  ? 'http://localhost:8080' 
  : 'https://satori-backend-qw0h.onrender.com'; 
