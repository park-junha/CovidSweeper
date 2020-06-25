const express = require('express');
const router = express.Router();
const Hiscore = require('../models/hiscore');

const diffs = ['intermediate', 'advanced', 'omgwhy'];

router.post('/', async (req, res) => {
  const hiscore = new Hiscore({
    time: req.body.time
    , name: req.body.name
    , datetime: Date.now()
    , difficulty: req.body.difficulty
    , mines: req.body.mines
  });

  try {
    const newHiscore = await hiscore.save();
    res.status(201).json(newHiscore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  };
});

router.get('/:diff/:category', async (req, res) => {
  if (!diffs.includes(req.params.diff)) {
    res.status(400).json({
      message: `Bad diff parameter: ${req.params.diff}` 
    });
    return;
  }

  let now = new Date();
  let startDate;
  const endDate = new Date(
    now.getFullYear()
    , now.getMonth()
    , now.getDate() + 1
  );

  switch (req.params.category) {
  case 'daily':
    startDate = new Date(
      now.getFullYear()
      , now.getMonth()
      , now.getDate()
    );
    break;
  case 'weekly':
    startDate = new Date(
      now.getFullYear()
      , now.getMonth()
      , now.getDate() - now.getDay()
    );
    break;
  case 'monthly':
    startDate = new Date(
      now.getFullYear()
      , now.getMonth()
    );
    break;
  case 'alltime':
    startDate = new Date(0);
    break;
  default:
    res.status(400).json({
      message: `Bad category parameter: ${req.params.category}` 
    });
    return;
  };

  try {
    let hiscores = await Hiscore.find({
      difficulty: req.params.diff
      , datetime: {
        '$gte': startDate
        , '$lt': endDate
      }
    })
    .sort({
      time: 1
    })
    .limit(5);

    console.log(hiscores);

    res.status(200).json(hiscores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});

module.exports = router;
