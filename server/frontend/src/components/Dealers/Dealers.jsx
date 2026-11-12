import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDealers } from '../../api.js'

const STATES = ['California', 'Illinois', 'Kansas', 'New York', 'Texas'];

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchDealers(state || undefined)
      .then((data) => setDealers(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load dealers from the server.'))
      .finally(() => setLoading(false));
  }, [state]);

  return (
    <div>
      <h2>Dealers</h2>
      <div className="state-filter">
        <label htmlFor="state-select">Filter by state: </label>
        <select
          id="state-select"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">All states</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading dealers...</p>}
      {error && <p className="error-text">{error}</p>}

      <ul className="dealer-list">
        {dealers.map((dealer) => (
          <li className="card" key={dealer.dealer_id || dealer._id}>
            <h3>
              <Link to={`/dealer/${dealer.dealer_id}`}>{dealer.name}</Link>
            </h3>
            <p>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>
          </li>
        ))}
        {!loading && !error && dealers.length === 0 && (
          <p>No dealers found{state ? ` in ${state}` : ''}.</p>
        )}
      </ul>
    </div>
  )
}
