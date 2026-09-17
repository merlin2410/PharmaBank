import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, LayoutGrid } from 'lucide-react';
import QuestionCard from './components/QuestionCard';

function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile toggle

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/master_question_bank.json`)
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        // Extract unique categories directly from the data
        const uniqueCats = ["All", ...new Set(data.map(q => q.category))].filter(Boolean);
        setCategories(uniqueCats);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load question bank:", err);
        setLoading(false);
      });
  }, []);

  // Filter questions dynamically based on selected topic
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'All') return allQuestions;
    return allQuestions.filter(q => q.category === selectedCategory);
  }, [allQuestions, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentIndex(0); // Reset to first question of new topic
    setIsSidebarOpen(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-slate-500">Loading Question Bank...</div>;
  }

  if (allQuestions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center font-semibold text-red-500">Failed to load data. Ensure master_question_bank.json is in public/data/</div>;
  }

  const currentQuestion = filteredQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900">Marianne Study</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-md">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed md:static inset-0 z-10 bg-white border-r border-slate-200 w-full md:w-80 flex flex-col h-screen transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-200 hidden md:block">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marianne Study</h1>
          <p className="text-slate-500 text-sm mt-1">{allQuestions.length} Questions Total</p>
        </div>

        <div className="p-6 border-b border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Topic</label>
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat} ({cat === 'All' ? allQuestions.length : allQuestions.filter(q => q.category === cat).length})</option>
            ))}
          </select>
        </div>

        {/* Question Grid */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
            <LayoutGrid size={18} /> <span>Jump to Question</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {filteredQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsSidebarOpen(false);
                }}
                className={`
                  h-10 w-10 rounded-md text-sm font-medium flex items-center justify-center transition-colors
                  ${index === currentIndex 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 h-[calc(100vh-73px)] md:h-screen">
        <div className="max-w-4xl mx-auto h-full flex flex-col pt-4 md:pt-8">
          {currentQuestion ? (
            <QuestionCard 
              question={currentQuestion}
              currentNumber={currentIndex + 1}
              totalInTopic={filteredQuestions.length}
              isFirst={currentIndex === 0}
              isLast={currentIndex === filteredQuestions.length - 1}
              onNext={() => setCurrentIndex(prev => Math.min(prev + 1, filteredQuestions.length - 1))}
              onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            />
          ) : (
            <div className="text-center text-slate-500 mt-20 font-medium">No questions found for this topic.</div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;