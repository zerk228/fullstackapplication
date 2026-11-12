import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../api.js'

export default function Login({ setUser }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(userName, password);
      if (data.status === 'Authenticated') {
        setUser({ userName: data.userName });
        navigate('/');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}
      <form className="app-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
