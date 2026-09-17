import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import FormattedText from './FormattedText';

const QuestionCard = ({ question, onNext, onPrev, isFirst, isLast, currentNumber, totalInTopic }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Reset selection when the question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [question]);

  const handleSelect = (key) => {
    if (selectedOption) return;
    setSelectedOption(key);
  };

  const getOptionStyle = (key) => {
    if (!selectedOption) return "hover:bg-blue-50 border-slate-200 cursor-pointer";
    if (key === question.correct_answer) return "bg-green-50 border-green-500 text-green-900";
    if (key === selectedOption && key !== question.correct_answer) return "bg-red-50 border-red-500 text-red-900";
    return "opacity-50 border-slate-200";
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full">
      <div className="p-6 md:p-8 flex-grow">
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
          <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
            Q {currentNumber} of {totalInTopic}
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
              {question.category}
            </span>
            {question.answer_source === "AI_DEDUCED" && (
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Sparkles size={14} /> AI Solved
              </span>
            )}
            {question.is_reconstructed && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                <AlertCircle size={14} /> Scan Repaired
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-8 font-medium text-lg">
          <FormattedText text={question.question_text} />
        </div>

        {/* Options */}
        <div className="space-y-3">
          {Object.entries(question.options).map(([key, value]) => (
            <div 
              key={key}
              onClick={() => handleSelect(key)}
              className={`flex items-start p-4 rounded-lg border-2 transition-all duration-200 ${getOptionStyle(key)}`}
            >
              <span className="font-bold mr-4 w-6">{key}.</span>
              <div className="flex-1">
                <FormattedText text={value} />
              </div>
              {selectedOption && key === question.correct_answer && <CheckCircle2 className="text-green-500 shrink-0" />}
              {selectedOption && key === selectedOption && key !== question.correct_answer && <XCircle className="text-red-500 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Explanation */}
        {selectedOption && question.explanation && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-slate-700 text-sm animate-in fade-in">
            <strong>Explanation:</strong> <FormattedText text={question.explanation} />
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 rounded-b-xl flex justify-between">
        <button 
          onClick={onPrev} 
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button 
          onClick={onNext} 
          disabled={isLast}
          className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-30"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;