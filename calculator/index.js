import dotenv from 'dotenv';
import express from 'express';
import fetchNumbers from './utils/fetchNumbers.js';
import updateWindow from './utils/updateWindow.js';
import calculateAvg from './utils/calculateAvg.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = parseInt(process.env.WINDOW_SIZE, 10) || 10;
let numberWindow = [];

const urls = {
  p: process.env.URL_P,
  f: process.env.URL_F,
  e: process.env.URL_E,
  r: process.env.URL_R
};

app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  const url = urls[type];

  if (!url) return res.status(400).json({ error: 'Invalid type' });

  const windowPrevState = [...numberWindow];
  const fetchedNumbers = await fetchNumbers(url);

  numberWindow = updateWindow(numberWindow, fetchedNumbers, WINDOW_SIZE);
  const avg = calculateAvg(numberWindow);

  res.json({
    windowPrevState,
    windowCurrState: [...numberWindow],
    numbers: fetchedNumbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
