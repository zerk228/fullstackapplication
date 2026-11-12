import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postReview } from '../../api.js'

export default function PostReview({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    review: '',
    purchase: false,
    purchase_date: '',
    car_make: '',
    car_model: '',
    car_year: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to post a review.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await postReview({
        dealership: id,
        name: user.userName,
        purchase: form.purchase,
        review: form.review,
        purchase_date: form.purchase_date,
        car_make: form.car_make,
        car_model: form.car_model,
        car_year: form.car_year ? Number(form.car_year) : null,
      });
      navigate(`/dealer/${id}`);
    } catch (err) {
      setError('Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Write a Review</h2>
      {error && <p className="error-text">{error}</p>}
      <form className="app-form" onSubmit={handleSubmit}>
        <textarea
          name="review"
          placeholder="Share your experience..."
          rows={5}
          value={form.review}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="purchase"
            checked={form.purchase}
            onChange={handleChange}
          />{' '}
          I purchased a vehicle here
        </label>
        <input
          type="date"
          name="purchase_date"
          value={form.purchase_date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="car_make"
          placeholder="Car make (e.g. Toyota)"
          value={form.car_make}
          onChange={handleChange}
        />
        <input
          type="text"
          name="car_model"
          placeholder="Car model (e.g. Camry)"
          value={form.car_model}
          onChange={handleChange}
        />
        <input
          type="number"
          name="car_year"
          placeholder="Car year"
          value={form.car_year}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
