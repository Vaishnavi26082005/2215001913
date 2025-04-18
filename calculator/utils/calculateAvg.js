const calculateAvg = (numbers) => {
    if (!numbers.length) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
  };
  
  export default calculateAvg;
  