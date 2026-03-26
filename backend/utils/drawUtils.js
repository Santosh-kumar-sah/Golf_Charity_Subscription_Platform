// Generate 5 unique random numbers between 1 and 45
const generateDrawNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers);
};

// Count how many numbers in userScores match drawNumbers
const countMatches = (userScores, drawNumbers) => {
  const drawSet = new Set(drawNumbers);
  return userScores.filter(num => drawSet.has(num)).length;
};

export { generateDrawNumbers, countMatches };