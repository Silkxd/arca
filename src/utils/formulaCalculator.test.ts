// Test file for formula calculator functionality
import { calculateFormula } from '../stores/planningStore';

// Test cases for formula validation
const testCases = [
  // Basic arithmetic
  { formula: '1000', expected: 1000 },
  { formula: '1000+500', expected: 1500 },
  { formula: '2000-300', expected: 1700 },
  { formula: '100*5', expected: 500 },
  { formula: '1000/4', expected: 250 },
  
  // Percentage calculations
  { formula: '3000*6%', expected: 180 },
  { formula: '3000-6%', expected: 2820 },
  { formula: '(3000-6%)-500', expected: 2320 },
  
  // Complex formulas
  { formula: '(5000*28%)*27.5%-908.73', expected: 471.27 },
  { formula: '10000*6%', expected: 600 },
  
  // Edge cases
  { formula: '0', expected: 0 },
  { formula: '100%', expected: 1 },
  { formula: '-500', expected: -500 },
];

// Run tests
console.log('🧮 Testing Formula Calculator...\n');

testCases.forEach((testCase, index) => {
  try {
    const result = calculateFormula(testCase.formula);
    const passed = Math.abs(result - testCase.expected) < 0.01; // Allow small floating point differences
    
    console.log(`Test ${index + 1}: ${testCase.formula}`);
    console.log(`Expected: ${testCase.expected}, Got: ${result}`);
    console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
  } catch (error) {
    console.log(`Test ${index + 1}: ${testCase.formula}`);
    console.log(`Error: ${error}`);
    console.log(`Status: ❌ FAILED\n`);
  }
});

console.log('Formula Calculator Tests Completed!');