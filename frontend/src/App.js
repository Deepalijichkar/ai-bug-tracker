import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateBug from './pages/CreateBug';
import BugDetail from './pages/BugDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <PrivateRoute>
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Projects />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/create" element={<CreateBug />} />
                <Route path="/bug/:id" element={<BugDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;