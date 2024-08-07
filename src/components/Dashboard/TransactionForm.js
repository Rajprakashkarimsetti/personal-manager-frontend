// src/components/Dashboard/TransactionForm.js
import { useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $amount: Float!,
    $description: String!,
    $date: String!,
    $category: String!,
    $type: TransactionType!
  ) {
    createTransaction(
      amount: $amount,
      description: $description,
      date: $date,
      category: $category,
      type: $type
    ) {
      id
      amount
      description
      date
      category
      type
    }
  }
`;

const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions {
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

const TransactionForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [createTransaction, { loading, error }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_ALL_TRANSACTIONS }],
    awaitRefetchQueries: true,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction({
        variables: {
          amount: parseFloat(amount),
          description,
          date,
          category,
          type,
        },
      });
      alert('Transaction added successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="transaction-form-container">
      <h1 className="transaction-form-header">Add New Transaction</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Select type</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" disabled={loading}>Save</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
        {error && <p className="error-message">Error adding transaction: {error.message}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;
