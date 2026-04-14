const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = {};
  
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }
    throw new Error('Invalid response from server');
  }
  
  if (!response.ok) {
    throw new Error(data?.data?.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return data;
};
