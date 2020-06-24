const express = require('express');
const router = express.Router();
const Hiscore = require('../models/hiscore');

router.post('/', async (req, res) => {
  const hiscore = new Hiscore({
    time: req.body.time
    , name: req.body.name
    , datetime: Date.now()
    , difficulty: req.body.difficulty
  });

  try {
    const newHiscore = await hiscore.save();
    res.status(201).json(newHiscore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
