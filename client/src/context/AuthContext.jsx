import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Set the base URL for Axios using environment variable
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const login = async (email, password) => { // Removed recaptchaToken
      // Removed recaptchaToken from the payload
      const response = await axios.post('/user/login', { email, password });
      setUser(response.data.user);
      return response.data;  
  };

  const register = async (formData) => { // Removed recaptchaToke
      // Removed recaptchaToken from the payload
      const response = await axios.post('/user/register', formData);
      setUser(response.data.user);
      return response.data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);