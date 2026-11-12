import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDealer, fetchReviews } from '../../api.js'

function SentimentBadge({ sentiment }) {
  const cls = `sentiment-badge sentiment-${sentiment || 'neutral'}`;
  return <span className={cls}>{sentiment || 'neutral'}</span>;
}

export default function DealerDetails({ user }) {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    fetchDealer(id).then(setDealer).catch(() => setError('Could not load dealer.'));
    fetchReviews(id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load reviews.'));
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!dealer) return <p>Loading dealer...</p>;

  return (
    <div>
      <h2>{dealer.name}</h2>
      <p>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>

      {user ? (
        <p><Link to={`/postreview/${id}`}>Write a review</Link></p>
      ) : (
        <p><Link to="/login">Log in</Link> to write a review.</p>
      )}

      <h3>Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet for this dealer.</p>}
      {reviews.map((review) => (
        <div className="card" key={review.review_id || review._id}>
          <p>
            <strong>{review.name}</strong>{' '}
            <SentimentBadge sentiment={review.sentiment} />
          </p>
          <p>{review.review}</p>
          {review.car_make && (
            <p>
              <em>
                {review.car_year} {review.car_make} {review.car_model}
              </em>
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
