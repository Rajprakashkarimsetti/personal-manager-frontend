// src/components/Dashboard/TransactionForm.js
import { useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

// Updated GraphQL mutation to include 'type'
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

// Updated query to include 'type'
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
  const [type, setType] = useState(''); // Added state for 'type'
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
          type, // Include type in variables
        },
      });
      alert('Transaction added successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
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
        <button type="submit" disabled={loading}>Save</button>
        {error && <p>Error adding transaction: {error.message}</p>}
      </div>
    </form>
  );
};

export default TransactionForm;
