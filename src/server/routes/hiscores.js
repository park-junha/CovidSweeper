const express = require('express');
const router = express.Router();
const Hiscore = require('../models/hiscore');

const diffs = ['intermediate', 'advanced', 'omgwhy'];
const MAX_ROWS = 5;

function getTimeDiff(startDate, now) {
  const timeDiff = now - startDate;
  if (timeDiff < 1000 * 60) {
    const num = Math.trunc(timeDiff / 1000);
    return num + (num === 1 ? ' second ago' : ' seconds ago');
  } else if (timeDiff < 1000 * 3600) {
    const num = Math.trunc(timeDiff / (1000 * 60));
    return num + (num === 1 ? ' minute ago' : ' minutes ago');
  } else if (timeDiff < 1000 * 3600 * 24) {
    const num = Math.trunc(timeDiff / (1000 * 3600));
    return num + (num === 1 ? ' hour ago' : ' hours ago');
  } else if (timeDiff < 1000 * 3600 * 24 * 7) {
    const num = Math.trunc(timeDiff / (1000 * 3600 * 24));
    return num === 1 ? 'yesterday' : num + ' days ago';
  } else {
    return startDate.toLocaleString().split(',')[0];
  }
}

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

  switch (req.params.category) {
  case 'daily':
    startDate = new Date(
      now.getTime() - (24 * 3600 * 1000)
    );
    break;
  case 'weekly':
    startDate = new Date(
      now.getTime() - (24 * 3600 * 1000 * 7)
    );
    break;
  case 'monthly':
    startDate = new Date(
      now.getTime() - (24 * 3600 * 1000 * 30)
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
        , '$lt': now
      }
    })
    .sort({
      time: 1
    })
    .limit(MAX_ROWS);

    for (let i = 0; i < hiscores.length; i++) {
      hiscores[i]._doc.timestamp =
        getTimeDiff(new Date(hiscores[i].datetime), now);
    }

    for (let i = hiscores.length; i < MAX_ROWS; i++) {
      hiscores[i] = {
        'time': '-'
        , 'name': '-'
        , 'datetime': null
        , 'difficulty': '-'
        , 'timestamp': '-'
        , 'mines': '-'
      };
    }

    res.status(200).json(hiscores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});

module.exports = router;
