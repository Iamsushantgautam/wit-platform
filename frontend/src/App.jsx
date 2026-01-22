import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MasterAdminDashboard from './pages/MasterAdminDashboard';
import About from './pages/About';
import AiTools from './pages/AiTools';
import PromptsLibrary from './pages/PromptsLibrary';
import Profiles from './pages/Profiles';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  // Subdomain Routing Logic
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  let subdomain = null;

  // Exclude Vercel deployment URLs (e.g., withub-iota.vercel.app)
  const isVercelDomain = hostname.includes('vercel.app');

  // Only process subdomains for custom domains, not Vercel deployments
  if (!isVercelDomain) {
    // Handle localhost (e.g. user.localhost)
    if (parts.length === 2 && parts[1] === 'localhost') {
      subdomain = parts[0];
    }
    // Handle production domains (e.g. user.website.com or user.website) - assuming valid domain has at least 2 parts
    // We want to capture 'user' from 'user.mydomain.com'
    else if (parts.length > 2) {
      // Exclude 'www'
      if (parts[0] !== 'www') {
        subdomain = parts[0];
      }
    }
  }

  // If we are on a subdomain, render the User Profile directly
  if (subdomain) {
    return (
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/*" element={<Profile usernameOverride={subdomain} />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    );
  }

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
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<MasterAdminDashboard />} />
              </Route>

              {/* Public Routes */}
              <Route path="/u/:username" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/tools" element={<AiTools />} />
              <Route path="/prompts" element={<PromptsLibrary />} />
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
