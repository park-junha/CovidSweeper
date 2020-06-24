const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'Request successful.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});

module.exports = router;
