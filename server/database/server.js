require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Dealer = require('./models/dealer');
const Review = require('./models/review');
const { analyzeSentiment } = require('./sentiment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dealershipsDB';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URL)
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URL}`))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Cars Dealership database microservice is running.');
});

// GET /fetchDealers - all dealers
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /fetchDealers/:state - dealers filtered by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealer.find({ state: req.params.state });
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /fetchDealer/:id - single dealer by dealer_id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findOne({ dealer_id: req.params.id });
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /fetchReviews/dealer/:id - all reviews for a given dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ dealership: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /insert_review - submit a new review; sentiment is computed server-side
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const lastReview = await Review.findOne().sort({ review_id: -1 });
    const nextId = lastReview ? lastReview.review_id + 1 : 1;

    const sentiment = analyzeSentiment(data.review);

    const review = new Review({
      review_id: nextId,
      dealership: data.dealership,
      name: data.name,
      purchase: data.purchase || false,
      review: data.review,
      purchase_date: data.purchase_date || '',
      car_make: data.car_make || '',
      car_model: data.car_model || '',
      car_year: data.car_year || null,
      sentiment,
    });

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analyze/:text - exposes the sentiment analyzer standalone,
// used by the Django /djangoapp/analyze/<text> proxy
app.get('/analyze/:text', (req, res) => {
  res.json({ sentiment: analyzeSentiment(req.params.text) });
});

app.listen(PORT, () => {
  console.log(`Dealership database microservice listening on port ${PORT}`);
});

module.exports = app;
