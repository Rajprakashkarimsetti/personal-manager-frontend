import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

const GET_ALL_TRANSACTIONS_QUERY = gql`
  query GetAllTransactions {
    getAllTransactions {
      id
      amount
      description
      date
      category
      type
    }
  }
`;

const Transactions = ({ transactions, onEdit }) => {
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    update(cache, { data: { deleteTransaction } }) {
      const { getAllTransactions } = cache.readQuery({ query: GET_ALL_TRANSACTIONS_QUERY });
      cache.writeQuery({
        query: GET_ALL_TRANSACTIONS_QUERY,
        data: {
          getAllTransactions: getAllTransactions.filter(
            transaction => transaction.id !== deleteTransaction.id
          ),
        },
      });
    },
  });

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ variables: { id } });
      alert('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  // Debugging: Log the transactions data
  console.log('Transactions:', transactions);

  return (
    <div className="transactions-list">
      <h3>Transaction List</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.date}</td>
                <td>{transaction.category}</td>
                <td>{transaction.type ? transaction.type : 'N/A'}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(transaction.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
