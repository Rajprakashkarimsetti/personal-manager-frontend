import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://zeroth-francisca-rajprakash-a3d9f427.koyeb.app/graphql/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            login(email: "${email}", password: "${password}") {
                                token
                            }
                        }
                    `,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', result.data.login.token);
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
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
                    <label htmlFor="password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <div style={styles.registerLink}>
                <p>Don't have an account?</p>
                <Link to="/register" style={styles.link}>Register here</Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    errorText: {
        color: '#dc3545',
    },
    registerLink: {
        marginTop: '15px',
        textAlign: 'center',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
    linkHover: {
        textDecoration: 'underline',
    },
};

export default Login;
