import axios from 'axios';

const fetchNumbers = async (url) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);

    const res = await axios.get(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res.data.numbers;
  } catch {
    return []; 
  }
};

export default fetchNumbers;

