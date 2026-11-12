const mongoose = require('mongoose');

const DealerSchema = new mongoose.Schema({
  dealer_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  zip: { type: String, required: true },
  state: { type: String, required: true },
});

module.exports = mongoose.model('Dealer', DealerSchema);
