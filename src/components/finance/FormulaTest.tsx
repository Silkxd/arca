import React, { useState } from 'react';
import { Calculator, CheckCircle, XCircle } from 'lucide-react';

// Import the formula calculator from the planning store
const calculateFormula = (formula: string): number => {
  try {
    // Remove spaces and convert to lowercase for processing
    let expression = formula.replace(/\s/g, '').toLowerCase();
    
    // Handle percentage calculations
    expression = expression.replace(/(\d+(?:\.\d+)?)%/g, (match, number) => {
      return `(${number}/100)`;
    });
    
    // Handle percentage operations like "3000-6%" -> "3000-(3000*6/100)"
    expression = expression.replace(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)%/g, (match, base, percent) => {
      return `(${base}-(${base}*${percent}/100))`;
    });
    
    // Validate that the expression only contains allowed characters
    if (!/^[\d+\-*/.()%\s]+$/.test(expression)) {
      throw new Error('Fórmula contém caracteres inválidos');
    }
    
    // Use Function constructor to safely evaluate the expression
    const result = new Function('return ' + expression)();
    
    if (typeof result !== 'number' || isNaN(result)) {
      throw new Error('Resultado inválido');
    }
    
    return Math.round(result * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    throw new Error('Erro ao calcular fórmula');
  }
};

interface TestCase {
  formula: string;
  expected: number;
  description: string;
}

const testCases: TestCase[] = [
  { formula: '1000', expected: 1000, description: 'Valor fixo' },
  { formula: '1000+500', expected: 1500, description: 'Soma simples' },
  { formula: '2000-300', expected: 1700, description: 'Subtração simples' },
  { formula: '100*5', expected: 500, description: 'Multiplicação simples' },
  { formula: '1000/4', expected: 250, description: 'Divisão simples' },
  { formula: '3000*6%', expected: 180, description: 'Porcentagem de valor' },
  { formula: '3000-6%', expected: 2820, description: 'Valor menos porcentagem' },
  { formula: '(3000-6%)-500', expected: 2320, description: 'Fórmula complexa com parênteses' },
  { formula: '5000*28%', expected: 1400, description: 'Cálculo de pró-labore' },
  { formula: '(5000*28%)*27.5%', expected: 385, description: 'Imposto sobre pró-labore (parte 1)' },
  { formula: '10000*6%', expected: 600, description: 'Imposto Simples' },
];

export const FormulaTest: React.FC = () => {
  const [results, setResults] = useState<Array<{
    testCase: TestCase;
    result: number | null;
    error: string | null;
    passed: boolean;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    const testResults = testCases.map(testCase => {
      try {
        const result = calculateFormula(testCase.formula);
        const passed = Math.abs(result - testCase.expected) < 0.01;
        return {
          testCase,
          result,
          error: null,
          passed
        };
      } catch (error) {
        return {
          testCase,
          result: null,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          passed: false
        };
      }
    });
    
    setResults(testResults);
    setIsRunning(false);
  };

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Calculator className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Teste de Fórmulas Matemáticas
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Validação das fórmulas utilizadas no planejamento financeiro
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Executando...' : 'Executar Testes'}
          </button>
          
          {results.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Resultado: {passedTests}/{totalTests} testes aprovados
              </span>
              {passedTests === totalTests ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.passed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.testCase.description}
                    </span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    result.passed
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                  }`}>
                    {result.passed ? 'PASSOU' : 'FALHOU'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>
                    <strong>Fórmula:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{result.testCase.formula}</code>
                  </div>
                  <div>
                    <strong>Esperado:</strong> {result.testCase.expected}
                  </div>
                  <div>
                    <strong>Obtido:</strong> {result.result !== null ? result.result : 'N/A'}
                  </div>
                  {result.error && (
                    <div className="text-red-600 dark:text-red-400">
                      <strong>Erro:</strong> {result.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};