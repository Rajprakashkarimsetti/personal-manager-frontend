import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Transactions from './Transactions';
import '../../styles/global.css';

const GET_FINANCE_SUMMARY = gql`
  query GetFinanceSummary {
    financeSummary {
      totalIncome
      totalExpenses
      balance
      category
    }
    getAllTransactions {
      id
      description
      amount
      date
      category
      type
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

const Dashboard = () => {
  const { data, loading, error, refetch } = useQuery(GET_FINANCE_SUMMARY);
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => refetch(),
  });
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('all'); // Default to 'all' to show all transactions
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { balance = 0, totalIncome = 0, totalExpenses = 0, category = [] } = data?.financeSummary || {};
  const transactions = data?.getAllTransactions || [];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleAddTransaction = () => {
    navigate('/transaction');
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by type if not 'all'
      const typeFilter = selectedType === 'all' || transaction.type === selectedType;

      // Search functionality
      const matchesSearchTerm = Object.values(transaction)
        .map(value => value.toString().toLowerCase())
        .some(value => value.includes(searchTerm));

      return typeFilter && matchesSearchTerm;
    });

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ variables: { id } });
      alert('Transaction deleted successfully');
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
      alert('Failed to delete transaction');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Personal Finance Manager</h1>
        <div className="controls">
          <button className="button" onClick={handleAddTransaction}>Add Transaction</button>
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="content">
        <h2 className="title">Finance Dashboard</h2>
        <div className="stats">
          <p>Total Balance: ${balance.toFixed(2)}</p>
          <div className="summary">
            <p>Income: ${totalIncome.toFixed(2)}</p>
          </div>
          <div className="summary">
            <p>Expenses: ${totalExpenses.toFixed(2)}</p>
          </div>
          <p>Categories: {category.join(', ')}</p>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input"
          />
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="input"
          >
            <option value="all">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div className="transaction-list">
          <Transactions
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
