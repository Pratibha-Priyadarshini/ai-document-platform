import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './themes.css';
import './App_gamma_styles.css';
import { ThemeProvider } from './ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateProject from './components/CreateProject';
import CreatePPT from './components/CreatePPT';
import ProjectEditor from './components/ProjectEditor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Register onRegister={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/create-project" 
            element={
              isAuthenticated ? 
              <CreateProject /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/create-ppt" 
            element={
              isAuthenticated ? 
              <CreatePPT /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/project/:id" 
            element={
              isAuthenticated ? 
              <ProjectEditor /> : 
              <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
