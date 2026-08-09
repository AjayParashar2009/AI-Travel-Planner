import React from "react";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BudgetEstimator from "./pages/BudgetEstimator";
import SavedTrip from "./pages/SavedTrips";
import TripDetails from "./pages/TripDetails";
import TripPlanner from "./pages/TripPlanner";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import { Toaster } from "react-hot-toast";

export default function App() {
  const PageWrapper = ({ children }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    );
  };

  const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <LoadingScreen />;
    }

    return user ? (
      <PageWrapper>{children}</PageWrapper>
    ) : (
      <Navigate to="/login" replace />
    );
  };

  const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <LoadingScreen />;
    }

    return user ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <PageWrapper>{children}</PageWrapper>
    );
  };
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15,23,42,0.8)",
            color: "#fff",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
          },
        }}
      />
      <div className="min-h-screen bg-[#020203] text-gray-400 font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/registration"
              element={
                <PublicRoute>
                  <Registration />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <BudgetEstimator />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute>
                  <SavedTrip />
                </PrivateRoute>
              }
            />
            <Route
              path="/trip/:id"
              element={
                <PrivateRoute>
                  <TripDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/plan"
              element={
                <PrivateRoute>
                  <TripPlanner />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
