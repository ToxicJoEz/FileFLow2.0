import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Beta from './pages/Beta';
import Blog from './pages/Blog';
import Changelog from './pages/Changelog';
import Community from './pages/Community';
import TopicDetail from './pages/TopicDetail';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './pages/DashboardLayout';
import Payment from './pages/Payment';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import Screenshots from './pages/Screenshots';
import Settings from './pages/Settings';
import AdminUsers from './pages/AdminUsers';
import Terms from './pages/Terms';

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Intersection Observer for scroll animations globally
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            if (node.classList.contains('anim-fade-up')) {
              observer.observe(node);
            }
            const children = node.querySelectorAll('.anim-fade-up');
            children.forEach(child => observer.observe(child));
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path="login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          
          <Route path="about" element={<About />} />
          
          <Route path="beta" element={<Beta />} />
          <Route path="blog" element={<Blog />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="community" element={<Community />} />
          <Route path="community/:topicId" element={<TopicDetail />} />
          <Route path="contact" element={<Contact />} />
          
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          
          <Route path="payment" element={<Payment />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="privacy" element={<Privacy />} />
          
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="screenshots" element={<Screenshots />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer theme="dark" position="top-center" hideProgressBar={true} autoClose={3500} closeButton={false} />
    </BrowserRouter>
  );
}

export default App;
