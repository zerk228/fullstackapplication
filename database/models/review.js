const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  review_id: { type: Number, required: true, unique: true },
  dealership: { type: Number, required: true }, // dealer_id this review belongs to
  name: { type: String, required: true },
  purchase: { type: Boolean, required: true, default: false },
  review: { type: String, required: true },
  purchase_date: { type: String },
  car_make: { type: String },
  car_model: { type: String },
  car_year: { type: Number },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral',
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
