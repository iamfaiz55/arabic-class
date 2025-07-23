import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
// import { setCredentials } from './redux/authSlice';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { ClassDetail } from './pages/ClassDetail';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      // You might want to validate the token here
      // For now, we'll just set it as authenticated
      // In a real app, you'd verify the token with the server
    }
  }, [user, dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterForm />}
        />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/class/:id"
          element={user ? <ClassDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;