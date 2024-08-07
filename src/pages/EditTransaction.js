// src/pages/EditTransactionPage.js
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const GET_TRANSACTION = gql`
  query getTransactionById($id: ID!) {
    getTransactionById(id: $id) {
      id
      description
      amount
      date
      category
      type
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $description: String!, $amount: Float!, $date: String!, $category: String!, $type: TransactionType!) {
    updateTransaction(id: $id, description: $description, amount: $amount, date: $date, category: $category, type: $type) {
      id
      description
      amount
      date
      category
      type
    }
  }
`;

const EditTransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_TRANSACTION, { variables: { id } });
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);

  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    date: '',
    category: '',
    type: 'INCOME' // Default to 'INCOME'
  });

  useEffect(() => {
    if (data) {
      const { getTransactionById } = data;
      setFormData({
        description: getTransactionById.description,
        amount: getTransactionById.amount,
        date: getTransactionById.date,
        category: getTransactionById.category,
        type: getTransactionById.type
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFloatChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction({ variables: { id, ...formData } });
      navigate('/dashboard'); // Redirect after updating
    } catch (err) {
      console.error("Error updating transaction:", err.message);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Redirect to dashboard on cancel
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="edit-transaction">
      <h2>Edit Transaction</h2>
      <form onSubmit={handleSubmit} className="edit-transaction-form">
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleFloatChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">Update Transaction</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditTransactionPage;
