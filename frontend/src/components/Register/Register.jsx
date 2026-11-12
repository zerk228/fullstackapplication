import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../api.js'

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    userName: '', password: '', firstName: '', lastName: '', email: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(form);
      if (data.error) {
        setError(data.error);
        return;
      }
      setUser({ userName: data.userName });
      navigate('/');
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p className="error-text">{error}</p>}
      <form className="app-form" onSubmit={handleSubmit}>
        <input name="userName" placeholder="Username" value={form.userName} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
