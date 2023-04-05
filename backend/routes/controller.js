const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');

// GET all artists data
router.get('/artists', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            const artists = await Artist.find({}, {'__v': 0}).sort({payout_amount: -1});
            res.status(200).json(artists);
        } else { // GET a single artist by name using queries
            const findArtists = await Artist.findOne({ artist: req.query.artist });
            res.status(200).json(findArtists);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

// GET a single artist by id
router.get('/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findOne({_id: req.params.id});
        if (!artist) throw new Error('Artist not found');
        res.status(200).json(artist);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
});

// POST (create) a new artist
router.post('/artists', async (req, res) => {
    try {
        const artist = new Artist({
          artist: req.body.artist,
          rate: req.body.rate,
          streams: req.body.streams,
          payout_amount: (req.body.streams * req.body.rate).toFixed(2),
        });
        await artist.save();

        res.status(201).json(artist);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// PATCH (update) an artist
router.patch('/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const newUpdate =  await Artist.findOne({_id: req.params.id});

        //do a second patch to update payout_amount
        const payload = (newUpdate.streams * newUpdate.rate).toFixed(2);
        const updatePaymentAmount = await Artist.findByIdAndUpdate(req.params.id, {payout_amount: payload}, { new: true });

        if (!artist) throw new Error('Artist not found');
        if (!updatePaymentAmount) throw new Error('Unable to update payment_amount for artist');
        
        res.status(200).json(artist);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
});

// DELETE an artist
router.delete('/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) throw new Error('Artist not found');
        res.status(200).json(artist);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;