import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Categories from "./pages/Categories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;