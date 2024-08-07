// src/App.js
import React from 'react';
import { BrowserRouter as Route, Routes } from 'react-router-dom'; // Correctly import Router
import { HashRouter } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardPage from './pages/DashboardPage';
import TransactionForm from './components/Dashboard/TransactionForm'; // Import TransactionPage
import EditTransactionPage from './pages/EditTransaction'; // Import EditTransactionPage

const App = () => (
  <HashRouter> {/* Use either Router or HashRouter */}
    <Routes>
      <Route path="/" element={<Login />} /> {/* Default route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transaction" element={<TransactionForm />} /> {/* Route for TransactionPage */}
      <Route path="/edit-transaction/:id" element={<EditTransactionPage />} /> {/* Route for EditTransactionPage */}
    </Routes>
  </HashRouter>
);

export default App;
