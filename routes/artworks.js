const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');

const User = require('../models/User');
const Artwork = require("../models/Artwork");

// @route     GET api/artworks
// @desc      Get all users artworks
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const artworks = await Artwork.find({user: req.user.id}).sort({
      date: -1,
    });
    res.json(artworks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/artworks
// @desc      Add new artwork
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, description, category, size, price, location} = req.body;

    try {
      const newArtwork = new Artwork({
        name,
        description,
        category,
        size,
        price,
        location,
        user: req.user.id,
      });

      const artwork = await newArtwork.save();

      res.json(artwork);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route     PUT api/artworks/:id
// @desc      Update artwork
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const {name, description, category, size, price, location} = req.body;

  // Build artwork object
  const artworkFields = {};
  if (name) artworkFields.name = name;
  if (description) artworkFields.description = description;
  if (category) artworkFields.category = category;
  if (size) artworkFields.size = size;
  if (price) artworkFields.price = price;
  if (location) artworkFields.location = location;

  try {
    let artwork = await Artwork.findById(req.params.id);

    if (!artwork) return res.status(404).json({msg: 'Artwork not found'});

    // Make sure user owns artwork
    if (artwork.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'Not authorized'});
    }

    artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      {$set: artworkFields},
      {new: true},
    );

    res.json(artwork);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/artworks/:id
// @desc      Delete artwork
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let artwork = await Artwork.findById(req.params.id);

    if (!artwork) return res.status(404).json({msg: 'Artwork not found'});

    // Make sure user owns artwork
    if (artwork.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'Not authorized'});
    }

    await Artwork.findByIdAndRemove(req.params.id);

    res.json({msg: 'Artwork removed'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
