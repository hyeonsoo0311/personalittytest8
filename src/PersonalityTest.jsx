import React, { useState } from 'react';
import questions from './questions';
import results from './results';

const KNOWN_TYPES = Object.keys(results);

const getClosestResultType = (type) => {
  if (results[type]) return type;
  return "IYLP"; // fallback
};

export default function PersonalityTest() {
  const [answers, setAnswers] = useState(Array(60).fill(0));
  const [step, setStep] = useState(0);
  const [resultType, setResultType] = useState(null);

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);
    if (step < 59) setStep(step + 1);
    else calculateResult(updated);
  };

  const calculateResult = (scores) => {
    const emotion = avg(scores, [...Array(15).keys()]);
    const goal = avg(scores, [...Array(15).keys()].map(i => i + 15));
    const energy = avg(scores, [...Array(15).keys()].map(i => i + 30));
    const awareness = avg(scores, [...Array(15).keys()].map(i => i + 45));
    const rawType =
      (emotion >= 3.5 ? 'E' : 'I') +
      (goal >= 3.5 ? 'X' : 'Y') +
      (energy >= 3.5 ? 'R' : 'P') +
      (awareness >= 3.5 ? 'P' : 'N');
    const fixedType = getClosestResultType(rawType);
    setResultType(fixedType);
  };

  const avg = (arr, idxs) => idxs.reduce((sum, i) => sum + arr[i], 0) / idxs.length;

  if (resultType) {
    const result = results[resultType];
    return (
      <div className="p-6 max-w-4xl mx-auto whitespace-pre-wrap text-sm leading-relaxed">
        <h1 className="text-xl font-bold mb-4">당신의 유형: {resultType}</h1>
        <div>{result?.rawText}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">성격유형 테스트</h1>
      <p className="mb-4">문항 {step + 1}/60</p>
      <p className="mb-6">{questions[step]}</p>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(val => (
          <button key={val} onClick={() => handleAnswer(val)} className="py-2 px-3 rounded bg-blue-100 hover:bg-blue-300">
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
