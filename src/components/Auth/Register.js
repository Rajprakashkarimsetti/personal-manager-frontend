import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'https://zeroth-francisca-rajprakash-a3d9f427.koyeb.app/graphql/graphql',
        {
          query: `
            mutation {
              register(name: "${name}", email: "${email}", password: "${password}") {
                token
                user {
                  name
                  email
                }
              }
            }
          `
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.data.register) {
        setSuccess('Registered successfully!');
        setError('');
        // Redirect to login page after showing success message for 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Registration failed. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
      setSuccess('');
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Register</button>
        {success && <p style={styles.successMessage}>{success}</p>}
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '1em',
    background: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1em',
  },
  formGroup: {
    marginBottom: '1em',
  },
  label: {
    display: 'block',
    marginBottom: '0.5em',
  },
  input: {
    width: '100%',
    padding: '0.8em',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    width: '100%',
    padding: '0.8em',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1em',
    cursor: 'pointer',
    marginBottom: '1em', // Add margin to ensure the button is separated from the success message
  },
  buttonHover: {
    backgroundColor: '#218838',
  },
  successMessage: {
    color: '#28a745', // Green color
    textAlign: 'center',
    marginTop: '1em', // Ensure space above the success message
  },
  errorMessage: {
    color: '#dc3545', // Red color for errors
    textAlign: 'center',
    marginBottom: '1em',
  },
};

export default Register;
