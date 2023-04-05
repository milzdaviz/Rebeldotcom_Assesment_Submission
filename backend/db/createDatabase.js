const mongoose = require('mongoose');
const roster = require('./roster.json');

mongoose.connect('mongodb://localhost:27017/artist-roster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error)); 

const artistSchema = new mongoose.Schema({
    artist: { type: String, required: true },
    rate: { type: Number, required: true },
    streams: { type: Number, required: true },
    payout_amount: { type: Number },
    payout_complete: { type: Boolean, default: false }
});

const Artist = mongoose.model('Artist', artistSchema);

//calculate payout amount
roster.data.map(item => {
    item.payout_amount = (item.streams * item.rate).toFixed(2);
})

Artist.insertMany(roster.data)
  .then(() => console.log("New data inserted..."))
  .then(() => mongoose.disconnect())
  .catch((err) => console.error("Could not insert new data...", err));
