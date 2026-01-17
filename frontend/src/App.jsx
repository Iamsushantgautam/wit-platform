import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MasterAdminDashboard from './pages/MasterAdminDashboard';
import About from './pages/About';
import AiTools from './pages/AiTools';
import Profiles from './pages/Profiles';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<MasterAdminDashboard />} />

              {/* Public Routes */}
              <Route path="/u/:username" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/tools" element={<AiTools />} />
              <Route path="/community" element={<Profiles />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
