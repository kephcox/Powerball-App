import React, { useState, useEffect } from 'react';

export default function PowerballApp() {
  const [excludedCombinations, setExcludedCombinations] = useState(new Set());
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [userNumbers, setUserNumbers] = useState(Array(5).fill(''));
  const [userPowerball, setUserPowerball] = useState('');
  const [popularNumbers, setPopularNumbers] = useState([]);
  const [overdueNumbers, setOverdueNumbers] = useState([]);
  const [popularPowerballs, setPopularPowerballs] = useState([]);
  const [overduePowerballs, setOverduePowerballs] = useState([]);
  const [numberFrequency, setNumberFrequency] = useState({});
  const [powerballFrequency, setPowerballFrequency] = useState({});
  const [ticketHistory, setTicketHistory] = useState([]);

  // Fetch historical Powerball numbers
  useEffect(() => {
    const fetchHistoricalNumbers = async () => {
      const apiUrl = '/data/powerball.json';

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.warn("Failed to fetch historical numbers. Proceeding without historical data.");
          return;
        }

        const fetchedData = await response.json();
        console.log("Fetched data:", fetchedData);

        if (!Array.isArray(fetchedData)) {
          console.warn("Unexpected data format: expected an array.");
          return;
        }

        const historicalCombinations = new Set();
        const frequency = {};
        const powerballFreq = {};
        const drawDates = {};

        fetchedData.forEach(draw => {
          if (!draw.winning_numbers) return;
          const [mainNumbers, powerball] = draw.winning_numbers.split(" ");
          const mainArray = mainNumbers.split("-").map(num => parseInt(num, 10));
          const powerballNum = parseInt(powerball, 10);

          if (mainArray.some(isNaN) || isNaN(powerballNum)) return;

          mainArray.sort((a, b) => a - b);
          const combination = `${mainArray.join("-")}-${powerballNum}`;
          historicalCombinations.add(combination);

          mainArray.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
            drawDates[num] = drawDates[num] || [];
            drawDates[num].push(new Date(draw.draw_date));
          });

          powerballFreq[powerballNum] = (powerballFreq[powerballNum] || 0) + 1;
        });

        setExcludedCombinations(historicalCombinations);
        setNumberFrequency(frequency);
        setPowerballFrequency(powerballFreq);

        const sortedNumbers = Object.entries(frequency)
          .sort((a, b) => b[1] - a[1])
          .map(([num]) => parseInt(num, 10));
        setPopularNumbers(sortedNumbers.slice(0, 25));

        const sortedPowerballs = Object.entries(powerballFreq)
          .sort((a, b) => b[1] - a[1])
          .map(([num]) => parseInt(num, 10));
        setPopularPowerballs(sortedPowerballs.slice(0, 25));

        const overdueSorted = Object.keys(drawDates)
          .sort((a, b) => {
            const lastDrawA = Math.min(...drawDates[a].map(date => new Date(date).getTime()));
            const lastDrawB = Math.min(...drawDates[b].map(date => new Date(date).getTime()));
            return lastDrawA - lastDrawB;
          })
          .map(num => parseInt(num, 10));
        setOverdueNumbers(overdueSorted.slice(0, 25));

        const overduePowerballs = Object.keys(powerballFreq)
          .sort((a, b) => powerballFreq[a] - powerballFreq[b])
          .map(num => parseInt(num, 10));
        setOverduePowerballs(overduePowerballs.slice(0, 25));

      } catch (error) {
        console.warn("Failed to fetch historical numbers. Proceeding without historical data.");
      }
    };

    fetchHistoricalNumbers();
  }, []);

  // Generate unique Powerball numbers
  const generatePowerballNumbers = (type = 'random') => {
    let combination;
    do {
      let mainNumbers = [];
      let powerball;

      switch (type) {
        case 'user':
          mainNumbers = userNumbers.map(num => parseInt(num, 10));
          powerball = parseInt(userPowerball, 10);
          if (mainNumbers.includes('') || isNaN(powerball)) {
            alert("Please fill in all numbers and the Powerball.");
            return;
          }
          break;

        case 'popular':
          mainNumbers = getRandomFromList(popularNumbers.length > 0 ? popularNumbers : generateRandomNumbers(), 5);
          powerball = getRandomFromList(popularPowerballs.length > 0 ? popularPowerballs : [Math.floor(Math.random() * 26) + 1], 1)[0];
          break;

        case 'overdue':
          mainNumbers = getRandomFromList(overdueNumbers.length > 0 ? overdueNumbers : generateRandomNumbers(), 5);
          powerball = getRandomFromList(overduePowerballs.length > 0 ? overduePowerballs : [Math.floor(Math.random() * 26) + 1], 1)[0];
          break;

        default:
          mainNumbers = generateRandomNumbers();
          powerball = Math.floor(Math.random() * 26) + 1;
      }

      mainNumbers.sort((a, b) => a - b);
      combination = `${mainNumbers.join("-")}-${powerball}`;
    } while (excludedCombinations.has(combination));

    setGeneratedNumbers([...generatedNumbers, combination]);
    setTicketHistory([...ticketHistory, combination]);
  };

  const getRandomFromList = (list, count) => {
    if (!list || list.length === 0) return [];
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateRandomNumbers = () => {
    const availableNumbers = Array.from({ length: 69 }, (_, i) => i + 1);
    const chosen = [];
    while (chosen.length < 5) {
      const index = Math.floor(Math.random() * availableNumbers.length);
      const num = availableNumbers.splice(index, 1)[0];
      chosen.push(num);
    }
    return chosen;
  };

  // Handle user input for numbers with dropdowns
  const handleUserNumberChange = (index, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 69) return;

    if (userNumbers.includes(num)) {
      alert("Number already selected. Choose a different number.");
      return;
    }

    const newUserNumbers = [...userNumbers];
    newUserNumbers[index] = num;
    setUserNumbers(newUserNumbers);
  };

  const handlePowerballChange = (value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 26) {
      setUserPowerball(num);
    }
  };

  const renderNumberDropdown = (value, index) => (
    <select
      value={value}
      onChange={(e) => handleUserNumberChange(index, e.target.value)}
      className="border p-2 rounded-md w-20"
    >
      <option value="">Select</option>
      {Array.from({ length: 69 }, (_, i) => i + 1).map(num => (
        <option key={num} value={num} disabled={userNumbers.includes(num)}>
          {num}
        </option>
      ))}
    </select>
  );

  const renderPowerballDropdown = () => (
    <select
      value={userPowerball}
      onChange={(e) => handlePowerballChange(e.target.value)}
      className="border p-2 rounded-md w-20"
    >
      <option value="">Select</option>
      {Array.from({ length: 26 }, (_, i) => i + 1).map(num => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Powerball Number Generator</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Choose Your Numbers (Optional)</h2>
        <div className="flex space-x-2 mb-2">
          {userNumbers.map((value, index) => renderNumberDropdown(value, index))}
        </div>
        <h3 className="text-lg font-medium mb-2">Choose Powerball</h3>
        {renderPowerballDropdown()}
      </div>

      <div className="flex space-x-4 mb-4">
        <button onClick={() => generatePowerballNumbers('random')} className="px-4 py-2 bg-blue-500 text-white rounded-xl">
          Generate Random Numbers
        </button>
        <button onClick={() => generatePowerballNumbers('user')} className="px-4 py-2 bg-yellow-500 text-white rounded-xl">
          Generate with My Numbers
        </button>
        <button onClick={() => generatePowerballNumbers('popular')} className="px-4 py-2 bg-green-500 text-white rounded-xl">
          Generate Popular Numbers
        </button>
        <button onClick={() => generatePowerballNumbers('overdue')} className="px-4 py-2 bg-red-500 text-white rounded-xl">
          Generate Overdue Numbers
        </button>
      </div>

      {generatedNumbers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Generated Numbers:</h2>
          <ul className="mt-2 list-disc pl-6">
            {generatedNumbers.map((num, index) => (
              <li key={index} className="text-lg">
                {num}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
