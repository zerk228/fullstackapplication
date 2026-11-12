import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../../api.js'

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Ignore network errors on logout; clear local state regardless.
    }
    setUser(null);
    navigate('/');
  };

  return (
    <header className="app-header">
      <h1>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Cars Dealership Review
        </Link>
      </h1>
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/dealers">Dealers</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
        {user ? (
          <>
            <span>Hi, {user.userName}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
