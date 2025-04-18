const updateWindow = (windowArr, newNumbers, windowSize) => {
    newNumbers.forEach(num => {
      if (!windowArr.includes(num)) {
        windowArr.push(num);
      }
    });
  
    while (windowArr.length > windowSize) {
      windowArr.shift();
    }
  
    return windowArr;
  };
  
  export default updateWindow;
  