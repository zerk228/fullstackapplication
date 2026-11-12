/**
 * Seeds the MongoDB database with a small set of sample dealers and
 * reviews so the application has data to show out of the box.
 *
 * Usage: node seed.js  (requires MONGO_URL env var or defaults to localhost)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Dealer = require('./models/dealer');
const Review = require('./models/review');
const { analyzeSentiment } = require('./sentiment');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dealershipsDB';

const dealers = [
  { dealer_id: 1, name: 'Metro Motors', lat: 41.8781, long: -87.6298, city: 'Chicago', address: '100 State St', zip: '60601', state: 'Illinois' },
  { dealer_id: 2, name: 'Golden Gate Auto', lat: 37.7749, long: -122.4194, city: 'San Francisco', address: '200 Market St', zip: '94105', state: 'California' },
  { dealer_id: 3, name: 'Lone Star Cars', lat: 29.7604, long: -95.3698, city: 'Houston', address: '300 Main St', zip: '77002', state: 'Texas' },
  { dealer_id: 4, name: 'Empire Auto Group', lat: 40.7128, long: -74.0060, city: 'New York', address: '400 Broadway', zip: '10013', state: 'New York' },
  { dealer_id: 5, name: 'Sunflower State Motors', lat: 39.0473, long: -95.6752, city: 'Topeka', address: '500 Kansas Ave', zip: '66603', state: 'Kansas' },
];

const rawReviews = [
  { dealership: 1, name: 'Alice Johnson', purchase: true, review: 'Great service and a friendly, helpful staff. I love my new car!', purchase_date: '2025-02-10', car_make: 'Toyota', car_model: 'Camry', car_year: 2024 },
  { dealership: 1, name: 'Bob Smith', purchase: false, review: 'The salesperson was rude and pushy, a terrible experience overall.', purchase_date: '', car_make: '', car_model: '', car_year: null },
  { dealership: 2, name: 'Carla Diaz', purchase: true, review: 'Smooth and easy process, excellent prices and fair deal.', purchase_date: '2025-05-01', car_make: 'Honda', car_model: 'Civic', car_year: 2023 },
  { dealership: 3, name: 'David Lee', purchase: true, review: 'It was an okay visit, nothing special but got the job done.', purchase_date: '2025-07-20', car_make: 'Ford', car_model: 'F-150', car_year: 2022 },
];

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected for seeding...');

  await Dealer.deleteMany({});
  await Review.deleteMany({});

  await Dealer.insertMany(dealers);

  const reviews = rawReviews.map((r, i) => ({
    review_id: i + 1,
    ...r,
    sentiment: analyzeSentiment(r.review),
  }));
  await Review.insertMany(reviews);

  console.log(`Seeded ${dealers.length} dealers and ${reviews.length} reviews.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
